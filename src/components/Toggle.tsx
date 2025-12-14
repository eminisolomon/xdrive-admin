import * as Switch from '@radix-ui/react-switch';
import { cn } from '@/lib/utils';

interface ToggleProps {
  checked: boolean;
  onChange: (checked: boolean) => void;
  label?: string;
  disabled?: boolean;
}

const Toggle = ({
  checked,
  onChange,
  label,
  disabled = false,
}: ToggleProps) => {
  return (
    <div className="flex items-center space-x-2">
      <Switch.Root
        checked={checked}
        onCheckedChange={onChange}
        disabled={disabled}
        className={cn(
          'peer inline-flex h-6 w-11 shrink-0 cursor-pointer items-center rounded-full border-2 border-transparent transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-(--color-primary) focus-visible:ring-offset-2 focus-visible:ring-offset-(--color-background) disabled:cursor-not-allowed disabled:opacity-50 data-[state=checked]:bg-(--color-primary) data-[state=unchecked]:bg-(--color-inactive)',
        )}
      >
        <Switch.Thumb
          className={cn(
            'pointer-events-none block h-5 w-5 rounded-full bg-white shadow-lg ring-0 transition-transform data-[state=checked]:translate-x-5 data-[state=unchecked]:translate-x-0',
          )}
        />
      </Switch.Root>
      {label && (
        <span className="text-sm font-medium leading-none text-(--color-text) peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
          {label}
        </span>
      )}
    </div>
  );
};

export default Toggle;
