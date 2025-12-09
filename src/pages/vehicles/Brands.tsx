import { useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import PageHeader from '@/components/PageHeader';
import {
  BuildingStorefrontIcon,
  PlusIcon,
  PencilIcon,
  TrashIcon,
  EyeIcon,
} from '@heroicons/react/24/outline';
import { useBrand } from '@/queries/useBrand';
import { Button, Loading, Pagination, Modal } from '@/components';
import { BrandModal, BrandModelsModal } from '@/components/Brand';
import {
  Brand,
  CreateBrandRequest,
  UpdateBrandRequest,
} from '@/interfaces/brand';
import { toast } from 'sonner';

const Brands = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const page = parseInt(searchParams.get('page') || '1', 10);

  const { allBrandsQuery, createBrand, updateBrand, deleteBrand } = useBrand(
    null,
    page,
  );

  const { data: allBrands, isLoading: allBrandsLoading } = allBrandsQuery;

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingBrand, setEditingBrand] = useState<Brand | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // View Models state
  const [viewingBrandModels, setViewingBrandModels] = useState<Brand | null>(
    null,
  );

  // Delete confirmation state
  const [deleteConfirmation, setDeleteConfirmation] = useState<{
    isOpen: boolean;
    brandId: string | null;
  }>({
    isOpen: false,
    brandId: null,
  });

  const handleCreate = () => {
    setEditingBrand(null);
    setIsModalOpen(true);
  };

  const handleEdit = (brand: Brand) => {
    setEditingBrand(brand);
    setIsModalOpen(true);
  };

  const handleViewModels = (brand: Brand) => {
    setViewingBrandModels(brand);
  };

  const confirmDelete = (id: string) => {
    setDeleteConfirmation({ isOpen: true, brandId: id });
  };

  const handleDelete = async () => {
    if (!deleteConfirmation.brandId) return;

    try {
      await deleteBrand(deleteConfirmation.brandId);
      setDeleteConfirmation({ isOpen: false, brandId: null });
    } catch (error) {
      console.error('Failed to delete brand', error);
      toast.error('Failed to delete brand');
    }
  };

  const handleToggleActive = async (brand: Brand) => {
    try {
      await updateBrand({
        id: brand.id,
        data: { is_active: !brand.is_active },
      });
    } catch (error) {
      console.error('Failed to update brand status', error);
      toast.error('Failed to update brand status');
    }
  };

  const handlePageChange = (newPage: number) => {
    setSearchParams({ page: newPage.toString() });
  };

  const handleSubmit = async (data: CreateBrandRequest) => {
    setIsSubmitting(true);
    try {
      if (editingBrand) {
        await updateBrand({
          id: editingBrand.id,
          data: data as UpdateBrandRequest,
        });
      } else {
        await createBrand(data);
      }
      setIsModalOpen(false);
    } catch (error) {
      console.error(error);
      toast.error('Failed to save brand');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (allBrandsLoading) {
    return <Loading />;
  }

  // Check if brands exist
  const brandsList = allBrands?.data?.data || [];
  const pagination = allBrands?.data?.pagination;
  const isEmpty = brandsList.length === 0;

  return (
    <div>
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <PageHeader
          title="Vehicle Brands"
          description="Manage vehicle brands and their operations."
          icon={<BuildingStorefrontIcon className="h-12 w-12" />}
        />
        <Button onClick={handleCreate} icon={<PlusIcon className="h-5 w-5" />}>
          Create Brand
        </Button>
      </div>

      {isEmpty && !allBrandsLoading ? (
        <div className="text-center py-12 bg-(--color-surface) rounded-3xl border border-dashed border-(--color-border)">
          <BuildingStorefrontIcon className="h-12 w-12 mx-auto text-(--color-inactive) mb-3" />
          <h3 className="text-lg font-medium text-(--color-text)">
            No brands found
          </h3>
          <p className="text-(--color-body) mb-6">
            Get started by creating a new vehicle brand.
          </p>
          <Button
            onClick={handleCreate}
            icon={<PlusIcon className="h-5 w-5" />}
          >
            Create Brand
          </Button>
        </div>
      ) : (
        <>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
            {brandsList.map((brand) => (
              <div
                key={brand.id}
                className={`
                    relative bg-(--color-surface) rounded-2xl border transition-all duration-200 group
                    ${
                      brand.is_active
                        ? 'border-(--color-border) shadow-sm hover:shadow-md'
                        : 'border-(--color-border) opacity-75 bg-(--color-background)/50'
                    }
                    `}
              >
                {/* Status Indicator */}
                <div
                  className={`absolute top-3 right-3 h-2.5 w-2.5 rounded-full ${brand.is_active ? 'bg-emerald-500' : 'bg-gray-300'}`}
                  title={brand.is_active ? 'Active' : 'Inactive'}
                />

                <div className="p-6 flex flex-col items-center text-center">
                  <div className="h-20 w-20 mb-4 flex items-center justify-center p-2 rounded-xl bg-white shadow-sm border border-gray-100">
                    {brand.logo ? (
                      <img
                        src={brand.logo}
                        alt={brand.name}
                        className="max-h-full max-w-full object-contain"
                      />
                    ) : (
                      <BuildingStorefrontIcon className="h-10 w-10 text-gray-300" />
                    )}
                  </div>

                  <h3 className="font-bold text-(--color-text) mb-1 truncate w-full">
                    {brand.name}
                  </h3>

                  <div className="flex items-center gap-1 mt-1">
                    <p className="text-xs text-(--color-body)">
                      {brand.car_models?.length || 0} Models
                    </p>
                    <button
                      onClick={() => handleViewModels(brand)}
                      className="text-xs text-(--color-primary) hover:underline flex items-center gap-0.5 ml-1"
                    >
                      <EyeIcon className="h-3 w-3" /> View
                    </button>
                  </div>
                </div>

                <div className="border-t border-(--color-border) p-3 flex justify-between items-center bg-(--color-background)/30 rounded-b-2xl">
                  <button
                    onClick={() => handleToggleActive(brand)}
                    className={`text-xs font-medium px-2 py-1 rounded transition-colors ${brand.is_active ? 'text-gray-500 hover:text-gray-700' : 'text-emerald-600 hover:text-emerald-700 bg-emerald-50'}`}
                  >
                    {brand.is_active ? 'Deactivate' : 'Activate'}
                  </button>

                  <div className="flex gap-1">
                    <button
                      onClick={() => handleEdit(brand)}
                      className="p-1.5 rounded-lg text-(--color-body) hover:bg-(--color-hover) hover:text-(--color-primary) transition-colors"
                      title="Edit"
                    >
                      <PencilIcon className="h-4 w-4" />
                    </button>
                    <button
                      onClick={() => confirmDelete(brand.id)}
                      className="p-1.5 rounded-lg text-(--color-body) hover:bg-(--color-hover) hover:text-(--color-error) transition-colors"
                      title="Delete"
                    >
                      <TrashIcon className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Pagination Controls */}
          {pagination && (
            <Pagination
              pagination={pagination}
              onPageChange={handlePageChange}
            />
          )}
        </>
      )}

      <BrandModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSubmit={handleSubmit}
        initialData={editingBrand}
        isLoading={isSubmitting}
      />

      <BrandModelsModal
        isOpen={!!viewingBrandModels}
        onClose={() => setViewingBrandModels(null)}
        brand={viewingBrandModels}
      />

      {/* Delete Confirmation Modal */}
      <Modal
        isOpen={deleteConfirmation.isOpen}
        onClose={() => setDeleteConfirmation({ isOpen: false, brandId: null })}
        title="Delete Brand"
      >
        <div className="space-y-4">
          <p className="text-(--color-body)">
            Are you sure you want to delete this brand? This action cannot be
            undone.
          </p>
          <div className="flex justify-end gap-3">
            <Button
              variant="outline"
              onClick={() =>
                setDeleteConfirmation({ isOpen: false, brandId: null })
              }
            >
              Cancel
            </Button>
            <Button
              onClick={handleDelete}
              className="bg-red-600 hover:bg-red-700 text-white"
            >
              Delete
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default Brands;
