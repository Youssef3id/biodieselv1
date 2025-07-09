<?php
require_once 'config.php';

// Redirect if already logged in
if (isset($_SESSION['user_id'])) {
    header('Location: dashboard.php');
    exit();
}

$error = '';

if ($_SERVER['REQUEST_METHOD'] == 'POST') {
    $email = trim($_POST['email'] ?? '');
    $password = $_POST['password'] ?? '';
    
    if (empty($email) || empty($password)) {
        $error = "Both fields are required";
    } else {
        try {
            $stmt = $pdo->prepare("SELECT id, email, password FROM users WHERE email = ?");
            $stmt->execute([$email]);
            $user = $stmt->fetch();
            
            if ($user && password_verify($password, $user['password'])) {
                $_SESSION['user_id'] = $user['id'];
                $_SESSION['user_email'] = $user['email'];
                header('Location: dashboard.php');
                exit();
            } else {
                $error = "Invalid email or password";
            }
        } catch(PDOException $e) {
            $error = "Login failed: " . $e->getMessage();
        }
    }
}
?>

<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Login - Biodiesel</title>
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
        
        .error-message {
            background-color: #f8d7da;
            border: 1px solid #f5c2c7;
            border-radius: 5px;
            padding: 0.75rem;
            margin-bottom: 1.5rem;
            color: #842029;
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
                <h2 style="text-align: center" center>Welcome back to<br>BioDiesel</h2>
                
                <?php if ($error): ?>
                    <div class="error-message">
                        <?php echo htmlspecialchars($error); ?>
                    </div>
                <?php endif; ?>

                <form method="POST">
                    <div class="input-group">
                        <label for="email">Email or User</label>
                        <input type="text" id="email" name="email" required placeholder="Enter your email">
                    </div>
                    <div class="input-group">
                        <label for="password">Password</label>
                        <input type="password" id="password" name="password" required placeholder="Enter your password">
                        <span class="toggle-password">👁️</span>
                    </div>
                    <div class="options">
                        <label class="checkbox-container">
                            Remember me
                            <input type="checkbox" name="remember">
                            <span class="checkmark"></span>
                        </label>
                    </div>
                    <button type="submit" class="btn">LOG IN</button>
                </form>
                <p class="footer-text">
                    No Account yet? <a href="register.php">SIGN UP</a>
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
    </script>
</body>
</html>