<?php
require_once 'config.php';

// Set headers for JSON response
header('Content-Type: application/json');

try {
    // Check if user is logged in
    if (!isLoggedIn()) {
        echo json_encode([
            'success' => false,
            'authenticated' => false,
            'message' => 'Not logged in'
        ]);
        exit();
    }

    // Return success with user data
    echo json_encode([
        'success' => true,
        'authenticated' => true,
        'user' => [
            'id' => $_SESSION['user_id'],
            'name' => $_SESSION['name'] ?? null,
            'email' => $_SESSION['email'] ?? null
        ]
    ]);

} catch (Exception $e) {
    error_log('Auth check error: ' . $e->getMessage());
    echo json_encode([
        'success' => false,
        'message' => 'Authentication check failed'
    ]);
} 