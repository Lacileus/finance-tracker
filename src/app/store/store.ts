import { configureStore } from '@reduxjs/toolkit';
import expensesReducer from './expensesSlice';

/*
  configureStore создаёт Redux store.
  В reducer передаём объект — каждый ключ это "срез" (slice) глобального состояния.

  Итоговая форма store:
    {
      expenses: { items: Expense[] }
    }

  При добавлении новых слайсов (например, categoriesSlice) —
  просто добавляем ключ сюда, остальное Redux обработает сам.
*/
export const store = configureStore({
  reducer: {
    expenses: expensesReducer,
  },
});

/*
  Подписываемся на каждое изменение store и сохраняем в localStorage.
  store.subscribe вызывается после каждого dispatched action.

  Это аналог useEffect(() => { localStorage.setItem(...) }, [expenses])
  из старого ExpensesProvider — только теперь вне React-компонента.
*/
store.subscribe(() => {
  const { expenses } = store.getState();
  localStorage.setItem('expenses', JSON.stringify(expenses.items));
});

/*
  TypeScript-типы, которые нужны для типизации useSelector и useDispatch.

  RootState — тип всего глобального состояния.
    ReturnType<typeof store.getState> автоматически выведет:
    { expenses: { items: Expense[] } }

  AppDispatch — тип функции dispatch. Нужен для корректной типизации
    при использовании thunk'ов (асинхронные actions), которые появятся позже.
*/
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
