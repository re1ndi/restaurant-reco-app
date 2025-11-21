CREATE DATABASE IF NOT EXISTS reco_app_db;
USE reco_app_db;

CREATE TABLE IF NOT EXISTS restaurants (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  latitude DECIMAL(10,8) NOT NULL,
  longitude DECIMAL(11,8) NOT NULL,
  category VARCHAR(50) NOT NULL,
  avg_rating DECIMAL(2,1) NOT NULL
);

INSERT INTO restaurants (name, latitude, longitude, category, avg_rating) VALUES
('Resto Italia Sentral', -6.2100, 106.8000, 'Italia', 4.8),
('Seafood Pinggir Kali', -6.2300, 106.7800, 'Seafood', 3.5),
('Warung Jawa Asli', -6.2350, 106.7800, 'Jawa', 4.1),
('Pizza Express Cepat', -6.2050, 106.8050, 'Italia', 3.9),
('Toko Roti Manis', -6.3000, 106.9000, 'Dessert', 4.6);
