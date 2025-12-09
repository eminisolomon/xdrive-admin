import { useState } from 'react';
import PageHeader from '@/components/PageHeader';
import {
  BuildingStorefrontIcon,
  PlusIcon,
  PencilIcon,
  TrashIcon,
} from '@heroicons/react/24/outline';
import { useBodyType } from '@/queries/useBodyType';
import { Button, Loading } from '@/components';
import { BodyTypeModal, DeleteBodyTypeModal } from '@/components/BodyType';
import {
  BodyType,
  CreateBodyTypeRequest,
  UpdateBodyTypeRequest,
} from '@/interfaces';

const BodyTypes = () => {
  const { useGetBodyTypes, createBodyType, updateBodyType, deleteBodyType } =
    useBodyType();

  const { data: bodyTypesResponse, isLoading: bodyTypesLoading } =
    useGetBodyTypes();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingBodyType, setEditingBodyType] = useState<BodyType | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [deleteConfirmation, setDeleteConfirmation] = useState<{
    isOpen: boolean;
    bodyTypeId: string | null;
  }>({
    isOpen: false,
    bodyTypeId: null,
  });

  const handleCreate = () => {
    setEditingBodyType(null);
    setIsModalOpen(true);
  };

  const handleEdit = (bodyType: BodyType) => {
    setEditingBodyType(bodyType);
    setIsModalOpen(true);
  };

  const confirmDelete = (id: string) => {
    setDeleteConfirmation({ isOpen: true, bodyTypeId: id });
  };

  const handleDelete = async () => {
    if (!deleteConfirmation.bodyTypeId) return;

    try {
      await deleteBodyType(deleteConfirmation.bodyTypeId);
      setDeleteConfirmation({ isOpen: false, bodyTypeId: null });
    } catch (error) {
      console.error('Failed to delete body type', error);
    }
  };

  const handleToggleActive = async (bodyType: BodyType) => {
    try {
      await updateBodyType({
        id: bodyType.id,
        data: { is_active: !bodyType.is_active },
      });
    } catch (error) {
      console.error('Failed to update body type status', error);
    }
  };

  const handleSubmit = async (data: CreateBodyTypeRequest) => {
    setIsSubmitting(true);
    try {
      if (editingBodyType) {
        await updateBodyType({
          id: editingBodyType.id,
          data: data as UpdateBodyTypeRequest,
        });
      } else {
        await createBodyType(data);
      }
      setIsModalOpen(false);
    } catch (error) {
      console.error(error);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (bodyTypesLoading) {
    return <Loading />;
  }

  // Assuming the API returns array in data property based on previous check
  const bodyTypesList = bodyTypesResponse?.data || [];
  const isEmpty = bodyTypesList.length === 0;

  return (
    <div>
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <PageHeader
          title="Vehicle Body Types"
          description="Manage vehicle body types and their operations."
          icon={<BuildingStorefrontIcon className="h-12 w-12" />}
        />
        <Button onClick={handleCreate} icon={<PlusIcon className="h-5 w-5" />}>
          Create Body Type
        </Button>
      </div>

      {isEmpty && !bodyTypesLoading ? (
        <div className="text-center py-12 bg-(--color-surface) rounded-3xl border border-dashed border-(--color-border)">
          <BuildingStorefrontIcon className="h-12 w-12 mx-auto text-(--color-inactive) mb-3" />
          <h3 className="text-lg font-medium text-(--color-text)">
            No body types found
          </h3>
          <p className="text-(--color-body) mb-6">
            Get started by creating a new body type.
          </p>
          <Button
            onClick={handleCreate}
            icon={<PlusIcon className="h-5 w-5" />}
          >
            Create Body Type
          </Button>
        </div>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
          {bodyTypesList.map((bodyType) => (
            <div
              key={bodyType.id}
              className={`
                relative bg-(--color-surface) rounded-2xl border transition-all duration-200 group
                ${
                  bodyType.is_active
                    ? 'border-(--color-border) shadow-sm hover:shadow-md'
                    : 'border-(--color-border) opacity-75 bg-(--color-background)/50'
                }
                `}
            >
              {/* Status Indicator */}
              <div
                className={`absolute top-3 right-3 h-2.5 w-2.5 rounded-full ${bodyType.is_active ? 'bg-emerald-500' : 'bg-gray-300'}`}
                title={bodyType.is_active ? 'Active' : 'Inactive'}
              />

              <div className="p-6 flex flex-col items-center text-center">
                <div className="h-16 w-16 mb-4 flex items-center justify-center p-2 rounded-full bg-blue-50 text-blue-600">
                  <span className="text-2xl font-bold">
                    {bodyType.name.charAt(0)}
                  </span>
                </div>

                <h3 className="font-bold text-(--color-text) mb-1 truncate w-full">
                  {bodyType.name}
                </h3>
              </div>

              <div className="border-t border-(--color-border) p-3 flex justify-between items-center bg-(--color-background)/30 rounded-b-2xl">
                <button
                  onClick={() => handleToggleActive(bodyType)}
                  className={`text-xs font-medium px-2 py-1 rounded transition-colors ${bodyType.is_active ? 'text-gray-500 hover:text-gray-700' : 'text-emerald-600 hover:text-emerald-700 bg-emerald-50'}`}
                >
                  {bodyType.is_active ? 'Deactivate' : 'Activate'}
                </button>

                <div className="flex gap-1">
                  <button
                    onClick={() => handleEdit(bodyType)}
                    className="p-1.5 rounded-lg text-(--color-body) hover:bg-(--color-hover) hover:text-(--color-primary) transition-colors"
                    title="Edit"
                  >
                    <PencilIcon className="h-4 w-4" />
                  </button>
                  <button
                    onClick={() => confirmDelete(bodyType.id)}
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
      )}

      <BodyTypeModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSubmit={handleSubmit}
        initialData={editingBodyType}
        isLoading={isSubmitting}
      />

      <DeleteBodyTypeModal
        isOpen={deleteConfirmation.isOpen}
        onClose={() =>
          setDeleteConfirmation({ isOpen: false, bodyTypeId: null })
        }
        onConfirm={handleDelete}
      />
    </div>
  );
};

export default BodyTypes;
