-- Insert Admin User (Password: 'admin123')
INSERT INTO users (first_name, last_name, email, password_hash, role) 
VALUES ('Super', 'Admin', 'admin@municipal.gov', '$2b$10$BF/.waiPnnnuRDURmqRV1.m6KDxzRuuYB71kRlDnP86oBKDyHPA7i', 'admin')
ON CONFLICT (email) DO UPDATE SET password_hash = EXCLUDED.password_hash;

-- Insert Citizen User (Password: 'user123')
INSERT INTO users (first_name, last_name, email, password_hash, role) 
VALUES ('John', 'Doe', 'john.doe@example.com', '$2b$10$/wzBp9d2ofhtywQWb.fQRevC.QaOQlJK30A5JV0T.S/ymAJWT03UK', 'citizen')
ON CONFLICT (email) DO UPDATE SET password_hash = EXCLUDED.password_hash;

-- Insert Departments
INSERT INTO departments (name) VALUES 
('Public Works'),
('Electrical'),
('Sanitation'),
('Water Supply')
ON CONFLICT (name) DO NOTHING;
