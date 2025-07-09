/**
 * Main initialization function for Loans page
 * Handles animations and interactions
 */
document.addEventListener('DOMContentLoaded', function() {
    // Add hover effects to cards
    animateLoanCards();
    
    // Add table row animations
    animateTableRows();

    // Fetch loan data from backend
    fetchLoanData();
});

/**
 * Add hover effects to loan cards
 */
function animateLoanCards() {
    const cards = document.querySelectorAll('.cards .card');
    cards.forEach(card => {
        card.addEventListener('mouseenter', () => {
            card.style.transform = 'translateY(-10px)';
            card.style.boxShadow = '0 15px 30px rgba(0, 0, 0, 0.1)';
        });
        
        card.addEventListener('mouseleave', () => {
            card.style.transform = 'translateY(-5px)';
            card.style.boxShadow = '0 10px 25px rgba(0, 0, 0, 0.1)';
        });
    });
}

/**
 * Add animations to table rows
 */
function animateTableRows() {
    const rows = document.querySelectorAll('#loanTableBody tr');
    rows.forEach(row => {
        row.addEventListener('mouseenter', () => {
            row.style.transform = 'translateX(5px)';
            row.style.boxShadow = '0 4px 12px rgba(0, 0, 0, 0.1)';
        });
        
        row.addEventListener('mouseleave', () => {
            row.style.transform = '';
            row.style.boxShadow = '';
        });
    });
}

/**
 * Fetch loan data from backend
 */
async function fetchLoanData() {
    try {
        const response = await fetch('http://localhost/project-un/php/get_loans.php');
        const data = await response.json();

        if (data.success) {
            updateLoanCards(data.totals);
            updateLoanTable(data.loans, data.totals);
        } else {
            console.error('Error fetching loan data:', data.error);
           
        }
    } catch (error) {
        console.error('Error fetching loan data:', error);
        
    }
}


/**
 * Update loan cards with totals
 */
function updateLoanCards(totals) {
    // Update Personal Loans card
    document.querySelector('.cards .card:nth-child(1) .card-title').textContent = 
        `Personal Loans (${totals.personal_loans})`;
    document.querySelector('.cards .card:nth-child(1) .card-value').textContent = 
        formatCurrency(totals.personal_loans_amount);

    // Update Corporate Loans card
    document.querySelector('.cards .card:nth-child(2) .card-title').textContent = 
        `Corporate Loans (${totals.corporate_loans})`;
    document.querySelector('.cards .card:nth-child(2) .card-value').textContent = 
        formatCurrency(totals.corporate_loans_amount);

    // Update Business Loans card
    document.querySelector('.cards .card:nth-child(3) .card-title').textContent = 
        `Business Loans (${totals.business_loans})`;
    document.querySelector('.cards .card:nth-child(3) .card-value').textContent = 
        formatCurrency(totals.business_loans_amount);
}

/**
 * Update loan table with data
 */
function updateLoanTable(loans, totals) {
    const tableBody = document.getElementById('loanTableBody');
    tableBody.innerHTML = '';

    loans.forEach(loan => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td><strong>${loan.loan_id}</strong></td>
            <td>${formatCurrency(loan.loan_amount)}</td>
            <td class="${getAmountClass(loan.remaining_amount, loan.loan_amount)}">
                ${formatCurrency(loan.remaining_amount)}
            </td>
            <td>${loan.duration_months} Months</td>
            <td class="${getInterestRateClass(loan.interest_rate)}">
                ${loan.interest_rate}%
            </td>
            <td>${formatCurrency(loan.monthly_installment)} / month</td>
            <td>
                <div class="d-flex gap-2">
                    <button class="btn btn-sm btn-outline-primary" title="View Details" onclick="viewLoanDetails('${loan.loan_id}')">
                        <i class="fas fa-eye"></i>
                    </button>
                    <button class="btn btn-sm btn-outline-success" title="Make Payment" onclick="makePayment('${loan.loan_id}')">
                        <i class="fas fa-money-bill"></i>
                    </button>
                    <button class="btn btn-sm btn-outline-info" title="Download Statement" onclick="downloadStatement('${loan.loan_id}')">
                        <i class="fas fa-download"></i>
                    </button>
                </div>
            </td>
        `;
        tableBody.appendChild(row);
    });

    // Update totals row
    const totalRow = document.querySelector('.total-row');
    totalRow.innerHTML = `
        <td>Total</td>
        <td>${formatCurrency(totals.total_loan_amount)}</td>
        <td>${formatCurrency(totals.total_remaining)}</td>
        <td></td>
        <td></td>
        <td>${formatCurrency(totals.total_installment)} / month</td>
        <td></td>
    `;

    // Reapply row animations
    animateTableRows();
}

/**
 * Format currency values
 */
function formatCurrency(amount) {
    return new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'USD'
    }).format(amount);
}

/**
 * Get CSS class for remaining amount
 */
function getAmountClass(remaining, total) {
    const ratio = remaining / total;
    if (ratio <= 0.3) return 'text-success';
    if (ratio <= 0.7) return 'text-warning';
    return 'text-danger';
}

/**
 * Get CSS class for interest rate
 */
function getInterestRateClass(rate) {
    if (rate <= 8) return 'text-success';
    if (rate <= 12) return 'text-warning';
    return 'text-danger';
}

// Function to view loan details
function viewLoanDetails(loanId) {
    alert('View details feature coming soon!');
}

// Function to make a loan payment
function makePayment(loanId) {
    alert('Payment feature coming soon!');
}

// Function to download loan statement
function downloadStatement(loanId) {
    alert('Download statement feature coming soon!');
}