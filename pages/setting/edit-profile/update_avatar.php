<?php
session_start();
require_once '../../../php/config.php';

// Check if user is logged in
if (!isset($_SESSION['user_id'])) {
    echo json_encode(['success' => false, 'message' => 'User not logged in']);
    exit();
}

// Check if file was uploaded
if (!isset($_FILES['profile_image']) || $_FILES['profile_image']['error'] !== UPLOAD_ERR_OK) {
    echo json_encode(['success' => false, 'message' => 'No file uploaded or upload error']);
    exit();
}

$file = $_FILES['profile_image'];
$allowedTypes = ['image/jpeg', 'image/png', 'image/gif'];
$maxFileSize = 5 * 1024 * 1024; // 5MB

// Validate file type
if (!in_array($file['type'], $allowedTypes)) {
    echo json_encode(['success' => false, 'message' => 'Invalid file type. Only JPG, PNG and GIF are allowed.']);
    exit();
}

// Validate file size
if ($file['size'] > $maxFileSize) {
    echo json_encode(['success' => false, 'message' => 'File is too large. Maximum size is 5MB.']);
    exit();
}

// Create upload directory if it doesn't exist
$uploadDir = '../../../uploads/profile_images/';
if (!file_exists($uploadDir)) {
    mkdir($uploadDir, 0777, true);
}

// Generate unique filename
$extension = pathinfo($file['name'], PATHINFO_EXTENSION);
$filename = uniqid('profile_') . '.' . $extension;
$targetPath = $uploadDir . $filename;

// Move uploaded file
if (move_uploaded_file($file['tmp_name'], $targetPath)) {
    // Update database with new image path
    $imageUrl = '/uploads/profile_images/' . $filename;
    $userId = $_SESSION['user_id'];
    
    $stmt = $conn->prepare("UPDATE users SET profile_image = ? WHERE id = ?");
    $stmt->bind_param("si", $imageUrl, $userId);
    
    if ($stmt->execute()) {
        echo json_encode([
            'success' => true,
            'message' => 'Profile picture updated successfully',
            'imageUrl' => $imageUrl
        ]);
    } else {
        echo json_encode([
            'success' => false,
            'message' => 'Failed to update database'
        ]);
    }
} else {
    echo json_encode([
        'success' => false,
        'message' => 'Failed to save uploaded file'
    ]);
} 