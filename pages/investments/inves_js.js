
function checkAdminRole() {
    return fetch('http://localhost/project-un/php/check_role.php')
        .then(response => response.json())
        .then(data => data.isAdmin)
        .catch(error => {
            console.error('Error checking admin role:', error);
            return false;
        });
}

checkAdminRole().then(isAdmin => {
    if (!isAdmin) {
        window.location.href = "../../user/index.html";
    }
});



function generateRealisticData(baseValues, variationPercent = 10) {
    return baseValues.map(base => {
        const variation = (Math.random() * 2 - 1) * (variationPercent / 100);
        return Math.round(base * (1 + variation));
    });
}

let yearlyInvestmentChart, monthlyRevenueChart;

document.addEventListener('DOMContentLoaded', function () {
    const baseYearlyData = [10000, 15000, 22000, 28000, 35000, 40000];
    const baseMonthlyData = [12000, 19000, 15000, 22000, 18000, 25000, 21000, 28000, 24000, 30000, 27000, 35000];

    const yearlyCtx = document.getElementById('yearlyInvestmentChart').getContext('2d');
    yearlyInvestmentChart = new Chart(yearlyCtx, {
        type: 'line',
        data: {
            labels: ['2018', '2019', '2020', '2021', '2022', '2023'],
            datasets: [{
                label: 'Total Investment',
                data: generateRealisticData(baseYearlyData),
                borderColor: '#FCAA0B',
                backgroundColor: 'rgba(255, 232, 186, 0.4)',
                tension: 0.4,
                fill: true,
                borderWidth: 2,
                pointBackgroundColor: '#fff',
                pointBorderColor: '#FCAA0B',
                pointBorderWidth: 2,
                pointRadius: 4,
                pointHoverRadius: 6
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: { display: false },
                tooltip: {
                    backgroundColor: '#fff',
                    titleColor: '#334155',
                    bodyColor: '#64748b',
                    borderColor: '#e2e8f0',
                    borderWidth: 1,
                    padding: 12,
                    callbacks: {
                        label: context => '$' + context.parsed.y.toLocaleString()
                    }
                }
            },
            scales: {
                y: {
                    beginAtZero: true,
                    grid: { color: '#e2e8f0', drawBorder: false },
                    ticks: {
                        color: '#64748b',
                        callback: value => '$' + value.toLocaleString()
                    }
                },
                x: {
                    grid: { display: false, drawBorder: false },
                    ticks: { color: '#64748b' }
                }
            }
        }
    });

    const monthlyCtx = document.getElementById('monthlyRevenueChart').getContext('2d');
    monthlyRevenueChart = new Chart(monthlyCtx, {
        type: 'bar',
        data: {
            labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
            datasets: [{
                label: 'Revenue',
                data: generateRealisticData(baseMonthlyData),
                backgroundColor: '#16DBCC',
                borderColor: '#16DBCC',
                borderWidth: 1,
                borderRadius: 6
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: { display: false },
                tooltip: {
                    backgroundColor: '#fff',
                    titleColor: '#334155',
                    bodyColor: '#64748b',
                    borderColor: '#e2e8f0',
                    borderWidth: 1,
                    padding: 12,
                    callbacks: {
                        label: context => '$' + context.parsed.y.toLocaleString()
                    }
                }
            },
            scales: {
                y: {
                    beginAtZero: true,
                    grid: { color: '#e2e8f0', drawBorder: false },
                    ticks: {
                        color: '#64748b',
                        callback: value => '$' + (value / 1000) + 'k'
                    }
                },
                x: {
                    grid: { display: false, drawBorder: false },
                    ticks: { color: '#64748b' }
                }
            }
        }
    });

    // زر تحديث الاستثمار السنوي
    const yearlyBtn = document.createElement('button');
    yearlyBtn.className = 'btn mt-3';
    yearlyBtn.style.backgroundColor = '#FCAA0B';
    yearlyBtn.style.color = '#fff';
    yearlyBtn.innerText = 'Update Yearly Data';
    yearlyBtn.onclick = function () {
        yearlyInvestmentChart.data.datasets[0].data = generateRealisticData(baseYearlyData);
        yearlyInvestmentChart.update();
    };
    document.getElementById('yearlyInvestmentChart').closest('.dashboard-card').appendChild(yearlyBtn);

    // زر تحديث الإيراد الشهري
    const monthlyBtn = document.createElement('button');
    monthlyBtn.className = 'btn mt-3';
    monthlyBtn.style.backgroundColor = '#16DBCC';
    monthlyBtn.style.color = '#fff';
    monthlyBtn.innerText = 'Update Monthly Data';
    monthlyBtn.onclick = function () {
        monthlyRevenueChart.data.datasets[0].data = generateRealisticData(baseMonthlyData);
        monthlyRevenueChart.update();
    };
    document.getElementById('monthlyRevenueChart').closest('.dashboard-card').appendChild(monthlyBtn);
});
