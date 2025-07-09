<?php
require_once 'config.php';

// Ensure user is logged in
requireLogin();

if ($_SERVER['REQUEST_METHOD'] == 'POST') {
    $current_password = $_POST['current_password'] ?? '';
    $new_password = $_POST['new_password'] ?? '';
    
    $response = array('success' => false, 'message' => '');
    
    // Validate input
    if (empty($current_password) || empty($new_password)) {
        $response['message'] = "Both fields are required";
    } elseif (strlen($new_password) < 8) {
        $response['message'] = "New password must be at least 8 characters long";
    } else {
        try {
            // Get user's current password from database
            $stmt = $pdo->prepare("SELECT password FROM users WHERE id = ?");
            $stmt->execute([$_SESSION['user_id']]);
            $user = $stmt->fetch();
            
            // Verify current password
            if (!$user || !password_verify($current_password, $user['password'])) {
                $response['message'] = "Current password is incorrect";
            } else {
                // Hash new password and update
                $new_password_hash = password_hash($new_password, PASSWORD_DEFAULT);
                
                $update_stmt = $pdo->prepare("UPDATE users SET password = ? WHERE id = ?");
                $update_stmt->execute([$new_password_hash, $_SESSION['user_id']]);
                
                $response['success'] = true;
                $response['message'] = "Password successfully updated";
                
                // Log the password change
                error_log("Password changed for user ID: " . $_SESSION['user_id']);
            }
        } catch(PDOException $e) {
            $response['message'] = "Password change failed";
            error_log("Password change error: " . $e->getMessage());
        }
    }
    
    // Return JSON response
    header('Content-Type: application/json');
    echo json_encode($response);
    exit();
}
