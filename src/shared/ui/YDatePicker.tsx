import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { format, parseISO } from 'date-fns';

interface YDatePickerProps {
  date: string;
  setDate: (date: string) => void;
}

export function YDatePicker({ date, setDate }: YDatePickerProps) {
  const dateObj = parseISO(date);

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          id="date-picker-simple"
          className="justify-start font-normal rounded-full"
        >
          <span>{date ? format(date, 'dd MMM yyyy') : 'Pick a date'}</span>
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-auto p-0" align="start">
        <Calendar
          mode="single"
          selected={dateObj}
          onSelect={(d) => d && setDate(format(d, 'yyyy-MM-dd'))}
          defaultMonth={dateObj}
        />
      </PopoverContent>
    </Popover>
  );
}
