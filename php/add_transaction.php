<?php
require_once 'config.php';

// Check if user is logged in
if (!isset($_SESSION['user_id'])) {
    header('Content-Type: application/json');
    echo json_encode(['success' => false, 'message' => 'User not logged in']);
    exit();
}

if ($_SERVER['REQUEST_METHOD'] == 'POST') {
    $customer_name = trim($_POST['customer_name'] ?? '');
    $type = $_POST['type'] ?? '';
    $amount = floatval($_POST['amount'] ?? 0);
    
    if (empty($customer_name) || empty($type) || $amount <= 0) {
        header('Content-Type: application/json');
        echo json_encode(['success' => false, 'message' => 'All fields are required and amount must be greater than 0']);
        exit();
    }

    try {
        $stmt = $pdo->prepare("INSERT INTO transactions (user_id, customer_name, transaction_id, type, date, amount) 
                             VALUES (?, ?, ?, ?, NOW(), ?)");
        
        $transaction_id = uniqid('TRX');
        $stmt->execute([
            $_SESSION['user_id'],
            $customer_name,
            $transaction_id,
            $type,
            $amount
        ]);
        
        header('Content-Type: application/json');
        echo json_encode([
            'success' => true, 
            'message' => 'Transaction added successfully!',
            'transaction_id' => $transaction_id
        ]);
        exit();
    } catch(PDOException $e) {
        header('Content-Type: application/json');
        echo json_encode(['success' => false, 'message' => 'Failed to add transaction: ' . $e->getMessage()]);
        exit();
    }
}

// If not a POST request
header('Content-Type: application/json');
echo json_encode(['success' => false, 'message' => 'Invalid request method']);
exit(); 