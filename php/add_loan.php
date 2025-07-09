<?php
require_once 'config.php';

// Check if user is logged in
if (!isset($_SESSION['user_id'])) {
    header('Location: login.php');
    exit();
}

$error = '';
$success = '';

if ($_SERVER['REQUEST_METHOD'] == 'POST') {
    $cx = trim($_POST['cx'] ?? '');
    $loan_money = floatval($_POST['loan_money'] ?? 0);
    $duration = $_POST['duration'] ?? '';
    $interest_rate = floatval($_POST['interest_rate'] ?? 0);
    
    if (empty($cx) || $loan_money <= 0 || empty($duration) || $interest_rate <= 0) {
        $error = "All fields are required and amounts must be greater than 0";
    } else {
        try {
            // Calculate installment
            $months = intval($duration);
            $total_amount = $loan_money * (1 + ($interest_rate / 100));
            $installment = $total_amount / $months;
            
            $stmt = $pdo->prepare("INSERT INTO loans (user_id, cx, loan_money, left_to_repay, duration, interest_rate, installment) 
                                 VALUES (?, ?, ?, ?, ?, ?, ?)");
            
            $stmt->execute([
                $_SESSION['user_id'],
                $cx,
                $loan_money,
                $loan_money, // Initially, left_to_repay equals loan_money
                $duration,
                $interest_rate,
                $installment
            ]);
            
            $success = "Loan added successfully!";
        } catch(PDOException $e) {
            $error = "Failed to add loan: " . $e->getMessage();
        }
    }
}
?>

<!DOCTYPE html>
<html>
<head>
    <title>Add Loan - Biodiesel</title>
</head>
<body>
    <h2>Add New Loan</h2>
    
    <?php if ($error): ?>
        <p style="color: red;"><?php echo htmlspecialchars($error); ?></p>
    <?php endif; ?>
    
    <?php if ($success): ?>
        <p style="color: green;"><?php echo htmlspecialchars($success); ?></p>
    <?php endif; ?>

    <form method="POST">
        <div>
            <label>Customer ID (CX):</label><br>
            <input type="text" name="cx" required>
        </div>
        <div>
            <label>Loan Amount:</label><br>
            <input type="number" name="loan_money" step="0.01" min="0.01" required>
        </div>
        <div>
            <label>Duration (months):</label><br>
            <input type="number" name="duration" min="1" required>
        </div>
        <div>
            <label>Interest Rate (%):</label><br>
            <input type="number" name="interest_rate" step="0.01" min="0.01" required>
        </div>
        <div>
            <button type="submit">Add Loan</button>
        </div>
    </form>
    
    <p><a href="dashboard.php">Back to Dashboard</a></p>
</body>
</html> 