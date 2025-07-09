// Initialize expense chart
document.addEventListener('DOMContentLoaded', function() {
    const ctx = document.getElementById('expenseChart').getContext('2d');
    new Chart(ctx, {
        type: 'line',
        data: {
            labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
            datasets: [{
                label: 'Expense',
                data: [2500, 3200, 2100, 2800, 3100, 2750],
                borderColor: '#28a745',
                tension: 0.4,
                fill: false
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    display: false
                }
            },
            scales: {
                y: {
                    beginAtZero: true,
                    grid: {
                        display: false
                    }
                },
                x: {
                    grid: {
                        display: false
                    }
                }
            }
        }
    });

    // Load transactions when page loads
    loadTransactions();

    // Handle transaction form submission
    const submitBtn = document.getElementById('submitTransaction');
    const transactionForm = document.getElementById('newTransactionForm');
    const errorDiv = document.getElementById('transactionError');
    const successDiv = document.getElementById('transactionSuccess');

    submitBtn.addEventListener('click', async function() {
        // Reset alert messages
        errorDiv.classList.add('d-none');
        successDiv.classList.add('d-none');

        // Form validation
        if (!transactionForm.checkValidity()) {
            transactionForm.reportValidity();
            return;
        }

        const formData = new FormData(transactionForm);
        
        try {
            const response = await fetch('../../php/add_transaction.php', {
                method: 'POST',
                body: formData
            });

            const data = await response.json();
            
            if (data.success) {
                successDiv.textContent = data.message;
                successDiv.classList.remove('d-none');
                
                // Reload transactions after adding new one
                loadTransactions();

                // Reset form
                transactionForm.reset();
                
                // Close modal after 1.5 seconds
                setTimeout(() => {
                    const modal = bootstrap.Modal.getInstance(document.getElementById('newTransactionModal'));
                    modal.hide();
                }, 1500);
            } else {
                errorDiv.textContent = data.message || 'Failed to add transaction';
                errorDiv.classList.remove('d-none');
            }
        } catch (error) {
            errorDiv.textContent = 'An error occurred. Please try again.';
            errorDiv.classList.remove('d-none');
        }
    });
});

// Function to load transactions from database
async function loadTransactions() {
    const allTbody = document.getElementById('transactionTableBody');
    const incomeTbody = document.getElementById('incomeTableBody');
    const expenseTbody = document.getElementById('expenseTableBody');
    
    try {
        const response = await fetch('../../php/get_transactions.php');
        const data = await response.json();

        if (data.success) {
            // Clear existing transactions
            allTbody.innerHTML = '';
            incomeTbody.innerHTML = '';
            expenseTbody.innerHTML = '';

            data.transactions.forEach(transaction => {
                const isExpense = ['Refill', 'Service'].includes(transaction.type);
                const tr = document.createElement('tr');
                
                const amountFormatted = isExpense ? 
                    `-$${Math.abs(parseFloat(transaction.amount)).toLocaleString('en-US', {minimumFractionDigits: 2, maximumFractionDigits: 2})}` : 
                    `+$${Math.abs(parseFloat(transaction.amount)).toLocaleString('en-US', {minimumFractionDigits: 2, maximumFractionDigits: 2})}`;
                
                const date = new Date(transaction.date);
                const formattedDate = date.toLocaleDateString('en-US', {
                    day: '2-digit',
                    month: 'short'
                }) + ', ' + date.toLocaleTimeString('en-US', {
                    hour: '2-digit',
                    minute: '2-digit',
                    hour12: true
                });

                const rowHTML = `
                    <td>
                        <div class="transaction-icon ${isExpense ? 'expense' : 'income'}">
                            <i class="fas fa-arrow-${isExpense ? 'up' : 'down'}"></i>
                        </div>
                    </td>
                    <td>${transaction.customer_name}</td>
                    <td>${transaction.transaction_id}</td>
                    <td>${transaction.type}</td>
                    <td>1234 ****</td>
                    <td>${formattedDate}</td>
                    <td class="text-${isExpense ? 'danger' : 'success'} fw-bold">${amountFormatted}</td>
                    <td class="text-center">
                        <button class="btn btn-sm btn-outline-success rounded-pill px-3">Download</button>
                    </td>
                `;

                // Add to all transactions table
                const allTr = document.createElement('tr');
                allTr.innerHTML = rowHTML;
                allTbody.appendChild(allTr);

                // Add to respective income/expense table
                const targetTbody = isExpense ? expenseTbody : incomeTbody;
                const targetTr = document.createElement('tr');
                targetTr.innerHTML = rowHTML;
                targetTbody.appendChild(targetTr);
            });

            // Add "No transactions" message if tables are empty
            [
                { tbody: allTbody, message: 'No transactions found' },
                { tbody: incomeTbody, message: 'No income transactions found' },
                { tbody: expenseTbody, message: 'No expense transactions found' }
            ].forEach(({ tbody, message }) => {
                if (!tbody.hasChildNodes()) {
                    tbody.innerHTML = `
                        <tr>
                            <td colspan="8" class="text-center">${message}</td>
                        </tr>
                    `;
                }
            });
        } else {
            const errorMessage = `
                <tr>
                    <td colspan="8" class="text-center">No transactions found</td>
                </tr>
            `;
            allTbody.innerHTML = errorMessage;
            incomeTbody.innerHTML = errorMessage;
            expenseTbody.innerHTML = errorMessage;
        }
    } catch (error) {
        console.error('Error loading transactions:', error);
        const errorMessage = `
            <tr>
                <td colspan="8" class="text-center text-danger">Error loading transactions. Please try again later.</td>
            </tr>
        `;
        allTbody.innerHTML = errorMessage;
        incomeTbody.innerHTML = errorMessage;
        expenseTbody.innerHTML = errorMessage;
    }
}