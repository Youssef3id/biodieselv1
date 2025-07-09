/**
 * Enhanced Accounts Page with Animations
 */
console.log('acc_cli.js loaded');

document.addEventListener('DOMContentLoaded', function() {
    console.log('DOM Content Loaded');
    
    // Only fetch subscribers for now
    fetchSubscribers();
});

function fetchSubscribers() {
    console.log('Fetching subscribers...');
    fetch('http://localhost/project-un/php/get_subscribers.php')
        .then(response => {
            console.log('Response received:', response);
            return response.json();
        })
        .then(data => {
            console.log('Data received:', data);
            if (data.success) {
                displaySubscribers(data.data);
            } else {
                console.error('Failed to fetch subscribers:', data.error);
            }
        })
        .catch(error => {
            console.error('Error fetching subscribers:', error);
        });
}

function displaySubscribers(subscribers) {
    const tbody = document.querySelector('.table tbody');
    if (!tbody) {
        console.error('Could not find table body element');
        return;
    }
    
    tbody.innerHTML = '';

    subscribers.forEach(subscriber => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>
                <div class="d-flex align-items-center">
                    <img src="${subscriber.avatar_url || 'https://i.pravatar.cc/40?img=' + subscriber.id}"
                        class="rounded-circle me-3" width="40" height="40" />
                    <div>
                        <h6 class="mb-0">${subscriber.name}</h6>
                        <small class="text-muted">${formatDate(subscriber.created_at)}</small>
                    </div>
                </div>
            </td>
            <td>${subscriber.tier}</td>
            <td>${maskCardNumber(subscriber.card_number)}</td>
            <td class="status-${subscriber.status.toLowerCase()}">${subscriber.status}</td>
            <td class="text-end amount-${subscriber.amount >= 0 ? 'positive' : 'negative'}">
                ${formatAmount(subscriber.amount)}
            </td>
        `;
        tbody.appendChild(row);
    });
}

function formatDate(dateString) {
    try {
        const date = new Date(dateString);
        return date.toLocaleDateString('en-US', { 
            day: '2-digit',
            month: 'short',
            year: 'numeric'
        });
    } catch (error) {
        console.error('Error formatting date:', error);
        return dateString;
    }
}

function maskCardNumber(cardNumber) {
    if (!cardNumber) return '****';
    return cardNumber.slice(0, 4) + ' ****';
}

function formatAmount(amount) {
    return (amount >= 0 ? '+' : '') + '$' + Math.abs(parseFloat(amount)).toFixed(2);
}


