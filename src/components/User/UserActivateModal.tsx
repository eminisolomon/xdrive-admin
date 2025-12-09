import React from 'react';
import { Modal, Button } from '@/components';
import { User } from '@/interfaces/users';

interface UserActivateModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  user: User | null;
  isLoading?: boolean;
}

const UserActivateModal: React.FC<UserActivateModalProps> = ({
  isOpen,
  onClose,
  onConfirm,
  user,
  isLoading,
}) => {
  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Activate User">
      <div className="space-y-4">
        <p className="text-(--color-body)">
          Are you sure you want to activate <b>{user?.first_name}</b>? They will
          regain access to the system.
        </p>
        <div className="flex justify-end gap-3">
          <Button variant="outline" onClick={onClose} disabled={isLoading}>
            Cancel
          </Button>
          <Button
            onClick={onConfirm}
            className="bg-emerald-600 hover:bg-emerald-700 text-white"
            isLoading={isLoading}
          >
            Activate
          </Button>
        </div>
      </div>
    </Modal>
  );
};

export default UserActivateModal;
