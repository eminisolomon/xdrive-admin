import { Button, Modal } from '@/components';
import { Service } from '@/interfaces/service';

interface ToggleServiceStatusModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  service: Service | null;
  isLoading?: boolean;
}

export const ToggleServiceStatusModal = ({
  isOpen,
  onClose,
  onConfirm,
  service,
  isLoading,
}: ToggleServiceStatusModalProps) => {
  const isActive = service?.is_active;

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={isActive ? 'Deactivate Service' : 'Activate Service'}
    >
      <div className="space-y-4">
        <p className="text-(--color-body)">
          Are you sure you want to {isActive ? 'deactivate' : 'activate'}{' '}
          <b>{service?.name}</b>?
          {isActive
            ? ' It will be hidden from users.'
            : ' It will become visible to users.'}
        </p>
        <div className="flex justify-end gap-3">
          <Button variant="outline" onClick={onClose} disabled={isLoading}>
            Cancel
          </Button>
          <Button
            onClick={onConfirm}
            className={
              isActive
                ? 'bg-amber-600 hover:bg-amber-700 text-white'
                : 'bg-emerald-600 hover:bg-emerald-700 text-white'
            }
            loading={isLoading}
          >
            {isActive ? 'Deactivate' : 'Activate'}
          </Button>
        </div>
      </div>
    </Modal>
  );
};
