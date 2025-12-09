import { Modal, Button } from '@/components';

interface DeleteModelModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  isLoading?: boolean;
}

const DeleteModelModal = ({
  isOpen,
  onClose,
  onConfirm,
  isLoading,
}: DeleteModelModalProps) => {
  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Delete Model">
      <div className="space-y-4">
        <p className="text-(--color-body)">
          Are you sure you want to delete this car model? This action cannot be
          undone.
        </p>
        <div className="flex justify-end gap-3">
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button
            variant="primary"
            className="bg-red-600 hover:bg-red-700 text-white border-red-600 hover:border-red-700"
            onClick={onConfirm}
            isLoading={isLoading}
          >
            Delete Model
          </Button>
        </div>
      </div>
    </Modal>
  );
};

export default DeleteModelModal;
