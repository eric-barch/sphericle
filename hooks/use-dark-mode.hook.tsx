"use client";

import { useEffect, useState } from "react";

const useLocalStorage = (key: string, initialValue?: any) => {
  const [storedValue, setStoredValue] = useState(initialValue);

  useEffect(() => {
    try {
      const item = window.localStorage.getItem(key);
      // Only parse and set the stored value if it's not null
      if (item !== null) {
        setStoredValue(JSON.parse(item));
      }
    } catch (error) {
      console.log(error);
    }
  }, [key]);

  const setValue = (value: any) => {
    try {
      const valueToStore =
        value instanceof Function ? value(storedValue) : value;
      setStoredValue(valueToStore);
      window.localStorage.setItem(key, JSON.stringify(valueToStore));
    } catch (error) {
      console.log(error);
    }
  };

  return [storedValue, setValue];
};

const useDarkMode = () => {
  const [enabled, setEnabled] = useLocalStorage("dark-theme");
  const isEnabled = typeof enabled !== "undefined" ? enabled : false;

  useEffect(() => {
    const className = "dark";
    const bodyClass = window.document.body.classList;

    isEnabled ? bodyClass.add(className) : bodyClass.remove(className);
  }, [enabled, isEnabled]);

  return [enabled, setEnabled];
};

export { useDarkMode };
