import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';
import { Modal, Input, Button, SearchableSelect } from '@/components';
import { useCarModel } from '@/queries/useCarModel';
import { useBrand } from '@/queries/useBrand';
import { CarModel } from '@/interfaces';

interface ModelModalProps {
  isOpen: boolean;
  onClose: () => void;
  brandId?: string;
  initialData?: CarModel | null;
}

interface FormValues {
  name: string;
  is_active: boolean;
  brand_id?: string;
}

const ModelModal = ({
  isOpen,
  onClose,
  brandId: preSelectedBrandId,
  initialData,
}: ModelModalProps) => {
  const [brandSearch, setBrandSearch] = useState('');

  const {
    register,
    handleSubmit,
    reset,
    setValue,
    watch,
    formState: { errors },
  } = useForm<FormValues>({
    defaultValues: {
      name: '',
      is_active: true,
      brand_id: '',
    },
  });

  const {
    createCarModel,
    updateCarModel,
    createCarModelPending,
    updateCarModelPending,
  } = useCarModel();

  const { allBrandsQuery } = useBrand(null, 1, brandSearch);
  const brands = allBrandsQuery.data?.data.data || [];

  useEffect(() => {
    if (isOpen) {
      if (initialData) {
        reset({
          name: initialData.name,
          is_active: initialData.is_active,
          brand_id: initialData.brand_id,
        });
      } else {
        reset({
          name: '',
          is_active: true,
          brand_id: preSelectedBrandId || '',
        });
      }
    }
  }, [isOpen, initialData, preSelectedBrandId, reset]);

  const onSubmit = async (data: FormValues) => {
    try {
      if (initialData) {
        await updateCarModel({
          id: initialData.id,
          data: {
            name: data.name,
            is_active: data.is_active,
          },
        });
        toast.success('Model updated');
      } else {
        const finalBrandId = preSelectedBrandId || data.brand_id;

        if (!finalBrandId) {
          toast.error('Brand is required');
          return;
        }

        await createCarModel({
          brandId: finalBrandId,
          data: {
            name: data.name,
            is_active: data.is_active,
          },
        });
        toast.success('Model created');
      }
      onClose();
    } catch (error) {
      console.error(error);
    }
  };

  const isLoading = createCarModelPending || updateCarModelPending;
  const currentBrandId = watch('brand_id');

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={initialData ? 'Edit Model' : 'Create Model'}
    >
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        {!preSelectedBrandId && (
          <div>
            <SearchableSelect
              label="Brand"
              placeholder="Select Brand"
              options={brands.map((b) => ({ id: b.id, name: b.name }))}
              value={currentBrandId}
              onChange={(val) => {
                setValue('brand_id', val as string, { shouldValidate: true });
              }}
              onSearch={setBrandSearch}
              error={errors.brand_id?.message}
            />
          </div>
        )}

        <Input
          label="Model Name"
          {...register('name', { required: 'Model name is required' })}
          error={errors.name?.message}
          placeholder="e.g. Camry"
        />

        <div className="flex items-center gap-2">
          <input
            type="checkbox"
            id="is_active"
            {...register('is_active')}
            className="rounded border-gray-300 text-(--color-primary) focus:ring-(--color-primary)"
          />
          <label htmlFor="is_active" className="text-sm text-(--color-text)">
            Active
          </label>
        </div>

        <div className="flex justify-end gap-3 pt-4">
          <Button variant="outline" type="button" onClick={onClose}>
            Cancel
          </Button>
          <Button type="submit" isLoading={isLoading}>
            {initialData ? 'Update Model' : 'Create Model'}
          </Button>
        </div>
      </form>
    </Modal>
  );
};

export default ModelModal;
