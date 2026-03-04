import { createSlice, type PayloadAction } from '@reduxjs/toolkit';
import type { Expense } from '@/types/expense';
import { MOCK_EXPENSES } from '@/mocks/expenses';

/*
  Slice (срез) — основная единица Redux Toolkit.
  Объединяет в одном месте то, что в классическом Redux писалось отдельно:
    - initialState (начальное состояние)
    - reducers (функции-обработчики изменений)
    - actions (создаются автоматически из reducers)

  Классический Redux требовал:
    const ADD_EXPENSE = 'expenses/addExpense'           // action type
    const addExpense = (e) => ({ type: ADD_EXPENSE, payload: e }) // action creator
    function reducer(state, action) { ... }             // reducer отдельно

  Redux Toolkit убирает весь этот бойлерплейт.
*/

interface ExpensesState {
  items: Expense[];
}

/*
  Начальное состояние загружается из localStorage при старте приложения.
  Это обычная функция (не хук), поэтому её можно вызывать вне компонента.

  Раньше эту же задачу выполнял useLocalStorage внутри ExpensesProvider.
  Теперь загрузка происходит один раз при инициализации store.
*/
const loadFromStorage = (): Expense[] => {
  // const stored = localStorage.getItem('expenses')
  // if (stored !== null) return JSON.parse(stored) as Expense[]

  return MOCK_EXPENSES;
};

const initialState: ExpensesState = {
  items: loadFromStorage(),
};

export const expensesSlice = createSlice({
  name: 'expenses', // Префикс для action types. addExpense → "expenses/addExpense"
  initialState,
  reducers: {
    /*
      Redux Toolkit использует библиотеку Immer под капотом.
      Благодаря этому можно писать "мутирующий" код — Immer перехватывает изменения
      и создаёт новый иммутабельный объект.

      state.items.push(...) выглядит как мутация, но React получит новый объект.
      Это то же самое, что раньше писали: setExpenses(prev => [...prev, expense])

      PayloadAction<Expense> — TypeScript-тип: action.payload будет типа Expense.
    */
    addExpense: (state, action: PayloadAction<Expense>) => {
      state.items.push(action.payload);
    },
    removeExpense: (state, action: PayloadAction<{ id: string }>) => {
      // .filter() возвращает новый массив — нужно присвоить его обратно.
      // Immer позволяет прямое присваивание state.items = ...
      state.items = state.items.filter((e) => e.id !== action.payload.id);
    },
  },
});

/*
  Экспортируем action creator — функцию, которая создаёт action-объект.
  addExpense(expense) вернёт: { type: "expenses/addExpense", payload: expense }

  Использование в компоненте:
    dispatch(addExpense(expense))
*/
export const { addExpense, removeExpense } = expensesSlice.actions;

/*
  Селектор — функция для извлечения конкретного куска состояния из store.
  Использование в компоненте:
    const expenses = useSelector(selectExpenses)
*/
export const selectExpenses = (state: { expenses: ExpensesState }) => state.expenses.items;

export default expensesSlice.reducer;
