<?php
// Include database configuration and session handling
require_once 'config.php';

// Function to check if user has admin role
function isAdmin() {
    if (!isLoggedIn()) {
        return false;
    }
    
    global $pdo;
    try {
        $stmt = $pdo->prepare("SELECT role FROM users WHERE id = ?");
        $stmt->execute([$_SESSION['user_id']]);
        $user = $stmt->fetch(PDO::FETCH_ASSOC);
        
        return ($user && $user['role'] === 'admin');
    } catch(PDOException $e) {
        error_log("Error checking admin role: " . $e->getMessage());
        return false;
    }
}

// Function to require admin role
function requireAdmin() {
    if (!isAdmin()) {
        // Redirect to loans page if not admin
        header('Location: /pages/loans/index.html');
        exit();
    }
}

// Check if this file is being accessed directly
if (basename($_SERVER['PHP_SELF']) === 'check_role.php') {
    // If accessed directly, check admin status and return JSON response
    header('Content-Type: application/json');
    echo json_encode(['isAdmin' => isAdmin()]);
    exit();
}
?> 