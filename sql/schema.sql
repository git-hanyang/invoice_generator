CREATE TABLE IF NOT EXISTS businesses (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    code VARCHAR(50) NOT NULL UNIQUE,
    name VARCHAR(200) NOT NULL,
    name_secondary VARCHAR(200),
    address TEXT,
    tel VARCHAR(50),
    hand_phone VARCHAR(50),
    gst_reg_no VARCHAR(50),
    specialty_en TEXT,
    specialty_zh TEXT
);

INSERT IGNORE INTO businesses (code, name, name_secondary, address, tel, hand_phone, gst_reg_no, specialty_en, specialty_zh)
VALUES (
    'KRS',
    'KAJANG REPAIRS & SERVICE CENTRE',
    '加影汽車修理中心',
    '23, Jalan Zamrud 1, Taman Zamrud, Batu 16, Jln. Semenyih, 43000 Kajang, Selangor.',
    '03-8736 8123',
    '019-228 0492',
    '000957243392',
    'Specialist in Car Air-Cond., Car Wiring, Checking, Alternater, Starter & Engine.',
    '專修理汽車電器,冷氣,引擎與貴進口各國本地電池'
);

CREATE TABLE IF NOT EXISTS users (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    username VARCHAR(100) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,
    business_id BIGINT,
    FOREIGN KEY (business_id) REFERENCES businesses(id)
);

CREATE TABLE IF NOT EXISTS customers (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    car_plate VARCHAR(50) NOT NULL,
    phone VARCHAR(30) NOT NULL DEFAULT '',
    vehicle_model VARCHAR(200) NOT NULL DEFAULT '',
    UNIQUE KEY uq_car_plate_phone_vehicle (car_plate, phone, vehicle_model)
);

CREATE TABLE IF NOT EXISTS work_items (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    description TEXT NOT NULL,
    vehicle_model VARCHAR(200) NOT NULL DEFAULT '',
    unit_price DECIMAL(10,2) NOT NULL DEFAULT 0.00,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NULL DEFAULT NULL ON UPDATE CURRENT_TIMESTAMP,
    UNIQUE INDEX uq_vehicle_model_description (vehicle_model, description(255)),
    FULLTEXT INDEX ft_description (description),
    FULLTEXT INDEX ft_vehicle_model (vehicle_model)
);

CREATE TABLE IF NOT EXISTS invoices (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    invoice_number VARCHAR(100) NOT NULL,
    customer_id BIGINT NOT NULL,
    invoice_date DATE NOT NULL,
    total_amount DECIMAL(10,2) NOT NULL DEFAULT 0.00,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NULL DEFAULT NULL ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (customer_id) REFERENCES customers(id),
    INDEX idx_invoice_number (invoice_number)
);

CREATE TABLE IF NOT EXISTS invoice_payments (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    invoice_id BIGINT NOT NULL,
    amount DECIMAL(10,2) NOT NULL,
    payment_date DATE NOT NULL,
    FOREIGN KEY (invoice_id) REFERENCES invoices(id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS invoice_items (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    invoice_id BIGINT NOT NULL,
    description TEXT NOT NULL,
    quantity DECIMAL(10,2) NOT NULL DEFAULT 1.00,
    unit_price DECIMAL(10,2) NOT NULL,
    amount DECIMAL(10,2) NOT NULL,
    sort_order INT NOT NULL DEFAULT 0,
    FOREIGN KEY (invoice_id) REFERENCES invoices(id) ON DELETE CASCADE
);
