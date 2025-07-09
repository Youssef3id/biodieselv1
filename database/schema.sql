-- Create the database
CREATE DATABASE IF NOT EXISTS Biodiesel;
USE Biodiesel;

-- Users table
CREATE TABLE users (
    id INT PRIMARY KEY AUTO_INCREMENT,
    name VARCHAR(255) NOT NULL,
    username VARCHAR(100) NOT NULL,
    email VARCHAR(100) NOT NULL,
    date_of_birth DATE DEFAULT NULL,
    present_address TEXT DEFAULT NULL,
    permanent_address TEXT DEFAULT NULL,
    country VARCHAR(100) DEFAULT NULL,
    city VARCHAR(100) DEFAULT NULL,
    postal_code VARCHAR(20) DEFAULT NULL,
    profile_image VARCHAR(255) DEFAULT NULL,
    password VARCHAR(255) NOT NULL,
    role ENUM('admin', 'user', 'staff') DEFAULT 'user',
    currency VARCHAR(10) DEFAULT 'USD',
    timezone VARCHAR(50) DEFAULT 'UTC',
    avatar_url VARCHAR(255) DEFAULT NULL,
    card_number VARCHAR(16) DEFAULT NULL,
    card_expiry VARCHAR(5) DEFAULT NULL,
    card_balance DECIMAL(10,2) DEFAULT 0.00,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Subscribers table
CREATE TABLE subscribers (
    id INT PRIMARY KEY AUTO_INCREMENT,
    name VARCHAR(255) NOT NULL,
    tier ENUM('Silver', 'Gold', 'Platinum', 'VIP') NOT NULL,
    card_number VARCHAR(16) DEFAULT NULL,
    status ENUM('Pending', 'Completed', 'Failed') NOT NULL,
    amount DECIMAL(10,2) NOT NULL,
    avatar_url VARCHAR(255) DEFAULT NULL,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- Transactions table
CREATE TABLE transactions (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT,
    customer_name VARCHAR(100),
    transaction_id VARCHAR(100),
    type ENUM('Refill', 'Subscribe', 'Service', 'Card'),
    date DATETIME,
    amount DECIMAL(10,2),
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

-- Loans table
CREATE TABLE loans (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT,
    cx VARCHAR(100),
    loan_money DECIMAL(10,2),
    left_to_repay DECIMAL(10,2),
    duration VARCHAR(50),
    interest_rate DECIMAL(5,2),
    installment DECIMAL(10,2),
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

-- Create credit_cards table
CREATE TABLE credit_cards (
    id INT PRIMARY KEY AUTO_INCREMENT,
    user_id INT NOT NULL,
    card_type VARCHAR(50) NOT NULL,
    card_holder_name VARCHAR(100) NOT NULL,
    card_number VARCHAR(20) NOT NULL,
    expiration_date DATE NOT NULL,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Create indexes for better performance
CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_users_role ON users(role);
CREATE INDEX idx_users_username ON users(username);
CREATE INDEX idx_subscribers_created_at ON subscribers(created_at);
CREATE INDEX idx_subscribers_tier ON subscribers(tier);

-- Insert sample data for users
INSERT INTO users (id, name, username, email, date_of_birth, present_address, permanent_address, country, city, postal_code, password, role, currency, timezone, card_number, card_expiry, card_balance, created_at, updated_at) VALUES
(1, 'test', 'admin', 'admin@admin.co', '0000-00-00', 'test', 'test', 'test', 'test', 'test', '$2y$10$2lzKeTHolAHA8Q2aPXLI4.oiTtnWv2pdttvYM0A1XDwCftjq8F9Y6', 'admin', 'USD', 'UTC', NULL, NULL, 0.00, '2025-07-05 14:58:55', '2025-07-08 18:56:18'),
(2, 'Admin User', '', 'admin@biodiesel.com', NULL, NULL, NULL, NULL, NULL, NULL, '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'admin', 'USD', 'UTC', '4532111122223333', '12/25', 5756.00, '2025-07-05 14:58:55', '2025-07-05 16:22:29'),
(3, 'Test User', '', 'user@biodiesel.com', NULL, NULL, NULL, NULL, NULL, NULL, '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'user', 'USD', 'UTC', '4532111122224444', '11/24', 1250.00, '2025-07-05 14:58:55', '2025-07-05 16:22:29'),
(4, '', 'user', 'user@user.co', NULL, NULL, NULL, NULL, NULL, NULL, '$2y$10$23WYRglVRsjqdS/oLcMVT.0/WEkztAdYWCdwSFErknReU.ysqZoxa', 'user', 'USD', 'UTC', NULL, NULL, 0.00, '2025-07-08 19:31:28', '2025-07-08 19:31:28');

-- Insert sample data for credit_cards
INSERT INTO credit_cards (id, user_id, card_type, card_holder_name, card_number, expiration_date, created_at, updated_at) VALUES
(1, 1, 'Visa', 'youssef', '************4232', '2027-08-01', '2025-07-07 02:14:56', '2025-07-07 02:14:56'),
(2, 1, 'Visa', 'ahmed', '************3681', '2028-09-01', '2025-07-07 02:17:17', '2025-07-07 02:17:17'),
(3, 1, 'Visa', 'alaa', '************4532', '2029-12-01', '2025-07-07 02:19:14', '2025-07-07 02:19:14'),
(4, 1, 'Visa', 'asmar', '************4234', '2028-02-01', '2025-07-07 02:21:02', '2025-07-07 02:21:02'),
(5, 1, 'Visa', 'alaa', '************3123', '2026-02-01', '2025-07-07 02:22:33', '2025-07-07 02:22:33');

-- Insert sample data for loans
INSERT INTO loans (id, user_id, cx, loan_money, left_to_repay, duration, interest_rate, installment) VALUES
(6, 1, 'BL-055147', 27055.00, 12986.40, '60 months', 14.95, 450.92),
(7, 1, 'BL-508892', 14015.00, 8128.70, '24 months', 7.63, 583.96),
(8, 1, 'PL-991737', 17649.00, 8471.52, '60 months', 8.56, 294.15),
(9, 1, 'BL-154001', 49986.00, 40488.66, '60 months', 15.59, 833.10),
(10, 1, 'BL-560413', 36443.00, 18950.36, '48 months', 8.66, 759.23),
(11, 1, 'PL001', 100000.00, 40500.00, '8 Months', 12.00, 2000.00),
(12, 1, 'CL002', 500000.00, 250000.00, '36 Months', 10.00, 8000.00),
(13, 1, 'BL003', 900000.00, 40500.00, '12 Months', 12.00, 5000.00),
(14, 1, 'PL004', 50000.00, 40500.00, '25 Months', 5.00, 2000.00),
(15, 1, 'CL005', 50000.00, 40500.00, '5 Months', 16.00, 10000.00),
(16, 1, 'BL006', 80000.00, 25500.00, '14 Months', 8.00, 2000.00),
(17, 1, 'PL007', 12000.00, 5500.00, '9 Months', 13.00, 500.00),
(18, 1, 'BL008', 160000.00, 100800.00, '3 Months', 12.00, 900.00);

-- Insert sample data for subscribers
INSERT INTO subscribers (id, name, tier, card_number, status, amount, avatar_url, created_at) VALUES
(1, 'John Doe', 'Gold', '1234567812345678', 'Pending', -150.00, NULL, '2025-07-05 14:58:55'),
(2, 'Jane Smith', 'Silver', '8765432187654321', 'Completed', -340.00, NULL, '2025-07-05 14:58:55'),
(3, 'Sam Wilson', 'Platinum', '1111222233334444', 'Completed', 780.00, NULL, '2025-07-05 14:58:55'),
(4, 'John Doe', 'Gold', '4111111111111111', 'Completed', 150.00, 'https://i.pravatar.cc/40?img=1', '2025-07-07 02:33:07'),
(5, 'Jane Smith', 'Silver', '4222222222222222', 'Pending', -340.00, 'https://i.pravatar.cc/40?img=2', '2025-07-07 02:33:07'),
(6, 'Sam Wilson', 'Platinum', '4333333333333333', 'Completed', 780.00, 'https://i.pravatar.cc/40?img=3', '2025-07-07 02:33:07'),
(7, 'John Doe', 'Gold', '4111111111111111', 'Completed', 150.00, 'https://i.pravatar.cc/40?img=1', '2025-07-07 02:33:13'),
(8, 'Jane Smith', 'Silver', '4222222222222222', 'Pending', -340.00, 'https://i.pravatar.cc/40?img=2', '2025-07-07 02:33:13'),
(9, 'Sam Wilson', 'Platinum', '4333333333333333', 'Completed', 780.00, 'https://i.pravatar.cc/40?img=3', '2025-07-07 02:33:13'),
(10, 'John Doe', 'Gold', '4111111111111111', 'Completed', 150.00, 'https://i.pravatar.cc/40?img=1', '2025-07-07 03:05:35'),
(11, 'Jane Smith', 'Silver', '4222222222222222', 'Pending', -340.00, 'https://i.pravatar.cc/40?img=2', '2025-07-07 03:05:35'),
(12, 'Sam Wilson', 'Platinum', '4333333333333333', 'Completed', 780.00, 'https://i.pravatar.cc/40?img=3', '2025-07-07 03:05:35');

-- Insert sample data for transactions
INSERT INTO transactions (id, user_id, customer_name, transaction_id, type, date, amount) VALUES
(1, 1, 'John Smith', '#66857', 'Card', '2025-07-02 19:34:10', 1601.37),
(2, 1, 'James Johnson', '#45651', 'Card', '2025-06-30 18:34:10', 1427.55),
(3, 1, 'Michael Brown', '#46012', 'Service', '2025-06-13 10:34:10', 3490.24),
(4, 1, 'Emma Wilson', '#10557', 'Refill', '2025-06-17 13:34:10', 3936.11),
(5, 1, 'Jennifer Taylor', '#46212', 'Service', '2025-06-15 06:34:10', 3571.19),
(6, 1, 'John Smith', '#88850', 'Subscribe', '2025-06-11 14:34:10', 1964.99),
(7, 1, 'David Miller', '#76063', 'Card', '2025-07-03 12:34:10', 1191.06),
(8, 1, 'David Miller', '#77133', 'Subscribe', '2025-06-20 02:34:10', 2734.96),
(9, 1, 'Sarah Davis', '#01834', 'Card', '2025-06-23 13:34:10', 199.34),
(10, 1, 'Emma Wilson', '#66596', 'Refill', '2025-06-24 18:34:10', 1399.47),
(11, 1, 'Jennifer Taylor', '#39955', 'Card', '2025-06-06 21:34:10', 488.63),
(12, 1, 'Robert White', '#76519', 'Refill', '2025-07-03 19:34:10', 1459.87),
(13, 1, 'Mary Martinez', '#34559', 'Refill', '2025-06-06 10:34:10', 1189.05),
(14, 1, 'Michael Brown', '#95672', 'Subscribe', '2025-07-01 07:34:10', 2552.38),
(15, 1, 'Robert White', '#03951', 'Refill', '2025-06-08 01:34:10', 4579.73),
(16, 1, 'Sarah Davis', '#87868', 'Card', '2025-06-17 00:34:10', 724.95),
(17, 1, 'John Smith', '#73720', 'Service', '2025-06-11 03:34:10', 4435.47),
(18, 1, 'Michael Brown', '#58776', 'Refill', '2025-06-27 21:34:10', 3936.89),
(19, 1, 'Jennifer Taylor', '#75495', 'Service', '2025-06-21 11:34:10', 2686.95),
(20, 1, 'James Johnson', '#02798', 'Subscribe', '2025-06-17 05:34:10', 4900.15),
(21, 1, 'John Doe', 'TRX001', NULL, '2025-07-05 18:42:04', 5000.00),
(22, 1, 'John Doe', 'TRX002', NULL, '2025-07-05 18:42:04', 3000.00),
(23, 1, 'John Doe', 'TRX003', NULL, '2025-07-05 18:42:04', 2500.00),
(24, 1, 'John Doe', 'TRX004', NULL, '2025-07-05 18:42:04', 4000.00);

