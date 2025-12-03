-- Seed script for company and system lookup tables
-- This matches the data structure from the original MySQL database

-- FSO Companies
INSERT INTO companies_fso (id, name) VALUES 
(1, 'Canon'),
(2, 'fSONA'),
(3, 'LightPointe'),
(4, 'MRV'),
(5, 'Wireless Excellence');

-- FSO Systems

INSERT INTO systems_fso (id, name, tx_power, tx_power_unit, rx_sensitivity, rx_lens_diameter, directivity, wavelength, company_id) VALUES
(1, 'CanonCanoBeam DT-10', 1.3, 'mW', -40, 20, 4, 850, 1),
(2, 'CanonCanoBeam DT-20', 2.0, 'mW', -42, 25, 3.5, 850, 1),
(3, 'fSONA SONAbeam E', 2.5, 'mW', -38, 18, 4.5, 1550, 2),
(4, 'fSONA SONAbeam M', 3.0, 'mW', -40, 22, 4, 1550, 2),
(5, 'LightPointe AireLink', 1.5, 'mW', -39, 19, 4.2, 850, 3);

-- RF Companies
INSERT INTO companies_rf (id, name) VALUES
(1, 'Ubiquiti'),
(2, 'Mikrotik'),
(3, 'Cambium Networks');

-- RF Systems

INSERT INTO systems_rf (id, name, tx_power, tx_power_unit, rx_sensitivity, frequency, gain, company_id) VALUES
(1, 'NanoStation M5', 24, 'dBm', -96, 5.8, 16, 1),
(2, 'PowerBeam AC', 25, 'dBm', -95, 5.8, 25, 1),
(3, 'Mikrotik SXT Lite5', 22, 'dBm', -94, 5.8, 16, 2),
(4, 'Cambium ePMP Force 300', 26, 'dBm', -93, 5.8, 25, 3);

-- Verify insertions
SELECT 'FSO Companies' as table_name, COUNT(*) as count FROM companies_fso
UNION ALL
SELECT 'FSO Systems', COUNT(*) FROM systems_fso
UNION ALL
SELECT 'RF Companies', COUNT(*) FROM companies_rf
UNION ALL
SELECT 'RF Systems', COUNT(*) FROM systems_rf;
