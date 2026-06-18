-- Migración: agregar la columna id_usuario a la tabla `pines`.
-- Ejecutar UNA sola vez sobre la base de datos `pinterest` existente
-- (por ejemplo en phpMyAdmin o con: mysql -u root pinterest < migracion_id_usuario.sql)

USE `pinterest`;

-- 1. Agregar la columna. Si ya hay pines guardados, se les asigna
--    temporalmente el usuario admin con id_usuario = 1 para no romper la FK.
ALTER TABLE `pines`
  ADD COLUMN `id_usuario` int(11) NOT NULL DEFAULT 1;

-- 2. Indexar la columna y enlazarla con la tabla usuarios.
ALTER TABLE `pines`
  ADD KEY `id_usuario` (`id_usuario`),
  ADD CONSTRAINT `pines_ibfk_1`
    FOREIGN KEY (`id_usuario`) REFERENCES `usuarios` (`id_usuario`);

-- 3. Quitar el DEFAULT para que de aquí en adelante cada pin exija un autor real.
ALTER TABLE `pines`
  ALTER COLUMN `id_usuario` DROP DEFAULT;
