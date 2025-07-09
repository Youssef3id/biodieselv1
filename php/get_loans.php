<?php
require_once 'config.php';
header('Content-Type: application/json');

try {
    $pdo = new PDO("mysql:host=$host;dbname=$dbname", $username, $password);
    $pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);

    // Get all active loans
    $stmt = $pdo->query("SELECT 
        loan_id,
        loan_amount,
        remaining_amount,
        duration_months,
        interest_rate,
        monthly_installment,
        loan_type
    FROM loans 
    WHERE status = 'active'
    ORDER BY loan_id");

    $loans = $stmt->fetchAll(PDO::FETCH_ASSOC);

    // Calculate totals
    $totals = [
        'total_loan_amount' => 0,
        'total_remaining' => 0,
        'total_installment' => 0,
        'personal_loans' => 0,
        'corporate_loans' => 0,
        'business_loans' => 0,
        'personal_loans_amount' => 0,
        'corporate_loans_amount' => 0,
        'business_loans_amount' => 0
    ];

    foreach ($loans as $loan) {
        $totals['total_loan_amount'] += $loan['loan_amount'];
        $totals['total_remaining'] += $loan['remaining_amount'];
        $totals['total_installment'] += $loan['monthly_installment'];

        // Count and sum by loan type
        switch ($loan['loan_type']) {
            case 'personal':
                $totals['personal_loans']++;
                $totals['personal_loans_amount'] += $loan['loan_amount'];
                break;
            case 'corporate':
                $totals['corporate_loans']++;
                $totals['corporate_loans_amount'] += $loan['loan_amount'];
                break;
            case 'business':
                $totals['business_loans']++;
                $totals['business_loans_amount'] += $loan['loan_amount'];
                break;
        }
    }

    echo json_encode([
        'success' => true,
        'loans' => $loans,
        'totals' => $totals
    ]);

} catch (PDOException $e) {
    echo json_encode([
        'success' => false,
        'error' => 'Database error: ' . $e->getMessage()
    ]);
}
?> 