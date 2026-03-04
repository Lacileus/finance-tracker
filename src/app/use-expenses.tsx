import { useSelector, useDispatch } from 'react-redux';
import type { RootState, AppDispatch } from './store/store';
import {
  addExpense as addExpenseAction,
  removeExpense as removeExpenseAction,
  selectExpenses,
} from './store/expensesSlice';
import type { Expense } from '@/types/expense';

export function useExpenses() {
  const expenses = useSelector((state: RootState) => selectExpenses(state));
  const dispatch = useDispatch<AppDispatch>();

  return {
    expenses,
    addExpense: (expense: Expense) => dispatch(addExpenseAction(expense)),
    removeExpense: (expenseID: { id: string }) => dispatch(removeExpenseAction(expenseID)),
  };
}
