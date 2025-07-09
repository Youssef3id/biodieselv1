<?php
// Enable error reporting for development
if (defined('DEVELOPMENT_MODE') && DEVELOPMENT_MODE === true) {
    error_reporting(E_ALL);
    ini_set('display_errors', 1);
} else {
    error_reporting(E_ALL);
    ini_set('display_errors', 0);
}

// Database configuration
$host = 'localhost';
$dbname = 'Biodiesel';
$username = 'root';  // Change this to your MySQL username
$password = '';      // Change this to your MySQL password

// Create mysqli connection
$conn = new mysqli($host, $username, $password, $dbname);

// Check mysqli connection
if ($conn->connect_error) {
    error_log("Connection failed: " . $conn->connect_error);
    die("Connection failed: " . $conn->connect_error);
}

// Create PDO connection
try {
    $pdo = new PDO("mysql:host=$host;dbname=$dbname", $username, $password);
    $pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
} catch(PDOException $e) {
    error_log("PDO Connection failed: " . $e->getMessage());
    die("Connection failed: " . $e->getMessage());
}

// Start session if not already started
if (session_status() == PHP_SESSION_NONE) {
    session_start();
}

// Function to check if user is logged in
function isLoggedIn() {
    return isset($_SESSION['user_id']);
}

// Function to require login
function requireLogin() {
    if (!isLoggedIn()) {
        header('Location: /php/login.php');
        exit();
    }
}

// Set default timezone
date_default_timezone_set('UTC');
?> 