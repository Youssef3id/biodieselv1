<?php
session_start();
require_once '../../../php/config.php';

// Check if user is logged in
if (!isset($_SESSION['user_id'])) {
    if ($_SERVER['REQUEST_METHOD'] === 'POST') {
        echo json_encode(['success' => false, 'message' => 'User not logged in']);
    } else {
        header("Location: /login.php");
    }
    exit();
}

// Get user data from database
$user_id = $_SESSION['user_id'];
$stmt = $conn->prepare("SELECT * FROM users WHERE id = ?");
$stmt->bind_param("i", $user_id);
$stmt->execute();
$result = $stmt->get_result();
$user = $result->fetch_assoc();

// Initialize default values if user data is not found
if (!$user) {
    $user = array(
        'name' => '',
        'username' => '',
        'email' => '',
        'date_of_birth' => '',
        'present_address' => '',
        'permanent_address' => '',
        'country' => '',
        'city' => '',
        'postal_code' => '',
        'profile_image' => ''
    );
}

// Handle AJAX requests
if ($_SERVER['REQUEST_METHOD'] === 'GET' && isset($_SERVER['HTTP_X_REQUESTED_WITH']) && $_SERVER['HTTP_X_REQUESTED_WITH'] === 'XMLHttpRequest') {
    // Return user data as JSON
    echo json_encode([
        'success' => true,
        'userData' => [
            'yourName' => $user['name'],
            'userName' => $user['username'],
            'email' => $user['email'],
            'dateOfBirth' => $user['date_of_birth'],
            'presentAddress' => $user['present_address'],
            'permanentAddress' => $user['permanent_address'],
            'country' => $user['country'],
            'city' => $user['city'],
            'postalCode' => $user['postal_code'],
            'profile_image' => $user['profile_image']
        ]
    ]);
    exit();
}

// Handle form submission
if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    try {
        $name = $_POST['yourName'] ?? '';
        $username = $_POST['userName'] ?? '';
        $email = $_POST['email'] ?? '';
        $dob = !empty($_POST['dateOfBirth']) ? $_POST['dateOfBirth'] : null;
        $present_address = $_POST['presentAddress'] ?? '';
        $permanent_address = $_POST['permanentAddress'] ?? '';
        $country = $_POST['country'] ?? '';
        $city = $_POST['city'] ?? '';
        $postal_code = $_POST['postalCode'] ?? '';

        // First, check if all required columns exist
        $check_columns = $conn->query("SHOW COLUMNS FROM users LIKE 'date_of_birth'");
        if ($check_columns->num_rows === 0) {
            throw new Exception("Database structure needs to be updated. Please run the update script first.");
        }

        // Update user data
        $update_sql = "UPDATE users SET 
                      name = ?, 
                      username = ?, 
                      email = ?, 
                      date_of_birth = ?, 
                      present_address = ?, 
                      permanent_address = ?, 
                      country = ?, 
                      city = ?, 
                      postal_code = ? 
                      WHERE id = ?";
        
        $update_stmt = $conn->prepare($update_sql);
        if ($update_stmt === false) {
            throw new Exception("Failed to prepare statement: " . $conn->error);
        }

        $update_stmt->bind_param("sssssssssi", 
            $name, 
            $username, 
            $email, 
            $dob, 
            $present_address, 
            $permanent_address, 
            $country, 
            $city, 
            $postal_code, 
            $user_id
        );
        
        if ($update_stmt->execute()) {
            // Get updated user data
            $stmt = $conn->prepare("SELECT * FROM users WHERE id = ?");
            $stmt->bind_param("i", $user_id);
            $stmt->execute();
            $result = $stmt->get_result();
            $updated_user = $result->fetch_assoc();
            
            echo json_encode([
                'success' => true,
                'message' => 'Profile updated successfully!',
                'userData' => [
                    'yourName' => $updated_user['name'],
                    'userName' => $updated_user['username'],
                    'email' => $updated_user['email'],
                    'dateOfBirth' => $updated_user['date_of_birth'],
                    'presentAddress' => $updated_user['present_address'],
                    'permanentAddress' => $updated_user['permanent_address'],
                    'country' => $updated_user['country'],
                    'city' => $updated_user['city'],
                    'postalCode' => $updated_user['postal_code'],
                    'profile_image' => $updated_user['profile_image']
                ]
            ]);
            exit();
        } else {
            throw new Exception("Error updating profile: " . $update_stmt->error);
        }
    } catch (Exception $e) {
        echo json_encode([
            'success' => false,
            'message' => $e->getMessage()
        ]);
        exit();
    }
}

// For regular GET requests, include the HTML template with initial user data
require_once '../edit-profile.html';
?>
