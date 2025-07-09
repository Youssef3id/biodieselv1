    document.addEventListener('DOMContentLoaded', function () {
        // Weekly Activity Chart
        const weeklyCtx = document.getElementById('weeklyChart').getContext('2d');
        new Chart(weeklyCtx, {
            type: 'bar',
            data: {
                labels: ['Sat', 'Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri'],
                datasets: [
                    {
                        label: 'Collect',
                        data: [250, 120, 230, 300, 180, 200, 240],
                        backgroundColor: '#F97316', // Orange
                        borderRadius: 10,
                        barThickness: 15
                    },
                    {
                        label: 'Refund',
                        data: [500, 320, 310, 450, 130, 310, 320],
                        backgroundColor: '#1FAF38', // Green
                        borderRadius: 10,
                        barThickness: 15
                    }
                ]
            },
            options: {
                responsive: true,
                
                plugins: {
                    legend: {
                        display: true,
                        position: 'top',
                        align: 'end'
                    }
                },
                scales: {
                    y: {
                        beginAtZero: true,
                        grid: { display: false }
                    },
                    x: {
                        grid: { display: false }
                    }
                }
            }
        });

        // Expense Statistics Pie Chart
        const pieCtx = document.getElementById('pieChart').getContext('2d');
        new Chart(pieCtx, {
            type: 'pie',
            data: {
                labels: ['Entertainment', 'Investment', 'Bill Expense', 'Others'],
                datasets: [{
                    data: [30, 20, 15, 35],
                    backgroundColor: ['#6366F1', '#EC4899', '#F97316', '#3B82F6'],
                    borderWidth: 0
                }]
            },
            options: {
                responsive: true,
                
                plugins: {
                    legend: {
                        display: true,
                        position: 'bottom',
                        labels: {
                            boxWidth: 15,
                            padding: 20
                        }
                    }
                }
            }
        });

        // Balance History Line Chart
        const lineCtx = document.getElementById('lineChart').getContext('2d');
        new Chart(lineCtx, {
            type: 'line',
            data: {
                labels: ['Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec', 'Jan'],
                datasets: [{
                    label: 'Balance',
                    data: [150, 300, 450, 700, 350, 500, 650],
                    borderColor: '#1FAF38',
                    backgroundColor: 'rgba(31, 175, 56, 0.1)',
                    fill: true,
                    tension: 0.4
                }]
            },
            options: {
                responsive: true,
                
                plugins: {
                    legend: { display: false }
                },
                scales: {
                    y: {
                        beginAtZero: false
                    },
                    x: {
                        grid: { display: false }
                    }
                }
            }
        });

        // Sidebar Active Link
        const sidebarLinks = document.querySelectorAll('.sidebar .nav-link, .offcanvas .nav-link');
        sidebarLinks.forEach(link => {
            link.addEventListener('click', function () {
                sidebarLinks.forEach(l => l.classList.remove('active'));
                this.classList.add('active');
            });
        });
    });
