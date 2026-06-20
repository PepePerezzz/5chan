-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Servidor: 127.0.0.1
-- Tiempo de generación: 04-06-2026 a las 21:05:22
-- Versión del servidor: 10.4.32-MariaDB
-- Versión de PHP: 8.2.12

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Base de datos: `pinterest`
--

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `pines`
--

CREATE TABLE `pines` (
  `id_pin` int(11) NOT NULL,
  `categoria` varchar(100) NOT NULL,
  `descripcion` text DEFAULT NULL,
  `texto` longtext NOT NULL,
  `id_usuario` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `tableros`
--

CREATE TABLE `tableros` (
  `id_tablero` int(11) NOT NULL,
  `nombre` varchar(100) NOT NULL,
  `id_usuario` int(11) NOT NULL,
  `fecha_creacion` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `tablero_pines` (relación N:M tableros<->pines)
--

CREATE TABLE `tablero_pines` (
  `id_tablero_pin` int(11) NOT NULL,
  `id_tablero` int(11) NOT NULL,
  `id_pin` int(11) NOT NULL,
  `fecha_guardado` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `usuarios`
--

CREATE TABLE `usuarios` (
  `id_usuario` int(11) NOT NULL,
  `nombre` varchar(100) NOT NULL,
  `correo` varchar(100) NOT NULL,
  `contraseña` varchar(255) NOT NULL,
  `rol` enum('admin','usuario') DEFAULT 'usuario',
  `fecha_registro` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `usuarios`
--

INSERT INTO `usuarios` (`id_usuario`, `nombre`, `correo`, `contraseña`, `rol`, `fecha_registro`) VALUES
(1, 'Miguel', 'miguel@admin.com', '$2b$10$feqW1r7XaEF9vpS1kM5EVuj9mL67cGKf0X.2k3kIJX/m8yu0qxc/O', 'admin', '2026-06-02 22:39:34'),
(2, 'Alonso', 'alonso@admin.com', '$2b$10$feqW1r7XaEF9vpS1kM5EVuj9mL67cGKf0X.2k3kIJX/m8yu0qxc/O', 'admin', '2026-06-02 22:39:34'),
(3, 'Edson', 'edson@admin.com', '$2b$10$feqW1r7XaEF9vpS1kM5EVuj9mL67cGKf0X.2k3kIJX/m8yu0qxc/O', 'admin', '2026-06-02 22:39:34'),
(4, 'Ruth', 'ruth@admin.com', '$2b$10$feqW1r7XaEF9vpS1kM5EVuj9mL67cGKf0X.2k3kIJX/m8yu0qxc/O', 'admin', '2026-06-02 22:39:34'),
(5, 'Fer', 'fer@admin.com', '$2b$10$feqW1r7XaEF9vpS1kM5EVuj9mL67cGKf0X.2k3kIJX/m8yu0qxc/O', 'admin', '2026-06-02 22:39:34'),
(6, 'Jesus', 'jesus@gmail.com', '$2b$10$SVmktOShAJtPLbMneXBHmuhVUYinqvc6zBlVC6YRBNTRoGuerIP9m', 'usuario', '2026-06-02 23:03:34'),
(7, 'Maria', 'maria@gmail.com', '$2b$10$WtcCj.LLIfQr/IGwxsBufeZDQzjYZjaEdPMl5VLR/z8ygV68XFhtG', 'usuario', '2026-06-04 18:24:07');

--
-- Índices para tablas volcadas
--

--
-- Indices de la tabla `pines`
--
ALTER TABLE `pines`
  ADD PRIMARY KEY (`id_pin`),
  ADD KEY `id_usuario` (`id_usuario`);

--
-- Indices de la tabla `tableros`
--
ALTER TABLE `tableros`
  ADD PRIMARY KEY (`id_tablero`),
  ADD KEY `id_usuario` (`id_usuario`);

--
-- Indices de la tabla `tablero_pines`
--
ALTER TABLE `tablero_pines`
  ADD PRIMARY KEY (`id_tablero_pin`),
  ADD UNIQUE KEY `uq_tablero_pin` (`id_tablero`,`id_pin`),
  ADD KEY `id_pin` (`id_pin`);

--
-- Indices de la tabla `usuarios`
--
ALTER TABLE `usuarios`
  ADD PRIMARY KEY (`id_usuario`),
  ADD UNIQUE KEY `correo` (`correo`);

--
-- AUTO_INCREMENT de las tablas volcadas
--

--
-- AUTO_INCREMENT de la tabla `pines`
--
ALTER TABLE `pines`
  MODIFY `id_pin` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT de la tabla `tableros`
--
ALTER TABLE `tableros`
  MODIFY `id_tablero` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT de la tabla `tablero_pines`
--
ALTER TABLE `tablero_pines`
  MODIFY `id_tablero_pin` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT de la tabla `usuarios`
--
ALTER TABLE `usuarios`
  MODIFY `id_usuario` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=9;

--
-- Restricciones para tablas volcadas
--

--
-- Filtros para la tabla `tableros`
--
ALTER TABLE `tableros`
  ADD CONSTRAINT `tableros_usuario_fk` FOREIGN KEY (`id_usuario`) REFERENCES `usuarios` (`id_usuario`) ON DELETE CASCADE;

--
-- Filtros para la tabla `tablero_pines`
--
ALTER TABLE `tablero_pines`
  ADD CONSTRAINT `tp_tablero_fk` FOREIGN KEY (`id_tablero`) REFERENCES `tableros` (`id_tablero`) ON DELETE CASCADE,
  ADD CONSTRAINT `tp_pin_fk` FOREIGN KEY (`id_pin`) REFERENCES `pines` (`id_pin`) ON DELETE CASCADE;

--
-- Filtros para la tabla `pines`
--
ALTER TABLE `pines`
  ADD CONSTRAINT `pines_ibfk_1` FOREIGN KEY (`id_usuario`) REFERENCES `usuarios` (`id_usuario`);
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
