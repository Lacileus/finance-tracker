import { useCallback } from 'react';
import { CATEGORIES } from '@/types/expense';

/*
  Хук инкапсулирует знание о категориях:
  где они хранятся, как получить метку по значению.

  Компоненты, использующие useCategories(), не зависят напрямую от
  структуры CATEGORIES — детали скрыты внутри хука.
  Если в будущем категории начнут приходить с сервера,
  нужно будет изменить только этот хук, а не каждый компонент.
*/
export function useCategories() {
  /*
    getLabel стабилен — CATEGORIES константа и никогда не меняется,
    поэтому [] зависимостей оправдан.
    Это позволяет передавать getLabel в React.memo-компоненты без лишних ре-рендеров.
  */
  const getLabel = useCallback(
    (value: string): string => CATEGORIES.find((cat) => cat.value === value)?.label ?? value,
    [],
  );

  return { categories: CATEGORIES, getLabel };
}
