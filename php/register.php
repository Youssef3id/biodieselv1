<?php
require_once 'config.php';

$error = '';
$success = '';

if ($_SERVER['REQUEST_METHOD'] == 'POST') {
    $username = trim($_POST['username'] ?? '');
    $email = trim($_POST['email'] ?? '');
    $password = $_POST['password'] ?? '';
    $confirm_password = $_POST['confirm-password'] ?? '';
    
    // Validate inputs
    if (empty($username) || empty($email) || empty($password) || empty($confirm_password)) {
        $error = "All fields are required";
    } elseif (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
        $error = "Invalid email format";
    } elseif ($password !== $confirm_password) {
        $error = "Passwords do not match";
    } else {
        try {
            // Check if email already exists
            $stmt = $pdo->prepare("SELECT id FROM users WHERE email = ?");
            $stmt->execute([$email]);
            
            if ($stmt->rowCount() > 0) {
                $error = "Email already registered";
            } else {
                // Insert new user
                $hashedPassword = password_hash($password, PASSWORD_DEFAULT);
                $stmt = $pdo->prepare("INSERT INTO users (username, email, password) VALUES (?, ?, ?)");
                $stmt->execute([$username, $email, $hashedPassword]);
                
                $success = "Registration successful! You can now login.";
            }
        } catch(PDOException $e) {
            $error = "Registration failed: " . $e->getMessage();
        }
    }
}
?>

<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Register - Biodiesel</title>
    <link href="https://fonts.googleapis.com/css2?family=Poppins:wght@400;500;600;700&display=swap" rel="stylesheet">
    <style>
        * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
        }
        
        body {
            font-family: 'Poppins', sans-serif;
            background-color: #ffffff;
            color: #333;
            line-height: 1.6;
            min-height: 100vh;
        }
        
        .container {
            display: flex;
            min-height: 100vh;
        }
        
        .left-panel {
            flex: 1;
            background: url('../assets/icons/login.svg');
            background-size: cover;
            background-position: center;
        }
        
        .right-panel {
            flex: 1;
            display: flex;
            justify-content: center;
            align-items: center;
            padding: 50px;
        }
        
        .form-container {
            width: 100%;
            max-width: 400px;
        }
        
        .form-container h2 {
            font-size: 1.8rem;
            font-weight: 600;
            margin-bottom: 30px;
            color: #2c3e50;
            line-height: 1.3;
        }
        
        .input-group {
            position: relative;
            margin-bottom: 25px;
        }
        
        .input-group label {
            display: block;
            font-size: 0.8rem;
            color: #888;
            margin-bottom: 5px;
        }
        
        .input-group input {
            width: 100%;
            border: none;
            border-bottom: 1px solid #ddd;
            padding: 10px 0;
            font-size: 1rem;
            background: transparent;
        }
        
        .input-group input:focus {
            outline: none;
            border-bottom-color: #27ae60;
        }
        
        .toggle-password {
            position: absolute;
            right: 5px;
            top: 50%;
            cursor: pointer;
            color: #aaa;
        }
        
        .options {
            margin-bottom: 25px;
        }
        
        .checkbox-container {
            display: block;
            position: relative;
            padding-left: 30px;
            cursor: pointer;
            font-size: 0.9rem;
            user-select: none;
            color: #666;
        }
        
        .checkbox-container input {
            position: absolute;
            opacity: 0;
            cursor: pointer;
            height: 0;
            width: 0;
        }
        
        .checkmark {
            position: absolute;
            top: 0;
            left: 0;
            height: 20px;
            width: 20px;
            background-color: #eee;
            border-radius: 5px;
        }
        
        .checkbox-container:hover input ~ .checkmark {
            background-color: #ccc;
        }
        
        .checkbox-container input:checked ~ .checkmark {
            background-color: #27ae60;
        }
        
        .checkmark:after {
            content: "";
            position: absolute;
            display: none;
        }
        
        .checkbox-container input:checked ~ .checkmark:after {
            display: block;
        }
        
        .checkbox-container .checkmark:after {
            left: 7px;
            top: 3px;
            width: 5px;
            height: 10px;
            border: solid white;
            border-width: 0 3px 3px 0;
            transform: rotate(45deg);
        }
        
        .btn {
            width: 100%;
            padding: 15px;
            border: none;
            border-radius: 25px;
            background-color: #27ae60;
            color: white;
            font-size: 1rem;
            font-weight: 600;
            cursor: pointer;
            transition: background-color 0.3s;
        }
        
        .btn:hover {
            background-color: #219d55;
        }
        
        .footer-text {
            text-align: center;
            margin-top: 20px;
            font-size: 0.9rem;
        }
        
        .footer-text a {
            color: #27ae60;
            text-decoration: none;
            font-weight: 600;
        }
        
        .alert {
            margin-bottom: 1.5rem;
            padding: 0.75rem;
            border-radius: 5px;
        }
        
        .alert-danger {
            background-color: #f8d7da;
            border: 1px solid #f5c2c7;
            color: #842029;
        }
        
        .alert-success {
            background-color: #d1e7dd;
            border: 1px solid #badbcc;
            color: #0f5132;
        }
        
        .alert-link {
            color: #0c4128;
            text-decoration: underline;
        }
        
        @media (max-width: 992px) {
            .left-panel {
                display: none;
            }
            .right-panel {
                flex: 1 1 100%;
            }
        }
    </style>
</head>
<body>
    <div class="container">
        <div class="left-panel"></div>
        <div class="right-panel">
            <div class="form-container">
                <h2>Join & Connect the Fastest<br>Growing Online Company</h2>
                
                <?php if ($error): ?>
                    <div class="alert alert-danger">
                        <?php echo htmlspecialchars($error); ?>
                    </div>
                <?php endif; ?>
                
                <?php if ($success): ?>
                    <div class="alert alert-success">
                        <?php echo htmlspecialchars($success); ?>
                        <p class="mb-0 mt-2"><a href="login.php" class="alert-link">Go to Login</a></p>
                    </div>
                <?php endif; ?>

                <form method="POST">
                    <div class="input-group">
                        <label for="username">Username</label>
                        <input type="text" id="username" name="username" required>
                    </div>
                    <div class="input-group">
                        <label for="email">Email</label>
                        <input type="email" id="email" name="email" required>
                    </div>
                    <div class="input-group">
                        <label for="password">Password</label>
                        <input type="password" id="password" name="password" required>
                        <span class="toggle-password">👁️</span>
                    </div>
                    <div class="input-group">
                        <label for="confirm-password">Confirm Password</label>
                        <input type="password" id="confirm-password" name="confirm-password" required>
                        <span class="toggle-password">👁️</span>
                    </div>
                    <div class="options">
                        <label class="checkbox-container">
                            I accept the terms & Conditions
                            <input type="checkbox" name="terms" required>
                            <span class="checkmark"></span>
                        </label>
                    </div>
                    <button type="submit" class="btn">Register</button>
                </form>
                <p class="footer-text">
                    Own an Account? <a href="login.php">JUMP RIGHT IN</a>
                </p>
            </div>
        </div>
    </div>

    <script>
        // Toggle password visibility
        document.querySelectorAll('.toggle-password').forEach(function(element) {
            element.addEventListener('click', function() {
                const passwordInput = this.previousElementSibling;
                if (passwordInput.type === 'password') {
                    passwordInput.type = 'text';
                } else {
                    passwordInput.type = 'password';
                }
            });
        });
        
        // Form validation
        const form = document.querySelector('form');
        form.addEventListener('submit', function(event) {
            const password = document.getElementById('password').value;
            const confirmPassword = document.getElementById('confirm-password').value;
            const terms = document.querySelector('input[name="terms"]');
            
            if (password !== confirmPassword) {
                alert('Passwords do not match!');
                event.preventDefault();
            }
            
            if (!terms.checked) {
                alert('You must accept the terms and conditions!');
                event.preventDefault();
            }
        });
    </script>
</body>
</html>