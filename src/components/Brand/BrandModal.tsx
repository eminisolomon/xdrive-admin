import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { Modal, Input, Button } from '@/components';
import { Brand, CreateBrandRequest } from '@/interfaces/brand';
import { PhotoIcon, XMarkIcon } from '@heroicons/react/24/outline';

interface BrandModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: CreateBrandRequest) => Promise<void>;
  initialData?: Brand | null;
  isLoading?: boolean;
}

const BrandModal: React.FC<BrandModalProps> = ({
  isOpen,
  onClose,
  onSubmit,
  initialData,
  isLoading,
}) => {
  const [logoPreview, setLogoPreview] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    reset,
    setValue,
    watch,
    formState: { errors },
  } = useForm<CreateBrandRequest>({
    defaultValues: {
      name: '',
      is_active: true,
      logo: null,
    },
  });

  // Watch for logo file changes to update preview
  const logoFile = watch('logo');

  useEffect(() => {
    if (logoFile && logoFile instanceof File) {
      const objectUrl = URL.createObjectURL(logoFile);
      setLogoPreview(objectUrl);
      return () => URL.revokeObjectURL(objectUrl);
    } else if (!logoFile && initialData?.logo) {
      setLogoPreview(initialData.logo);
    } else if (!logoFile && !initialData) {
      setLogoPreview(null);
    }
  }, [logoFile, initialData]);

  useEffect(() => {
    if (initialData) {
      setValue('name', initialData.name);
      setValue('is_active', initialData.is_active);
      // We don't set the file input value directly
      setLogoPreview(initialData.logo);
    } else {
      reset({
        name: '',
        is_active: true,
        logo: null,
      });
      setLogoPreview(null);
    }
  }, [initialData, setValue, reset, isOpen]);

  const handleFormSubmit = async (data: CreateBrandRequest) => {
    await onSubmit(data);
    onClose();
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setValue('logo', e.target.files[0]);
    }
  };

  const handleRemoveLogo = () => {
    setValue('logo', null);
    if (!initialData) {
      setLogoPreview(null);
    } else {
      // If editing, reverting to null means we might keep the old one depending on backend logic,
      // but for preview purposes if they remove the *new* file, we show the old logo.
      // If they want to *delete* the logo, that might require a separate flag or API support not currently in CreateBrandRequest explicitly for "delete".
      // Assuming here they just want to clear usage of a new file.
      setLogoPreview(initialData.logo);
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={initialData ? 'Edit Brand' : 'Create New Brand'}
    >
      <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-6">
        {/* Logo Upload Section */}
        <div className="flex flex-col items-center justify-center">
          <div className="relative h-32 w-32 rounded-full border-2 border-dashed border-(--color-border) flex items-center justify-center overflow-hidden bg-(--color-surface) group">
            {logoPreview ? (
              <img
                src={logoPreview}
                alt="Logo Preview"
                className="h-full w-full object-cover"
              />
            ) : (
              <PhotoIcon className="h-10 w-10 text-(--color-inactive)" />
            )}

            <label
              htmlFor="logo-upload"
              className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer"
            >
              <span className="text-white text-xs font-medium">
                Change Logo
              </span>
            </label>
            <input
              type="file"
              id="logo-upload"
              className="hidden"
              accept="image/*"
              onChange={handleFileChange}
            />
          </div>
          {logoPreview && typeof logoFile === 'object' && logoFile !== null && (
            <button
              type="button"
              onClick={handleRemoveLogo}
              className="mt-2 text-xs text-red-500 hover:text-red-600 flex items-center gap-1"
            >
              <XMarkIcon className="h-3 w-3" /> Remove selected
            </button>
          )}
          {!logoPreview && (
            <p className="mt-2 text-xs text-(--color-body)">
              Upload brand logo
            </p>
          )}
        </div>

        <Input
          label="Brand Name"
          placeholder="e.g. BMW"
          error={errors.name?.message}
          {...register('name', { required: 'Brand name is required' })}
        />

        <div className="flex items-center gap-2">
          <input
            type="checkbox"
            id="is_active"
            className="h-4 w-4 rounded border-(--color-border) text-(--color-primary) focus:ring-(--color-primary)"
            {...register('is_active')}
          />
          <label htmlFor="is_active" className="text-sm text-(--color-text)">
            Active (Visible to users)
          </label>
        </div>

        <div className="flex justify-end gap-3 pt-4">
          <Button variant="outline" type="button" onClick={onClose}>
            Cancel
          </Button>
          <Button type="submit" isLoading={isLoading}>
            {initialData ? 'Update Brand' : 'Create Brand'}
          </Button>
        </div>
      </form>
    </Modal>
  );
};

export default BrandModal;
