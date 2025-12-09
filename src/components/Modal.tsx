import * as Dialog from '@radix-ui/react-dialog';
import { XMarkIcon } from '@heroicons/react/24/outline';

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
}

export const Modal: React.FC<ModalProps> = ({
  isOpen,
  onClose,
  title,
  children,
}) => {
  return (
    <Dialog.Root open={isOpen} onOpenChange={onClose}>
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm" />

        <Dialog.Content
          className="
            fixed left-1/2 top-1/2 z-50 w-[95%] sm:w-full max-w-lg -translate-x-1/2 -translate-y-1/2
            rounded-2xl border border-(--color-border) bg-(--color-surface) shadow-2xl
            px-6 py-8 sm:px-8
            max-h-[85vh] overflow-y-auto
            data-[state=open]:animate-in data-[state=closed]:animate-out
            data-[state=open]:fade-in-0 data-[state=closed]:fade-out-0
            data-[state=open]:zoom-in-95 data-[state=closed]:zoom-out-95
            data-[state=open]:slide-in-from-left-1/2 data-[state=open]:slide-in-from-top-[48%]
            data-[state=closed]:slide-out-to-left-1/2 data-[state=closed]:slide-out-to-top-[48%]
          "
        >
          <div className="flex items-center justify-between mb-6">
            <Dialog.Title className="text-2xl font-bold text-(--color-text)">
              {title}
            </Dialog.Title>

            <Dialog.Close className="rounded-full p-2 hover:bg-(--color-hover) transition-colors">
              <XMarkIcon className="h-6 w-6 text-(--color-body)" />
              <span className="sr-only">Close</span>
            </Dialog.Close>
          </div>

          <div className="text-(--color-body) leading-relaxed">{children}</div>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
};
