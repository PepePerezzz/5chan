-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Servidor: 127.0.0.1
-- Tiempo de generación: 19-06-2026 a las 07:23:57
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
  `id_usuario` int(11) DEFAULT NULL,
  `categoria` varchar(100) NOT NULL,
  `descripcion` text DEFAULT NULL,
  `texto` longtext NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `pines`
--

INSERT INTO `pines` (`id_pin`, `id_usuario`, `categoria`, `descripcion`, `texto`) VALUES
(1, 6, 'Frase', 'Pin de prueba', 'Este es un texto de prueba para el feed'),
(2, 6, 'Deporte', 'Mundial', 'La primera ya duerme en tenochtitlan\n'),
(3, 7, 'Amor', 'Amor', 'te amo'),
(4, 6, 'Viajes', 'Canada', 'Nos vemos pronto');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `tableros`
--

CREATE TABLE `tableros` (
  `id_tablero` int(11) NOT NULL,
  `nombre` varchar(100) NOT NULL,
  `id_usuario` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `tableros`
--

INSERT INTO `tableros` (`id_tablero`, `nombre`, `id_usuario`) VALUES
(1, 'Mi tablero de prueba', 6),
(5, 'hola', 7),
(7, 'Pensar', 6);

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `tablero_pines`
--

CREATE TABLE `tablero_pines` (
  `id_tablero_pin` int(11) NOT NULL,
  `id_tablero` int(11) NOT NULL,
  `id_pin` int(11) NOT NULL,
  `fecha_agregado` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `tablero_pines`
--

INSERT INTO `tablero_pines` (`id_tablero_pin`, `id_tablero`, `id_pin`, `fecha_agregado`) VALUES
(1, 1, 1, '2026-06-18 16:13:28'),
(3, 5, 1, '2026-06-19 03:20:20'),
(4, 5, 2, '2026-06-19 03:31:18'),
(9, 7, 4, '2026-06-19 04:48:41'),
(10, 7, 3, '2026-06-19 04:48:45');

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
  ADD KEY `pines_ibfk_1` (`id_usuario`);

--
-- Indices de la tabla `tableros`
--
ALTER TABLE `tableros`
  ADD PRIMARY KEY (`id_tablero`),
  ADD KEY `tableros_ibfk_1` (`id_usuario`);

--
-- Indices de la tabla `tablero_pines`
--
ALTER TABLE `tablero_pines`
  ADD PRIMARY KEY (`id_tablero_pin`),
  ADD UNIQUE KEY `unico_tablero_pin` (`id_tablero`,`id_pin`),
  ADD KEY `tablero_pines_ibfk_2` (`id_pin`);

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
  MODIFY `id_pin` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=5;

--
-- AUTO_INCREMENT de la tabla `tableros`
--
ALTER TABLE `tableros`
  MODIFY `id_tablero` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=8;

--
-- AUTO_INCREMENT de la tabla `tablero_pines`
--
ALTER TABLE `tablero_pines`
  MODIFY `id_tablero_pin` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=11;

--
-- AUTO_INCREMENT de la tabla `usuarios`
--
ALTER TABLE `usuarios`
  MODIFY `id_usuario` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=9;

--
-- Restricciones para tablas volcadas
--

--
-- Filtros para la tabla `pines`
--
ALTER TABLE `pines`
  ADD CONSTRAINT `pines_ibfk_1` FOREIGN KEY (`id_usuario`) REFERENCES `usuarios` (`id_usuario`);

--
-- Filtros para la tabla `tableros`
--
ALTER TABLE `tableros`
  ADD CONSTRAINT `tableros_ibfk_1` FOREIGN KEY (`id_usuario`) REFERENCES `usuarios` (`id_usuario`);

--
-- Filtros para la tabla `tablero_pines`
--
ALTER TABLE `tablero_pines`
  ADD CONSTRAINT `tablero_pines_ibfk_1` FOREIGN KEY (`id_tablero`) REFERENCES `tableros` (`id_tablero`) ON DELETE CASCADE,
  ADD CONSTRAINT `tablero_pines_ibfk_2` FOREIGN KEY (`id_pin`) REFERENCES `pines` (`id_pin`) ON DELETE CASCADE;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
