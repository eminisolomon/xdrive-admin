import { useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import PageHeader from '@/components/PageHeader';
import {
  CubeIcon,
  PlusIcon,
  PencilIcon,
  TrashIcon,
  CheckCircleIcon,
  XCircleIcon,
} from '@heroicons/react/24/outline';
import { useCarModel } from '@/queries';
import { Button, Loading, Pagination, Input } from '@/components';
import { ModelModal, DeleteModelModal } from '@/components';
import { CarModel } from '@/interfaces';

const Models = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const page = parseInt(searchParams.get('page') || '1', 10);
  const [searchQuery, setSearchQuery] = useState('');

  const { useGetAllCarModels, updateCarModel, deleteCarModel } = useCarModel();

  const { data: allModelsResponse, isLoading: allModelsLoading } =
    useGetAllCarModels(page, searchQuery);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingModel, setEditingModel] = useState<CarModel | null>(null);

  const [deleteConfirmation, setDeleteConfirmation] = useState<{
    isOpen: boolean;
    modelId: string | null;
  }>({
    isOpen: false,
    modelId: null,
  });

  const handleCreate = () => {
    setEditingModel(null);
    setIsModalOpen(true);
  };

  const handleEdit = (model: CarModel) => {
    setEditingModel(model);
    setIsModalOpen(true);
  };

  const confirmDelete = (id: string) => {
    setDeleteConfirmation({ isOpen: true, modelId: id });
  };

  const handleDelete = async () => {
    if (!deleteConfirmation.modelId) return;

    try {
      await deleteCarModel(deleteConfirmation.modelId);
      setDeleteConfirmation({ isOpen: false, modelId: null });
    } catch (error) {
      console.error('Failed to delete model', error);
    }
  };

  const handleToggleActive = async (model: CarModel) => {
    try {
      await updateCarModel({
        id: model.id,
        data: { is_active: !model.is_active },
      });
    } catch (error) {
      console.error('Failed to update model status', error);
    }
  };

  const handlePageChange = (newPage: number) => {
    setSearchParams({ page: newPage.toString() });
  };

  if (allModelsLoading) {
    return <Loading />;
  }

  const modelsList = allModelsResponse?.data?.data || [];
  const pagination = allModelsResponse?.data?.pagination;
  const isEmpty = modelsList.length === 0;

  return (
    <div>
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <PageHeader
          title="Vehicle Models"
          description="Manage vehicle models across all brands."
          icon={<CubeIcon className="h-12 w-12" />}
        />
        <div className="flex flex-col sm:flex-row gap-3 w-full sm:w-auto">
          <div className="w-full sm:w-64">
            <Input
              placeholder="Search models..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          <Button
            onClick={handleCreate}
            icon={<PlusIcon className="h-5 w-5" />}
          >
            Create Model
          </Button>
        </div>
      </div>

      {isEmpty && !allModelsLoading ? (
        <div className="text-center py-12 bg-(--color-surface) rounded-3xl border border-dashed border-(--color-border)">
          <CubeIcon className="h-12 w-12 mx-auto text-(--color-inactive) mb-3" />
          <h3 className="text-lg font-medium text-(--color-text)">
            No models found
          </h3>
          <p className="text-(--color-body) mb-6">
            Get started by creating a new vehicle model.
          </p>
          <Button
            onClick={handleCreate}
            icon={<PlusIcon className="h-5 w-5" />}
          >
            Create Model
          </Button>
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {modelsList.map((model) => (
              <div
                key={model.id}
                className={`
                  relative bg-(--color-surface) rounded-2xl border transition-all duration-200 flex flex-col
                  ${
                    model.is_active
                      ? 'border-(--color-border) shadow-sm hover:shadow-md'
                      : 'border-(--color-border) opacity-75 bg-(--color-background)/50'
                  }
                `}
              >
                {/* Status Badge */}
                <div className="absolute top-4 right-4">
                  <span
                    className={`
                      px-2.5 py-1 rounded-full text-xs font-medium border flex items-center gap-1
                      ${
                        model.is_active
                          ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                          : 'bg-gray-50 text-gray-600 border-gray-200'
                      }
                    `}
                  >
                    {model.is_active ? (
                      <>
                        <CheckCircleIcon className="h-3 w-3" />
                        Active
                      </>
                    ) : (
                      <>
                        <XCircleIcon className="h-3 w-3" />
                        Inactive
                      </>
                    )}
                  </span>
                </div>

                <div className="p-6 flex-1 flex flex-col items-center text-center mt-4">
                  {/* Icon/Initial */}
                  <div className="mb-4">
                    <div className="h-20 w-20 rounded-xl border border-gray-100 shadow-sm bg-indigo-50 text-indigo-600 flex items-center justify-center">
                      <span className="text-3xl font-bold">
                        {model.name.charAt(0)}
                      </span>
                    </div>
                  </div>

                  {/* Name */}
                  <h3 className="font-bold text-lg text-(--color-text) mb-1 truncate w-full">
                    {model.name}
                  </h3>

                  {/* Brand Hint (if available in future) */}
                  {/* <p className="text-xs text-gray-500">{model.brand?.name}</p> */}
                </div>

                {/* Actions */}
                <div className="p-4 border-t border-(--color-border) space-y-2">
                  <div className="grid grid-cols-2 gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      className="justify-center"
                      onClick={() => handleEdit(model)}
                      icon={<PencilIcon className="h-4 w-4" />}
                    >
                      Edit
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      className={`justify-center ${
                        model.is_active
                          ? 'text-gray-600 hover:bg-gray-50 border-gray-200'
                          : 'text-emerald-600 hover:bg-emerald-50 border-emerald-200'
                      }`}
                      onClick={() => handleToggleActive(model)}
                      icon={
                        model.is_active ? (
                          <XCircleIcon className="h-4 w-4" />
                        ) : (
                          <CheckCircleIcon className="h-4 w-4" />
                        )
                      }
                    >
                      {model.is_active ? 'Disable' : 'Enable'}
                    </Button>
                  </div>

                  <Button
                    variant="outline"
                    size="sm"
                    className="w-full justify-center text-red-600 hover:bg-red-50 border-red-200 hover:border-red-300"
                    onClick={() => confirmDelete(model.id)}
                    icon={<TrashIcon className="h-4 w-4" />}
                  >
                    Delete Model
                  </Button>
                </div>
              </div>
            ))}
          </div>

          {pagination && (
            <Pagination
              pagination={pagination}
              onPageChange={handlePageChange}
            />
          )}
        </>
      )}

      <ModelModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        initialData={editingModel}
      />

      <DeleteModelModal
        isOpen={deleteConfirmation.isOpen}
        onClose={() => setDeleteConfirmation({ isOpen: false, modelId: null })}
        onConfirm={handleDelete}
      />
    </div>
  );
};

export default Models;
