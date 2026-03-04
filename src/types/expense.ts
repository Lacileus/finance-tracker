export interface Expense {
  id: string;
  amount: number;
  category: string;
  date: string; // формат "YYYY-MM-DD", удобен для input type="date"
  description: string;
}

export const CATEGORIES = [
  { value: 'food', label: 'Еда' },
  { value: 'transport', label: 'Транспорт' },
  { value: 'clothing', label: 'Одежда' },
  { value: 'entertainment', label: 'Развлечения' },
  { value: 'health', label: 'Здоровье' },
  { value: 'other', label: 'Прочее' },
];
