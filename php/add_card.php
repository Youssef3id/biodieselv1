<?php
// Start output buffering
ob_start();

// Set headers for JSON response and CORS
header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: POST');
header('Access-Control-Allow-Headers: Content-Type');

// Start session and include config
session_start();
define('DEVELOPMENT_MODE', false);  // Set to false for production
require_once 'config.php';

// Enable error reporting for debugging
error_reporting(E_ALL);
ini_set('display_errors', 1);

// Clear any output buffered so far
ob_clean();

// Handle preflight requests
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit();
}

// Check if the request is POST
if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    echo json_encode(['success' => false, 'message' => 'Invalid request method']);
    exit();
}

// Check if user is logged in
if (!isset($_SESSION['user_id'])) {
    echo json_encode(['success' => false, 'message' => 'User not logged in']);
    exit();
}

try {
    // Get JSON data from request body
    $jsonData = file_get_contents('php://input');
    if (!$jsonData) {
        throw new Exception('No data received');
    }

    $data = json_decode($jsonData, true);
    if (json_last_error() !== JSON_ERROR_NONE) {
        throw new Exception('Invalid JSON data: ' . json_last_error_msg());
    }

    // Validate required fields
    $requiredFields = ['cardType', 'cardName', 'cardNumber', 'expirationDate'];
    foreach ($requiredFields as $field) {
        if (!isset($data[$field]) || trim($data[$field]) === '') {
            throw new Exception("Missing or empty field: {$field}");
        }
    }

    // Sanitize and validate inputs
    $cardType = htmlspecialchars(trim($data['cardType']), ENT_QUOTES, 'UTF-8');
    $cardName = htmlspecialchars(trim($data['cardName']), ENT_QUOTES, 'UTF-8');
    $cardNumber = preg_replace('/\s+/', '', $data['cardNumber']);
    $expirationDate = trim($data['expirationDate']);

    // Validate card number
    if (!preg_match('/^\d{16}$/', $cardNumber)) {
        throw new Exception('Card number must be exactly 16 digits');
    }

    // Validate expiration date
    $expDate = new DateTime($expirationDate);
    $today = new DateTime();
    if ($expDate <= $today) {
        throw new Exception('Expiration date must be in the future');
    }

    // Mask card number for storage (keep only last 4 digits)
    $maskedCardNumber = str_repeat('*', 12) . substr($cardNumber, -4);

    // Get user ID from session
    $userId = $_SESSION['user_id'];

    // Check if card number already exists for this user
    $checkStmt = $conn->prepare("SELECT id FROM credit_cards WHERE user_id = ? AND card_number LIKE ?");
    if (!$checkStmt) {
        throw new Exception('Database error: ' . $conn->error);
    }

    $lastFourDigits = substr($cardNumber, -4);
    $checkNumber = '%' . $lastFourDigits;
    $checkStmt->bind_param("is", $userId, $checkNumber);
    
    if (!$checkStmt->execute()) {
        throw new Exception('Database error: ' . $checkStmt->error);
    }

    $result = $checkStmt->get_result();
    if ($result->num_rows > 0) {
        throw new Exception('This card has already been added');
    }
    $checkStmt->close();

    // Insert into database
    $stmt = $conn->prepare("INSERT INTO credit_cards (user_id, card_type, card_holder_name, card_number, expiration_date, created_at) VALUES (?, ?, ?, ?, ?, NOW())");
    
    if (!$stmt) {
        throw new Exception('Database error: ' . $conn->error);
    }

    $stmt->bind_param("issss", $userId, $cardType, $cardName, $maskedCardNumber, $expirationDate);
    
    if (!$stmt->execute()) {
        throw new Exception('Database error: ' . $stmt->error);
    }

    $newCardId = $conn->insert_id;
    $stmt->close();

    // Return success response with the new card data
    echo json_encode([
        'success' => true,
        'message' => 'Card added successfully',
        'card' => [
            'id' => $newCardId,
            'cardType' => $cardType,
            'cardHolder' => $cardName,
            'cardNumber' => $maskedCardNumber,
            'expirationDate' => date('m/y', strtotime($expirationDate))
        ]
    ]);

} catch (Exception $e) {
    // Log the error
    error_log('Error adding card: ' . $e->getMessage());
    
    // Return error response
    echo json_encode([
        'success' => false,
        'message' => $e->getMessage()
    ]);
}

// Close database connection
if (isset($conn)) {
    $conn->close();
}

// Ensure only JSON output is sent
$output = ob_get_clean();
if (json_decode($output) === null) {
    // If there were any errors/warnings before the JSON, strip them
    $output = substr($output, strpos($output, '{'));
}
echo $output; 