<?php
include 'php/check_role.php';
if ($isAdmin) {
    header('Location: ../php/dashboard.php');
} else {
    header('Location: user/index.html');
}
?>