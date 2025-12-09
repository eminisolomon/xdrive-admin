import React from 'react';
import { Modal, Button } from '@/components';
import { User } from '@/interfaces/users';

interface UserSuspendModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  user: User | null;
  isLoading?: boolean;
}

const UserSuspendModal: React.FC<UserSuspendModalProps> = ({
  isOpen,
  onClose,
  onConfirm,
  user,
  isLoading,
}) => {
  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Suspend User">
      <div className="space-y-4">
        <p className="text-(--color-body)">
          Are you sure you want to suspend <b>{user?.first_name}</b>? They will
          not be able to log in until suspended status is removed.
        </p>
        <div className="flex justify-end gap-3">
          <Button variant="outline" onClick={onClose} disabled={isLoading}>
            Cancel
          </Button>
          <Button
            onClick={onConfirm}
            className="bg-orange-600 hover:bg-orange-700 text-white"
            isLoading={isLoading}
          >
            Suspend
          </Button>
        </div>
      </div>
    </Modal>
  );
};

export default UserSuspendModal;
