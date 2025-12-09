import { Button, Modal } from '@/components';

interface DeleteServiceModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  isLoading?: boolean;
}

export const DeleteServiceModal = ({
  isOpen,
  onClose,
  onConfirm,
  isLoading,
}: DeleteServiceModalProps) => {
  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Delete Service">
      <div className="space-y-4">
        <p className="text-(--color-body)">
          Are you sure you want to delete this service? This action cannot be
          undone.
        </p>
        <div className="flex justify-end gap-3">
          <Button variant="outline" onClick={onClose} disabled={isLoading}>
            Cancel
          </Button>
          <Button
            onClick={onConfirm}
            className="bg-red-600 hover:bg-red-700 text-white"
            loading={isLoading}
          >
            Delete
          </Button>
        </div>
      </div>
    </Modal>
  );
};
