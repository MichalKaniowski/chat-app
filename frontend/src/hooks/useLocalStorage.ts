import { useCallback } from "react";

export default function useLocalStorage() {
  const getItem = useCallback((key: string) => {
    try {
      const item = localStorage.getItem(key);
      return item ? JSON.parse(item) : null;
    } catch (error) {
      console.log(error);
      return null;
    }
  }, []);

  const setItem = useCallback((key: string, value: string) => {
    try {
      localStorage.setItem(key, value);
    } catch (error) {
      console.log(error);
    }
  }, []);

  const removeItem = useCallback((key: string) => {
    try {
      localStorage.removeItem(key);
    } catch (error) {
      console.log(error);
    }
  }, []);

  return { getItem, setItem, removeItem };
}
