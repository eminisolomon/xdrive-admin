import { useState } from 'react';
import { Button, Input, Modal } from '@/components';
import { RejectCarRequest } from '@/interfaces';

interface RejectCarModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: RejectCarRequest) => void;
  isLoading?: boolean;
}

export const RejectCarModal = ({
  isOpen,
  onClose,
  onSubmit,
  isLoading,
}: RejectCarModalProps) => {
  const [reason, setReason] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit({ reason });
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Reject Car">
      <form onSubmit={handleSubmit} className="space-y-4">
        <p className="text-(--color-body)">
          Please provide a reason for rejecting this car. This will be sent to
          the seller.
        </p>

        <Input
          label="Rejection Reason"
          value={reason}
          onChange={(e) => setReason(e.target.value)}
          placeholder="e.g. Invalid documents, Poor image quality..."
          required
        />

        <div className="flex justify-end gap-3 pt-2">
          <Button variant="outline" onClick={onClose} disabled={isLoading}>
            Cancel
          </Button>
          <Button
            type="submit"
            className="bg-red-600 hover:bg-red-700 text-white"
            loading={isLoading}
            disabled={!reason.trim()}
          >
            Reject Car
          </Button>
        </div>
      </form>
    </Modal>
  );
};
