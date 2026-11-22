INSERT INTO clientes (nombre, email, telefono, notas)
SELECT seed.nombre, seed.email, seed.telefono, seed.notas
FROM (
    VALUES
        ('Cliente Demo 01', 'cliente.demo.01@example.test', 'TEST-0001', 'Datos ficticios para pruebas.'),
        ('Cliente Demo 02', 'cliente.demo.02@example.test', 'TEST-0002', 'Datos ficticios para pruebas.'),
        ('Cliente Demo 03', 'cliente.demo.03@example.test', 'TEST-0003', 'Datos ficticios para pruebas.'),
        ('Cliente Demo 04', 'cliente.demo.04@example.test', 'TEST-0004', 'Datos ficticios para pruebas.'),
        ('Cliente Demo 05', 'cliente.demo.05@example.test', 'TEST-0005', 'Datos ficticios para pruebas.'),
        ('Cliente Demo 06', 'cliente.demo.06@example.test', 'TEST-0006', 'Datos ficticios para pruebas.'),
        ('Cliente Demo 07', 'cliente.demo.07@example.test', 'TEST-0007', 'Datos ficticios para pruebas.'),
        ('Cliente Demo 08', 'cliente.demo.08@example.test', 'TEST-0008', 'Datos ficticios para pruebas.')
) AS seed(nombre, email, telefono, notas)
WHERE NOT EXISTS (
    SELECT 1
    FROM clientes AS existing
    WHERE LOWER(existing.email) = LOWER(seed.email)
);

INSERT INTO vehiculos (cliente_id, matricula, marca, modelo, anio, km)
SELECT c.id, seed.matricula, seed.marca, seed.modelo, seed.anio, seed.km
FROM (
    VALUES
        ('cliente.demo.01@example.test', 'TST0001', 'Seat', 'Ibiza', 2017, 84210),
        ('cliente.demo.01@example.test', 'TST0002', 'Volkswagen', 'Golf', 2020, 45300),
        ('cliente.demo.02@example.test', 'TST0003', 'Renault', 'Clio', 2014, 132000),
        ('cliente.demo.03@example.test', 'TST0004', 'Toyota', 'Corolla', 2019, 67850),
        ('cliente.demo.04@example.test', 'TST0005', 'Ford', 'Focus', 2016, 98400),
        ('cliente.demo.05@example.test', 'TST0006', 'Peugeot', '208', 2021, 23100),
        ('cliente.demo.06@example.test', 'TST0007', 'Opel', 'Corsa', 2012, 156700),
        ('cliente.demo.07@example.test', 'TST0008', 'Kia', 'Sportage', 2018, 74900),
        ('cliente.demo.08@example.test', 'TST0009', 'Hyundai', 'Tucson', 2022, 18500)
) AS seed(email, matricula, marca, modelo, anio, km)
JOIN clientes AS c ON LOWER(c.email) = LOWER(seed.email)
WHERE NOT EXISTS (
    SELECT 1
    FROM vehiculos AS existing
    WHERE existing.matricula = seed.matricula
      AND existing.archivado_en IS NULL
);
