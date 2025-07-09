document.addEventListener('DOMContentLoaded', async function() {
    // First check if user is authenticated
    try {
        const authResponse = await fetch('http://localhost/project-un/php/check_auth.php');
        const authData = await authResponse.json();
        console.log(authData);
        
        if (!authData.success || !authData.authenticated) {
            window.location.href = 'http://localhost/project-un/php/login.php';
            return;
        }
    } catch (error) {
        console.error('Authentication check failed:', error);
        alert('Authentication error. Please try logging in again.');
        window.location.href = 'http://localhost/project-un/php/login.php';
        return;
    }

    // Initialize chart
    const initChart = () => {
        const ctx = document.getElementById('ExpenseChart');
        if (ctx) {
            return new Chart(ctx, {
                type: 'doughnut',
                data: {
                    labels: ['DBL Bank', 'BRC Bank', 'ABM Bank', 'MCP Bank'],
                    datasets: [{
                        data: [25, 25, 25, 25],
                        backgroundColor: ['#4C73DF', '#EA719C', '#37C7C7', '#FFA93B'],
                        borderWidth: 0,
                        hoverBorderWidth: 4,
                        hoverBorderColor: '#fff',
                        hoverOffset: 10
                    }]
                },
                options: {
                    responsive: true,
                    maintainAspectRatio: false,
                    cutout: '70%',
                    plugins: {
                        legend: {
                            position: 'bottom',
                            labels: {
                                usePointStyle: true,
                                pointStyle: 'circle',
                                padding: 25,
                                boxWidth: 8,
                                font: {
                                    size: 14,
                                    family: 'Inter, sans-serif'
                                }
                            }
                        }
                    },
                    animation: {
                        animateScale: true,
                        animateRotate: true
                    }
                }
            });
        }
        return null;
    };

    let bankChart = initChart();

    // Debug helper to check if elements exist
    const checkElements = () => {
        const elements = {
            'cards-loading': document.getElementById('cards-loading'),
            'list-loading': document.getElementById('list-loading'),
            'cards-container': document.getElementById('cards-container'),
            'card-list': document.getElementById('card-list'),
            'no-cards-message': document.getElementById('no-cards-message'),
            'no-cards-list-message': document.getElementById('no-cards-list-message')
        };

        console.log('Checking required elements:');
        Object.entries(elements).forEach(([id, element]) => {
            console.log(`${id}: ${element ? 'Found' : 'Missing'}`);
        });

        return elements;
    };

    // Function to show loading state
    const showLoading = () => {
        try {
            const elements = checkElements();
            
            if (elements['cards-loading']) elements['cards-loading'].style.display = 'block';
            if (elements['list-loading']) elements['list-loading'].style.display = 'block';
            if (elements['cards-container']) elements['cards-container'].style.display = 'none';
            if (elements['card-list']) elements['card-list'].style.display = 'none';
        } catch (error) {
            console.error('Error in showLoading:', error);
        }
    };

    // Function to hide loading state
    const hideLoading = () => {
        try {
            const elements = checkElements();
            
            if (elements['cards-loading']) elements['cards-loading'].style.display = 'none';
            if (elements['list-loading']) elements['list-loading'].style.display = 'none';
            if (elements['cards-container']) elements['cards-container'].style.display = 'flex';
            if (elements['card-list']) elements['card-list'].style.display = 'block';
        } catch (error) {
            console.error('Error in hideLoading:', error);
        }
    };

    // Function to show/hide no cards message
    const toggleNoCardsMessage = (show) => {
        try {
            const noCardsMessage = document.getElementById('no-cards-message');
            const noCardsListMessage = document.getElementById('no-cards-list-message');
            
            if (noCardsMessage) noCardsMessage.style.display = show ? 'block' : 'none';
            if (noCardsListMessage) noCardsListMessage.style.display = show ? 'block' : 'none';
        } catch (error) {
            console.error('Error in toggleNoCardsMessage:', error);
        }
    };

    // Function to show error message
    const showError = (message) => {
        const errorDiv = document.createElement('div');
        errorDiv.className = 'alert alert-danger alert-dismissible fade show';
        errorDiv.innerHTML = `
            ${message}
            <button type="button" class="btn-close" data-bs-dismiss="alert"></button>
        `;
        document.querySelector('main').insertBefore(errorDiv, document.querySelector('main').firstChild);
    };

    // Function to show success message
    const showSuccess = (message) => {
        const successDiv = document.createElement('div');
        successDiv.className = 'alert alert-success alert-dismissible fade show';
        successDiv.innerHTML = `
            ${message}
            <button type="button" class="btn-close" data-bs-dismiss="alert"></button>
        `;
        document.querySelector('main').insertBefore(successDiv, document.querySelector('main').firstChild);
    };

    // Function to fetch and display credit cards
    const fetchAndDisplayCards = async () => {
        showLoading();
        try {
            const response = await fetch('http://localhost/project-un/php/get_cards.php');
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            const data = await response.json();

            if (!data.success) {
                throw new Error(data.message || 'Failed to fetch cards');
            }

            const cardsContainer = document.getElementById('cards-container');
            const cardList = document.getElementById('card-list');

            if (!data.cards || data.cards.length === 0) {
                toggleNoCardsMessage(true);
                return;
            }

            toggleNoCardsMessage(false);

            // Clear existing cards
            cardsContainer.innerHTML = '';
            cardList.innerHTML = '';

            // Add each card
            data.cards.forEach((card, index) => {
                const cardHtml = `
                    <div class="credit-card-new ${index % 2 === 0 ? 'green' : 'light'}">
                        <div class="d-flex justify-content-between">
                            <div>
                                <span class="label">Card Type</span>
                                <p class="amount">${card.cardType}</p>
                            </div>
                            <i class="fa-solid fa-wifi"></i>
                        </div>
                        <div class="d-flex justify-content-between mt-2">
                            <div>
                                <span class="label">CARD HOLDER</span>
                                <p>${card.cardHolder}</p>
                            </div>
                            <div>
                                <span class="label">VALID THRU</span>
                                <p>${card.expirationDate}</p>
                            </div>
                        </div>
                        <div class="d-flex justify-content-between align-items-center mt-2">
                            <span class="card-number-text">${card.cardNumber}</span>
                            <div class="card-logo${index % 2 === 0 ? '' : '-dark'}"></div>
                        </div>
                    </div>
                `;
                cardsContainer.insertAdjacentHTML('beforeend', cardHtml);

                const colors = ['blue', 'red', 'yellow'];
                const colorIndex = index % colors.length;
                
                const listItemHtml = `
                    <div class="card-list-item">
                        <div class="icon-bg ${colors[colorIndex]}">
                            <i class="fa-solid fa-credit-card"></i>
                        </div>
                        <div class="item-details">
                            <span>Card Type</span>
                            <p>${card.cardType}</p>
                        </div>
                        <div class="item-details">
                            <span>Name on Card</span>
                            <p>${card.cardHolder}</p>
                        </div>
                        <div class="item-details">
                            <span>Card Number</span>
                            <p>${card.cardNumber}</p>
                        </div>
                        <div class="item-details">
                            <span>Expiry</span>
                            <p>${card.expirationDate}</p>
                        </div>
                        <a href="#" onclick="viewCardDetails(${card.id}); return false;">View Details</a>
                    </div>
                `;
                cardList.insertAdjacentHTML('beforeend', listItemHtml);
            });

        } catch (error) {
            console.error('Error fetching cards:', error);
            showError('Failed to load credit cards: ' + error.message);
            toggleNoCardsMessage(true);
        } finally {
            hideLoading();
        }
    };

    // Function to view card details (placeholder for now)
    window.viewCardDetails = (cardId) => {
        alert('Card details feature coming soon!');
    };

    // Fetch cards when page loads
    await fetchAndDisplayCards();

    // Handle window resize
    window.addEventListener('resize', function() {
        if (bankChart) {
            bankChart.destroy();
            bankChart = initChart();
        }
    });

    // Add animation to cards on scroll
    const animateOnScroll = () => {
        const elements = document.querySelectorAll('.credit-card-new, .card');
        elements.forEach((el, index) => {
            const elPosition = el.getBoundingClientRect().top;
            const screenPosition = window.innerHeight / 1.2;
            
            if (elPosition < screenPosition) {
                if (!el.style.animation) {
                    el.style.animation = `fadeInUp 0.6s ease-out ${index * 0.05}s forwards`;
                    el.style.opacity = '0';
                }
            }
        });
    };
    
    window.addEventListener('scroll', animateOnScroll);
    animateOnScroll();

    // Form handling code
    const addCardForm = document.getElementById('add-card-form');
    const cardNumberInput = document.getElementById('card-num');
    const expiryDateInput = document.getElementById('exp-date');
    const cvvInput = document.getElementById('cvv');

    // Format card number with spaces
    cardNumberInput.addEventListener('input', function(e) {
        let value = e.target.value.replace(/\D/g, '');
        if (value.length > 0) {
            value = value.match(new RegExp('.{1,4}', 'g')).join(' ');
        }
        e.target.value = value.substring(0, 19); // 16 digits + 3 spaces
    });

    // Format expiry date
    expiryDateInput.addEventListener('input', function(e) {
        let value = e.target.value.replace(/\D/g, '');
        if (value.length >= 2) {
            value = value.substring(0, 2) + '/' + value.substring(2);
        }
        e.target.value = value.substring(0, 5); // MM/YY format
    });

    // Format CVV
    cvvInput.addEventListener('input', function(e) {
        e.target.value = e.target.value.replace(/\D/g, '').substring(0, 4);
    });

    // Handle form submission
    addCardForm.addEventListener('submit', async function(e) {
        e.preventDefault();

        // Show loading state
        const submitBtn = addCardForm.querySelector('button[type="submit"]');
        const btnText = submitBtn.querySelector('.button-text');
        const btnSpinner = submitBtn.querySelector('.spinner-border');
        
        submitBtn.disabled = true;
        btnText.textContent = 'Adding Card...';
        btnSpinner.classList.remove('d-none');

        try {
            // Get form values
            const cardType = document.getElementById('card-type').value;
            const cardName = document.getElementById('card-name').value;
            const cardNumber = document.getElementById('card-num').value.replace(/\s/g, '');
            const expiryDate = document.getElementById('exp-date').value;
            
            // Validate form
            if (!cardType || !cardName || !cardNumber || !expiryDate) {
                throw new Error('Please fill in all required fields');
            }

            // Convert MM/YY to YYYY-MM-DD format for backend
            const [month, year] = expiryDate.split('/');
            const expirationDate = `20${year}-${month}-01`;

            // Send data to server
            const response = await fetch('http://localhost/project-un/php/add_card.php', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    cardType,
                    cardName,
                    cardNumber,
                    expirationDate
                })
            });

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            let data;
            const text = await response.text();
            try {
                data = JSON.parse(text);
            } catch (e) {
                console.error('Failed to parse response:', text);
                throw new Error('Invalid JSON response from server');
            }

            if (!data.success) {
                throw new Error(data.message || 'Failed to add card');
            }

            // Show success message
            showSuccess('Card added successfully!');

            // Reset form
            addCardForm.reset();

            // Refresh card display
            await fetchAndDisplayCards();

        } catch (error) {
            console.error('Error adding card:', error);
            showError(error.message);
        } finally {
            // Reset button state
            submitBtn.disabled = false;
            btnText.textContent = 'Add Card';
            btnSpinner.classList.add('d-none');
        }
    });


});