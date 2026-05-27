"use client";

import { useState, useEffect, useCallback } from "react";

const KEY = "daniel_english_favorites";

export function useFavorites() {
  const [favorites, setFavorites] = useState([]);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    try {
      const raw = localStorage.getItem(KEY);
      setFavorites(raw ? JSON.parse(raw) : []);
    } catch {
      setFavorites([]);
    }
    setLoaded(true);
  }, []);

  const toggleFavorite = useCallback((id) => {
    setFavorites((prev) => {
      const next = prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id];
      localStorage.setItem(KEY, JSON.stringify(next));
      return next;
    });
  }, []);

  const isFavorite = useCallback(
    (id) => favorites.includes(id),
    [favorites]
  );

  return { favorites, toggleFavorite, isFavorite, loaded };
}
