<?php
// Disable error display for API endpoint
error_reporting(E_ALL);
ini_set('display_errors', 0);

// Set headers for JSON response
header('Content-Type: application/json');

// Start session and include config
session_start();
define('DEVELOPMENT_MODE', false);  // Set to false for production
require_once 'config.php';

try {
    // Check if user is logged in
    if (!isset($_SESSION['user_id'])) {
        throw new Exception('User not logged in');
    }
    
    $userId = $_SESSION['user_id'];

    // Prepare and execute query to get user's cards
    $stmt = $conn->prepare("
        SELECT 
            id,
            card_type,
            card_holder_name,
            card_number,
            DATE_FORMAT(expiration_date, '%m/%y') as expiration_date,
            created_at
        FROM credit_cards 
        WHERE user_id = ? 
        ORDER BY created_at DESC
    ");

    if (!$stmt) {
        throw new Exception('Failed to prepare statement');
    }

    $stmt->bind_param("i", $userId);
    
    if (!$stmt->execute()) {
        throw new Exception('Failed to fetch cards');
    }

    $result = $stmt->get_result();
    $cards = [];

    while ($row = $result->fetch_assoc()) {
        // Format card data
        $cards[] = [
            'id' => $row['id'],
            'cardType' => $row['card_type'],
            'cardHolder' => $row['card_holder_name'],
            'cardNumber' => $row['card_number'],
            'expirationDate' => $row['expiration_date'],
            'createdAt' => $row['created_at']
        ];
    }

    // Return success response with cards
    echo json_encode([
        'success' => true,
        'cards' => $cards
    ]);

} catch (Exception $e) {
    // Return error response
    echo json_encode([
        'success' => false,
        'message' => $e->getMessage()
    ]);
}

// Close database connection
$conn->close(); 