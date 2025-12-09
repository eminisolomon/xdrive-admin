import { Modal, Button } from '@/components';
import { Brand } from '@/interfaces/brand';

interface BrandModelsModalProps {
  isOpen: boolean;
  onClose: () => void;
  brand: Brand | null;
}

const BrandModelsModal: React.FC<BrandModelsModalProps> = ({
  isOpen,
  onClose,
  brand,
}) => {
  if (!brand) return null;

  const models = brand.car_models || [];

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={`${brand.name} Models`}>
      <div className="space-y-4">
        {models.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 max-h-[60vh] overflow-y-auto pr-2">
            {models.map((model) => (
              <div
                key={model.id}
                className="p-3 bg-(--color-background) rounded-lg border border-(--color-border) flex items-center justify-between"
              >
                <span className="font-medium text-(--color-text)">
                  {model.name}
                </span>
                {/* Future: Add edit/delete for models here if needed */}
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-6 text-(--color-body)">
            <p>No models found for this brand.</p>
          </div>
        )}

        <div className="flex justify-end pt-2">
          <Button variant="outline" onClick={onClose}>
            Close
          </Button>
        </div>
      </div>
    </Modal>
  );
};

export default BrandModelsModal;
