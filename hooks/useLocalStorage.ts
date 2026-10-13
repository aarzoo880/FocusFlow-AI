"use client";

import { useEffect, useRef, useState } from "react";

/**
 * Persist state in localStorage with SSR-safe hydration.
 * Returns [value, setValue, hasHydrated].
 */
export function useLocalStorage<T>(
  key: string,
  initialValue: T
): [T, React.Dispatch<React.SetStateAction<T>>, boolean] {
  const [value, setValue] = useState<T>(initialValue);
  const [hasHydrated, setHasHydrated] = useState(false);
  const keyRef = useRef(key);
  keyRef.current = key;

  // Load once on mount
  useEffect(() => {
    try {
      const raw = window.localStorage.getItem(keyRef.current);
      if (raw !== null) {
        setValue(JSON.parse(raw) as T);
      }
    } catch (err) {
      console.warn(`useLocalStorage: failed to read "${keyRef.current}"`, err);
    }
    setHasHydrated(true);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Persist on change (after hydration)
  useEffect(() => {
    if (!hasHydrated) return;
    try {
      window.localStorage.setItem(keyRef.current, JSON.stringify(value));
    } catch (err) {
      console.warn(`useLocalStorage: failed to write "${keyRef.current}"`, err);
    }
  }, [value, hasHydrated]);

  return [value, setValue, hasHydrated];
}
