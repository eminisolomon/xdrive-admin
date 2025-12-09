import { Button, Modal } from '@/components';

interface CancelSubscriptionModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  isLoading?: boolean;
}

export const CancelSubscriptionModal = ({
  isOpen,
  onClose,
  onConfirm,
  isLoading,
}: CancelSubscriptionModalProps) => {
  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Cancel Subscription">
      <div className="space-y-4">
        <p className="text-(--color-body)">
          Are you sure you want to cancel this subscription? The user will lose
          access at the end of the current period.
        </p>
        <div className="flex justify-end gap-3">
          <Button variant="outline" onClick={onClose} disabled={isLoading}>
            Keep it
          </Button>
          <Button
            onClick={onConfirm}
            className="bg-red-600 hover:bg-red-700 text-white"
            loading={isLoading}
          >
            Cancel Subscription
          </Button>
        </div>
      </div>
    </Modal>
  );
};
