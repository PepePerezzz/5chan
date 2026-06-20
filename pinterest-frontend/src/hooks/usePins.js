import { useState, useEffect, useCallback } from "react";
import axios from "axios";
import api from "../services/api";

/**
 * Hook personalizado: centraliza la carga de pines desde el backend.
 * Antes esta misma lógica (GET /pins + loading + manejo de error) estaba
 * duplicada en Feed y Profile; aquí queda en un solo lugar reutilizable.
 *
 * Devuelve los pines, el setter (para inserciones/ediciones optimistas),
 * el estado de carga, el error y un refetch manual.
 */
export default function usePins() {
  const [pins, setPins] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchPins = useCallback(async (signal) => {
    try {
      setLoading(true);
      const res = await api.get("/pins", signal ? { signal } : undefined);
      setPins(res.data);
      setError(null);
    } catch (err) {
      if (axios.isCancel(err)) return; // petición abortada al desmontar
      console.error("Error al cargar los pines:", err);
      setError("No se pudieron cargar los pines.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    const controller = new AbortController();
    fetchPins(controller.signal);
    return () => controller.abort();
  }, [fetchPins]);

  return { pins, setPins, loading, error, refetch: fetchPins };
}
