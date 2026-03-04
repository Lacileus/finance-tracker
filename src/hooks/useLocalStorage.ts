import { useState, useEffect } from 'react';

/*
  Кастомный хук — обычная функция с именем useXxx, которая вызывает другие хуки.
  Правила:
    1. Название начинается с "use" — это соглашение, не синтаксис.
       React DevTools и линтер распознают хуки именно по нему.
    2. Нельзя вызывать хуки внутри условий, циклов, вложенных функций —
       только на верхнем уровне компонента или другого хука.
    3. Кастомный хук — способ вынести повторяющуюся логику из компонентов,
       как обычная функция выносит повторяющийся код.

  Дженерик <T> делает хук универсальным: он работает с любым типом данных,
  который можно сериализовать в JSON.
*/
export function useLocalStorage<T>(key: string, initialValue: T | (() => T)) {
  const [value, setValue] = useState<T>(() => {
    const stored = localStorage.getItem(key);
    if (stored !== null) {
      return JSON.parse(stored) as T;
    }
    // initialValue может быть значением или функцией (ленивая инициализация).
    // Поддерживаем оба варианта, как сам useState.
    return typeof initialValue === 'function' ? (initialValue as () => T)() : initialValue;
  });

  useEffect(() => {
    localStorage.setItem(key, JSON.stringify(value));
  }, [key, value]);

  return [value, setValue] as const;
  // "as const" — TypeScript возвращает tuple [T, Dispatch<SetStateAction<T>>],
  // а не массив (T | Dispatch<...>)[]. Без него деструктуризация теряет типы.
}
