import { StarIcon } from '@heroicons/react/24/outline';
import { Button, Modal } from '@/components';
import { Car } from '@/interfaces';

interface FeatureCarModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => Promise<void>;
  car: Car | null;
  isLoading?: boolean;
}

const FeatureCarModal = ({
  isOpen,
  onClose,
  onConfirm,
  car,
  isLoading,
}: FeatureCarModalProps) => {
  if (!car) return null;

  const isFeatured = car.is_featured;
  const action = isFeatured ? 'unfeature' : 'feature';
  const title = isFeatured ? 'Unfeature Car' : 'Feature Car';

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={title}>
      <div className="flex flex-col items-center text-center p-4">
        <div
          className={`p-3 rounded-full mb-4 ${isFeatured ? 'bg-amber-100 text-amber-600' : 'bg-gray-100 text-gray-600'}`}
        >
          <StarIcon className="h-8 w-8" />
        </div>

        <h3 className="text-lg font-bold text-(--color-text) mb-2">{title}</h3>

        <p className="text-(--color-body) mb-6">
          Are you sure you want to{' '}
          <span className="font-bold text-(--color-text)">{action}</span> the
          car{' '}
          <span className="font-bold text-(--color-text)">"{car.title}"</span>?
          {!isFeatured && (
            <span className="block mt-2 text-sm text-(--color-inactive)">
              This will display the car in the featured section.
            </span>
          )}
        </p>

        <div className="flex items-center gap-3 w-full">
          <Button
            variant="outline"
            onClick={onClose}
            className="flex-1 justify-center"
            disabled={isLoading}
          >
            Cancel
          </Button>
          <Button
            variant={isFeatured ? 'outline' : 'primary'}
            onClick={onConfirm}
            className={`flex-1 justify-center ${isFeatured ? 'border-amber-200 text-amber-700 hover:bg-amber-50' : ''}`}
            isLoading={isLoading}
            icon={!isLoading && <StarIcon className="h-4 w-4" />}
          >
            Yes, {action.charAt(0).toUpperCase() + action.slice(1)}
          </Button>
        </div>
      </div>
    </Modal>
  );
};

export default FeatureCarModal;
