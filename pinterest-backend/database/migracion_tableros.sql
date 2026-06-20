-- ============================================================================
-- Migración: Sistema de Tableros (Boards) estilo Pinterest
-- Ejecutar UNA sola vez sobre la base de datos existente.
--   Local (phpMyAdmin/XAMPP):  seleccionar la BD `pinterest` y ejecutar.
--   freesqldatabase / Render:  seleccionar tu BD (ej. sql5830978) y ejecutar
--                              (en ese caso ignora la línea USE de abajo).
--
-- Relaciones resultantes:
--   usuarios (1) ──< tableros (N)            -> cada tablero tiene un dueño
--   tableros (1) ──< tablero_pines (N)       -> tabla intermedia (BoardPins)
--   pines    (1) ──< tablero_pines (N)       -> un pin puede estar en varios tableros
-- ============================================================================

USE `pinterest`;

-- ----------------------------------------------------------------------------
-- 1) Rehacer la tabla `tableros` para que cada tablero pertenezca a un usuario.
--    La versión anterior tenía una columna `id_pines` (un solo pin por tablero),
--    que ya no se usa porque ahora la relación N:M vive en `tablero_pines`.
-- ----------------------------------------------------------------------------

-- 1.1 Quitar la FK y la columna antigua `id_pines` (si existen).
--     Si tu tabla `tableros` no tenía estas, comenta estas dos líneas.
ALTER TABLE `tableros` DROP FOREIGN KEY `tableros_ibfk_1`;
ALTER TABLE `tableros` DROP COLUMN `id_pines`;

-- 1.2 Agregar el dueño del tablero y la fecha de creación.
ALTER TABLE `tableros`
  ADD COLUMN `id_usuario` INT(11) NOT NULL AFTER `nombre`,
  ADD COLUMN `fecha_creacion` TIMESTAMP NOT NULL DEFAULT current_timestamp();

-- 1.3 Indexar y enlazar con `usuarios` (al borrar un usuario se borran sus tableros).
ALTER TABLE `tableros`
  ADD KEY `id_usuario` (`id_usuario`),
  ADD CONSTRAINT `tableros_usuario_fk`
    FOREIGN KEY (`id_usuario`) REFERENCES `usuarios` (`id_usuario`) ON DELETE CASCADE;

-- ----------------------------------------------------------------------------
-- 2) Tabla intermedia `tablero_pines` (BoardPins): qué pines hay en qué tablero.
--    UNIQUE evita guardar el mismo pin dos veces en el mismo tablero.
-- ----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS `tablero_pines` (
  `id_tablero_pin` INT(11) NOT NULL AUTO_INCREMENT,
  `id_tablero` INT(11) NOT NULL,
  `id_pin` INT(11) NOT NULL,
  `fecha_guardado` TIMESTAMP NOT NULL DEFAULT current_timestamp(),
  PRIMARY KEY (`id_tablero_pin`),
  UNIQUE KEY `uq_tablero_pin` (`id_tablero`, `id_pin`),
  KEY `id_pin` (`id_pin`),
  CONSTRAINT `tp_tablero_fk` FOREIGN KEY (`id_tablero`) REFERENCES `tableros` (`id_tablero`) ON DELETE CASCADE,
  CONSTRAINT `tp_pin_fk` FOREIGN KEY (`id_pin`) REFERENCES `pines` (`id_pin`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
