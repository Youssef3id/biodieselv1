<?php
require_once 'config.php';

// Check if user is logged in
if (!isset($_SESSION['user_id'])) {
    header('Location: login.php');
    exit();
}

$user_email = $_SESSION['user_email'];
?>

<!DOCTYPE html>
<html lang="en">

<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>BioDiesel Dashboard</title>

  <!-- Google Fonts & Font Awesome -->
  <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap" rel="stylesheet" />
  <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.7.2/css/all.min.css" crossorigin="anonymous" />

  <!-- Bootstrap CSS -->
  <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/css/bootstrap.min.css" rel="stylesheet" />

  <!-- Custom CSS -->
  <link rel="stylesheet" href="../assets/style.css" />

  <!-- Chart.js -->
  <script src="https://cdn.jsdelivr.net/npm/chart.js"></script>
</head>

<body>
  <div class="layout-wrapper">
    <!-- Sidebar (Desktop Only) -->
    <aside class="sidebar d-none d-lg-flex">
      <!-- Logo -->
      <div class="sidebar-header d-flex align-items-center p-4">
        <img src="../assets/icons/Group.png" alt="Logo" style="height: 36px;">
        <span class="ms-2 fs-4 fw-bold">BioDiesel.</span>
      </div>

      <!-- Navigation Links -->
      <nav class="nav flex-column p-3 flex-grow-1">
        <a class="nav-link active" href="dashboard.php"><i class="fas fa-home fa-fw"></i>Dashboard</a>
        <a class="nav-link" href="../pages/transaction/index.html"><i class="fas fa-exchange-alt fa-fw"></i>Transactions</a>
        <a class="nav-link" href="../pages/accounts-clients/index.html"><i class="fas fa-wallet fa-fw"></i>Accounts</a>
        <a class="nav-link" href="../pages/investments/index.html"><i class="fas fa-chart-line fa-fw"></i>Investments</a>
        <a class="nav-link" href="../pages/credit-cards/index.html"><i class="far fa-credit-card fa-fw"></i>Credit Cards</a>
        <a class="nav-link" href="../pages/loans/index.html"><i class="fas fa-hand-holding-usd fa-fw"></i>Loans</a>
        <a class="nav-link" href="../pages/services/index.html"><i class="fas fa-wrench fa-fw"></i>Services</a>
        <a class="nav-link" href="#"><i class="fas fa-crown fa-fw"></i>My Privileges</a>
      </nav>

      <!-- Settings Link -->
      <div class="p-3">
        <a class="nav-link" href="../pages/setting/edit-profile.html"><i class="fas fa-cog fa-fw"></i>Settings</a>
      </div>
    </aside>

    <!-- Main Content Area -->
    <div class="main-content">
      <!-- Header / Top Navbar -->
      <header class="dashboard-header d-flex justify-content-between align-items-center p-3">
        <!-- Mobile Menu Toggle + Page Title -->
        <div class="d-flex align-items-center">
          <button class="btn d-lg-none me-3" data-bs-toggle="offcanvas" data-bs-target="#mobile-menu" aria-controls="mobile-menu">
            <i class="fas fa-bars fs-4 text-success"></i>
          </button>
          <h2 class="mb-0 fw-bold d-none d-md-block">Welcome, <?php echo htmlspecialchars($user_email); ?></h2>
        </div>

        <!-- Right Side: Search, Icons, Profile -->
        <div class="d-flex align-items-center gap-3">
          <!-- Search Field -->
          <div class="position-relative d-none d-md-block">
            <i class="fas fa-search search-icon-inside"></i>
            <input type="text" class="form-control search-input ps-5" placeholder="Search for something">
          </div>

          <!-- Notification & Settings Icons -->
          <div class="d-flex align-items-center gap-2">
            <div class="icon-wrapper bg-light-pink">
              <i class="fa-regular fa-bell fa-lg" style="color: #FE5C73;"></i>
            </div>
            <div class="icon-wrapper bg-light-green">
              <i class="fa-solid fa-gear" style="color: #0daf25;"></i>
            </div>
          </div>

          <!-- User Avatar Dropdown -->
          <div class="dropdown">
            <img src="https://i.pravatar.cc/40?u=<?php echo urlencode($user_email); ?>" class="user-img rounded-circle dropdown-toggle" data-bs-toggle="dropdown" style="cursor: pointer;">
            <ul class="dropdown-menu dropdown-menu-end">
            
              
              <li><a class="dropdown-item text-danger" href="logout.php"><i class="fas fa-sign-out-alt me-2"></i>Logout</a></li>
            </ul>
          </div>
        </div>
      </header>

      <!-- Section: Charts (Row 1) -->
      <section class="row px-4">
        <!-- Weekly Activity Chart -->
        <div class="col-12 col-lg-7 mb-4">
          <h5 class="section-title mb-3 p-2"><i class="fas fa-chart-bar me-2"></i>Weekly Activity</h5>
          <div class="card h-90 p-3">
            <div class="d-flex justify-content-between align-items-center mb-3">
              <div>
                <span class="fw-bold fs-4">$500</span>
                <span class="text-success ms-2"><i class="fas fa-arrow-up"></i> 4%</span>
              </div>
              <div class="dropdown">
                <button class="btn btn-sm dropdown-toggle" type="button" data-bs-toggle="dropdown">This Week</button>
                <ul class="dropdown-menu">
                  <li><a class="dropdown-item" href="#">This Day</a></li>
                  <li><a class="dropdown-item" href="#">Last Week</a></li>
                  <li><a class="dropdown-item" href="#">This Month</a></li>
                </ul>
              </div>
            </div>
            <canvas id="weeklyChart" height="250"></canvas>
          </div>
        </div>

        <!-- Expense Pie Chart -->
        <div class="col-12 col-lg-5 mb-4">
          <h5 class="section-title p-2"><i class="fas fa-chart-pie me-2"></i>Expense Statistics</h5>
          <div class="card h-90 p-3">
            <div class="d-flex justify-content-center align-items-center" style="height: 250px;">
              <canvas id="pieChart" height="200"></canvas>
            </div>
            <div class="d-flex justify-content-center mt-3">
              <div class="text-center mx-3"><span class="d-block fw-bold">35%</span><span class="text-muted small">Bill Expense</span></div>
              <div class="text-center mx-3"><span class="d-block fw-bold">20%</span><span class="text-muted small">Entertainment</span></div>
              <div class="text-center mx-3"><span class="d-block fw-bold">15%</span><span class="text-muted small">Investment</span></div>
            </div>
          </div>
        </div>
      </section>

      <!-- Section: Transfer & History -->
      <section class="row px-4">
        <!-- Quick Transfer Card -->
        <div class="col-12 col-lg-5 mb-4">
          <h5 class="section-title mb-3 p-2"><i class="fas fa-paper-plane me-2"></i>Quick Transfer</h5>
          <div class="card h-80 p-3">
            <!-- Contacts -->
            <div class="d-flex gap-3 mb-4">
              <div class="text-center">
                <img src="https://i.pravatar.cc/40" class="rounded-circle user-img mb-1">
                <div class="fw-bold">Randy</div>
                <div class="text-muted small">Press Director</div>
              </div>
              <div class="text-center">
                <img src="https://i.pravatar.cc/40" class="rounded-circle user-img mb-1">
                <div class="fw-bold">Workman</div>
                <div class="text-muted small">Designer</div>
              </div>
            </div>
            <!-- Transfer Input -->
            <form class="d-flex gap-3 align-items-center" action="add_transaction.php" method="POST">
              <span class="text-success fw-semibold">Write Amount</span>
              <div class="position-relative flex-grow-1">
                <input type="text" name="amount" class="form-control ps-3 pe-5 rounded-pill" value="255.50">
                <button type="submit" class="btn btn-success position-absolute end-0 top-0 rounded-pill px-3" style="height: 100%;">
                  <i class="fas fa-paper-plane"></i> Send
                </button>
              </div>
            </form>
          </div>
        </div>

        <!-- Balance Line Chart -->
        <div class="col-12 col-lg-7 mb-4">
          <h5 class="section-title mb-3 p-2"><i class="fas fa-chart-line me-2"></i>Balance History</h5>
          <div class="card h-80 p-3">
            <canvas id="lineChart" height="250"></canvas>
          </div>
        </div>
      </section>
    </div>

    <!-- Mobile Sidebar (Offcanvas Menu) -->
    <div class="offcanvas offcanvas-start" tabindex="-1" id="mobile-menu">
      <div class="offcanvas-header border-bottom">
        <a href="#" class="d-flex align-items-center text-decoration-none text-dark">
          <img src="../assets/icons/Group.png" alt="Logo" style="height: 36px;">
          <span class="ms-2 fs-4 fw-bold">BioDiesel.</span>
        </a>
        <button type="button" class="btn-close" data-bs-dismiss="offcanvas"></button>
      </div>

      <!-- Offcanvas Navigation -->
      <div class="offcanvas-body">
        <nav class="nav flex-column">
          <a class="nav-link active" href="dashboard.php"><i class="fas fa-home fa-fw"></i>Dashboard</a>
          <a class="nav-link" href="../pages/transaction/index.html"><i class="fas fa-exchange-alt fa-fw"></i>Transactions</a>
          <a class="nav-link" href="../pages/accounts-clients/index.html"><i class="fas fa-wallet fa-fw"></i>Accounts</a>
          <a class="nav-link" href="../pages/investments/index.html"><i class="fas fa-chart-line fa-fw"></i>Investments</a>
          <a class="nav-link" href="../pages/credit-cards/index.html"><i class="far fa-credit-card fa-fw"></i>Credit Cards</a>
          <a class="nav-link" href="../pages/loans/index.html"><i class="fas fa-hand-holding-usd fa-fw"></i>Loans</a>
          <a class="nav-link" href="../pages/services/index.html"><i class="fas fa-wrench fa-fw"></i>Services</a>
          <a class="nav-link" href="#"><i class="fas fa-crown fa-fw"></i>My Privileges</a>
        </nav>
        <div class="sidebar-settings-link mt-3">
          <a class="nav-link sidebar-link" href="#"><i class="fas fa-cog"></i>Settings</a>
        </div>
      </div>
    </div>
  </div>

  <!-- JavaScript Libraries -->
  <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/js/bootstrap.bundle.min.js"></script>
  <script src="https://cdn.jsdelivr.net/npm/chartjs-plugin-datalabels@2"></script>
  <script src="../assets/script.js"></script>
  <script src="../isAdmin.js"></script>
</body>

</html> 