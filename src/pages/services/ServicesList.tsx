import { useState } from 'react';
import PageHeader from '@/components/PageHeader';
import {
  WrenchScrewdriverIcon,
  PlusIcon,
  PencilIcon,
  TrashIcon,
} from '@heroicons/react/24/outline';
import { useServices } from '@/queries/useServices';
import { Button, Loading } from '@/components';
import {
  ServiceModal,
  DeleteServiceModal,
  ToggleServiceStatusModal,
} from '@/components/Service';
import {
  Service,
  CreateServiceRequest,
  UpdateServiceRequest,
} from '@/interfaces/service';

const ServicesList = () => {
  const { useGetServices, createService, updateService, deleteService } =
    useServices();

  const { data: servicesResponse, isLoading: servicesLoading } =
    useGetServices();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingService, setEditingService] = useState<Service | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [deleteConfirmation, setDeleteConfirmation] = useState<{
    isOpen: boolean;
    serviceId: string | null;
  }>({
    isOpen: false,
    serviceId: null,
  });

  const [toggleConfirmation, setToggleConfirmation] = useState<{
    isOpen: boolean;
    service: Service | null;
  }>({
    isOpen: false,
    service: null,
  });

  const handleCreate = () => {
    setEditingService(null);
    setIsModalOpen(true);
  };

  const handleEdit = (service: Service) => {
    setEditingService(service);
    setIsModalOpen(true);
  };

  const confirmDelete = (id: string) => {
    setDeleteConfirmation({ isOpen: true, serviceId: id });
  };

  const handleDelete = async () => {
    if (!deleteConfirmation.serviceId) return;

    try {
      await deleteService(deleteConfirmation.serviceId);
      setDeleteConfirmation({ isOpen: false, serviceId: null });
    } catch (error) {
      console.error('Failed to delete service', error);
    }
  };

  const handleToggleActive = (service: Service) => {
    setToggleConfirmation({ isOpen: true, service: service });
  };

  const confirmToggleActive = async () => {
    if (!toggleConfirmation.service) return;

    try {
      await updateService({
        id: toggleConfirmation.service.id,
        data: { is_active: !toggleConfirmation.service.is_active },
      });
      setToggleConfirmation({ isOpen: false, service: null });
    } catch (error) {
      console.error('Failed to update service status', error);
    }
  };

  const handleSubmit = async (data: CreateServiceRequest) => {
    setIsSubmitting(true);
    try {
      if (editingService) {
        await updateService({
          id: editingService.id,
          data: data as UpdateServiceRequest,
        });
      } else {
        await createService(data);
      }
      setIsModalOpen(false);
    } catch (error) {
      console.error(error);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (servicesLoading) {
    return <Loading />;
  }

  const servicesList = servicesResponse?.data || [];
  const isEmpty = servicesList.length === 0;

  return (
    <div>
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <PageHeader
          title="Services"
          description="Manage all available services."
          icon={<WrenchScrewdriverIcon className="h-12 w-12" />}
        />
        <Button onClick={handleCreate} icon={<PlusIcon className="h-5 w-5" />}>
          Create Service
        </Button>
      </div>

      {isEmpty && !servicesLoading ? (
        <div className="text-center py-12 bg-(--color-surface) rounded-3xl border border-dashed border-(--color-border)">
          <WrenchScrewdriverIcon className="h-12 w-12 mx-auto text-(--color-inactive) mb-3" />
          <h3 className="text-lg font-medium text-(--color-text)">
            No services found
          </h3>
          <p className="text-(--color-body) mb-6">
            Get started by creating a new service.
          </p>
          <Button
            onClick={handleCreate}
            icon={<PlusIcon className="h-5 w-5" />}
          >
            Create Service
          </Button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {servicesList.map((service) => (
            <div
              key={service.id}
              className={`
                bg-(--color-surface) rounded-2xl border border-(--color-border) shadow-sm hover:shadow-md transition-all duration-200 flex flex-col
                ${!service.is_active && 'opacity-75 bg-(--color-background)/50'}
              `}
            >
              <div className="p-5 border-b border-(--color-border) flex justify-between items-start">
                <div className="h-12 w-12 rounded-xl bg-linear-to-br from-orange-100 to-amber-100 text-orange-600 flex items-center justify-center shadow-inner">
                  <WrenchScrewdriverIcon className="h-6 w-6" />
                </div>
                <span
                  className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border
                      ${
                        service.is_active
                          ? 'bg-emerald-50 text-emerald-700 border-emerald-100'
                          : 'bg-gray-50 text-gray-600 border-gray-100'
                      }
                    `}
                >
                  {service.is_active ? 'Active' : 'Inactive'}
                </span>
              </div>

              <div className="p-5 flex-1">
                <h3 className="font-bold text-lg text-(--color-text) mb-2">
                  {service.name}
                </h3>
                <p className="text-sm text-(--color-body) leading-relaxed line-clamp-3">
                  {service.description}
                </p>
              </div>

              <div className="p-4 bg-(--color-background)/30 border-t border-(--color-border) rounded-b-2xl flex justify-between items-center">
                <button
                  onClick={() => handleToggleActive(service)}
                  className={`text-xs font-medium px-3 py-1.5 rounded-lg transition-colors border
                     ${
                       service.is_active
                         ? 'text-gray-600 hover:text-gray-800 border-transparent hover:border-gray-200 hover:bg-white'
                         : 'text-emerald-600 hover:text-emerald-700 bg-emerald-50 border-emerald-100 hover:bg-emerald-100'
                     }`}
                >
                  {service.is_active ? 'Deactivate' : 'Activate'}
                </button>

                <div className="flex gap-2">
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => handleEdit(service)}
                    icon={<PencilIcon className="h-4 w-4" />}
                  >
                    Edit
                  </Button>
                  <button
                    onClick={() => confirmDelete(service.id)}
                    className="p-2 rounded-lg text-gray-400 hover:text-red-600 hover:bg-red-50 transition-colors"
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

      <ServiceModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSubmit={handleSubmit}
        initialData={editingService}
        isLoading={isSubmitting}
      />

      <DeleteServiceModal
        isOpen={deleteConfirmation.isOpen}
        onClose={() =>
          setDeleteConfirmation({ isOpen: false, serviceId: null })
        }
        onConfirm={handleDelete}
      />

      <ToggleServiceStatusModal
        isOpen={toggleConfirmation.isOpen}
        onClose={() => setToggleConfirmation({ isOpen: false, service: null })}
        onConfirm={confirmToggleActive}
        service={toggleConfirmation.service}
      />
    </div>
  );
};

export default ServicesList;
