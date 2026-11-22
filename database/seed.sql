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
