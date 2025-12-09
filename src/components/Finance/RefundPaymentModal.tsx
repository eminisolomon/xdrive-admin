import React from 'react';
import { Modal, Button } from '@/components';
import { Payment } from '@/interfaces';

interface RefundPaymentModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  payment: Payment | null;
  isLoading?: boolean;
}

const RefundPaymentModal: React.FC<RefundPaymentModalProps> = ({
  isOpen,
  onClose,
  onConfirm,
  payment,
  isLoading,
}) => {
  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Refund Payment">
      <div className="space-y-4">
        <p className="text-(--color-body)">
          Are you sure you want to refund this payment of{' '}
          <b>
            {payment?.amount} {payment?.currency}
          </b>
          ? This action cannot be undone.
        </p>
        <div className="flex justify-end gap-3">
          <Button variant="outline" onClick={onClose} disabled={isLoading}>
            Cancel
          </Button>
          <Button
            onClick={onConfirm}
            className="bg-red-600 hover:bg-red-700 text-white"
            isLoading={isLoading}
          >
            Confirm Refund
          </Button>
        </div>
      </div>
    </Modal>
  );
};

export default RefundPaymentModal;
