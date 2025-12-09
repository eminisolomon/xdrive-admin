import { useState } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import {
  BuildingStorefrontIcon,
  TrashIcon,
  EyeIcon,
  CheckCircleIcon,
  XCircleIcon,
  StarIcon,
  FunnelIcon,
} from '@heroicons/react/24/outline';
import { StarIcon as StarIconSolid } from '@heroicons/react/24/solid';
import { useCars } from '@/queries/useCars';
import {
  Button,
  Loading,
  Pagination,
  Input,
  DeleteCarModal,
  RejectCarModal,
  FeatureCarModal,
} from '@/components';
import { Car } from '@/interfaces';
import { formatCurrency } from '@/shared/formatters';
import PageHeader from '@/components/PageHeader';

const Cars = () => {
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const page = parseInt(searchParams.get('page') || '1', 10);
  const statusParam = searchParams.get('status') || 'all';
  const searchParam = searchParams.get('search') || '';

  const {
    useGetCars,
    deleteCar,
    approveCar,
    rejectCar,
    featureCar,
    unfeatureCar,
    featureCarPending,
    unfeatureCarPending,
  } = useCars();

  const { data: carsData, isLoading: carsLoading } = useGetCars(
    page,
    statusParam === 'all' ? undefined : statusParam,
    searchParam,
  );

  const [search, setSearch] = useState(searchParam);
  const [activeTab, setActiveTab] = useState(statusParam);

  const [deleteConfirmation, setDeleteConfirmation] = useState<{
    isOpen: boolean;
    carId: string | null;
  }>({
    isOpen: false,
    carId: null,
  });

  const [rejectModal, setRejectModal] = useState<{
    isOpen: boolean;
    carId: string | null;
  }>({
    isOpen: false,
    carId: null,
  });

  const [featureConfirmation, setFeatureConfirmation] = useState<{
    isOpen: boolean;
    car: Car | null;
  }>({
    isOpen: false,
    car: null,
  });

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setSearchParams({ page: '1', status: activeTab, search });
  };

  const handleTabChange = (tab: string) => {
    setActiveTab(tab);
    setSearchParams({ page: '1', status: tab, search });
  };

  const handlePageChange = (newPage: number) => {
    setSearchParams({ page: newPage.toString(), status: activeTab, search });
  };

  const handleDelete = async () => {
    if (!deleteConfirmation.carId) return;
    try {
      await deleteCar(deleteConfirmation.carId);
      setDeleteConfirmation({ isOpen: false, carId: null });
    } catch (error) {
      console.error('Failed to delete car', error);
    }
  };

  const handleReject = async (data: { reason: string }) => {
    if (!rejectModal.carId) return;
    try {
      await rejectCar({ id: rejectModal.carId, data });
      setRejectModal({ isOpen: false, carId: null });
    } catch (error) {
      console.error('Failed to reject car', error);
    }
  };

  const handleApprove = async (id: string) => {
    try {
      await approveCar(id);
    } catch (error) {
      console.error('Failed to approve car', error);
    }
  };

  const handleToggleFeature = async () => {
    const car = featureConfirmation.car;
    if (!car) return;
    try {
      if (car.is_featured) {
        await unfeatureCar(car.id);
      } else {
        await featureCar(car.id);
      }
      setFeatureConfirmation({ isOpen: false, car: null });
    } catch (error) {
      console.error('Failed to toggle feature status', error);
    }
  };

  if (carsLoading) {
    return <Loading />;
  }

  const carsList = carsData?.data?.data || [];
  const pagination = carsData?.data?.pagination;
  const isEmpty = carsList.length === 0;

  const tabs = [
    { id: 'all', label: 'All Cars' },
    { id: 'pending', label: 'Pending Approval' },
    { id: 'active', label: 'Active' },
    { id: 'sold', label: 'Sold' },
    { id: 'rejected', label: 'Rejected' },
    { id: 'flagged', label: 'Flagged' },
  ];

  return (
    <div>
      <div className="flex flex-col gap-6 mb-6">
        <PageHeader
          title="Cars"
          description="Manage listed cars, approve pending listings, and moderate content."
          icon={<BuildingStorefrontIcon className="h-12 w-12" />}
        />

        <div className="flex flex-col md:flex-row justify-between items-center gap-4 bg-(--color-surface) p-2 rounded-xl border border-(--color-border)">
          <div className="flex overflow-x-auto no-scrollbar w-full md:w-auto gap-1">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => handleTabChange(tab.id)}
                className={`
                  px-4 py-2 rounded-lg text-sm font-medium whitespace-nowrap transition-all
                  ${
                    activeTab === tab.id
                      ? 'bg-(--color-primary) text-white shadow-md'
                      : 'text-(--color-body) hover:bg-(--color-background) hover:text-(--color-text)'
                  }
                `}
              >
                {tab.label}
              </button>
            ))}
          </div>

          <form onSubmit={handleSearch} className="flex gap-2 w-full md:w-auto">
            <div className="w-full md:w-64">
              <Input
                placeholder="Search cars..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="h-10"
              />
            </div>
            <Button
              type="submit"
              variant="outline"
              icon={<FunnelIcon className="h-5 w-5" />}
            >
              Filter
            </Button>
          </form>
        </div>
      </div>

      {isEmpty ? (
        <div className="text-center py-12 bg-(--color-surface) rounded-3xl border border-dashed border-(--color-border)">
          <BuildingStorefrontIcon className="h-12 w-12 mx-auto text-(--color-inactive) mb-3" />
          <h3 className="text-lg font-medium text-(--color-text)">
            No cars found
          </h3>
          <p className="text-(--color-body)">
            Try adjusting your search or filters.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {carsList.map((car) => (
            <div
              key={car.id}
              className="group relative bg-(--color-surface) rounded-2xl border border-(--color-border) overflow-hidden hover:shadow-md transition-all duration-300"
            >
              <div className="relative h-48 bg-gray-100 dark:bg-gray-800">
                {car.primary_image ? (
                  <img
                    src={car.primary_image.image_url}
                    alt={car.title}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-gray-400">
                    <BuildingStorefrontIcon className="h-12 w-12" />
                  </div>
                )}

                <div className="absolute top-3 left-3 flex flex-col gap-2">
                  <span
                    className={`px-2.5 py-1 rounded-full text-xs font-medium border shadow-sm backdrop-blur-md
                      ${
                        car.status === 'active'
                          ? 'bg-emerald-500/90 text-white border-emerald-400'
                          : car.status === 'pending'
                            ? 'bg-amber-500/90 text-white border-amber-400'
                            : car.status === 'sold'
                              ? 'bg-blue-500/90 text-white border-blue-400'
                              : car.status === 'rejected'
                                ? 'bg-red-500/90 text-white border-red-400'
                                : 'bg-gray-500/90 text-white border-gray-400'
                      }
                    `}
                  >
                    {car.status.charAt(0).toUpperCase() + car.status.slice(1)}
                  </span>
                </div>

                <div className="absolute top-3 right-3">
                  <button
                    onClick={() =>
                      setFeatureConfirmation({ isOpen: true, car })
                    }
                    className={`p-2 rounded-full transition-all duration-200 shadow-sm backdrop-blur-md ${
                      car.is_featured
                        ? 'bg-yellow-400 text-white hover:bg-yellow-500'
                        : 'bg-white/50 text-gray-400 hover:bg-white hover:text-yellow-400'
                    }`}
                    title={car.is_featured ? 'Unfeature' : 'Feature'}
                  >
                    {car.is_featured ? (
                      <StarIconSolid className="h-5 w-5" />
                    ) : (
                      <StarIcon className="h-5 w-5" />
                    )}
                  </button>
                </div>
              </div>

              <div className="p-4">
                <div className="mb-3">
                  <div className="text-xs text-(--color-body) mb-1 flex items-center gap-1">
                    <span>{car.year_of_manufacture}</span>
                    <span>•</span>
                    <span>{car.mileage} km</span>
                  </div>
                  <h3
                    className="font-bold text-(--color-text) line-clamp-1"
                    title={car.title}
                  >
                    {car.title}
                  </h3>
                  <div className="text-lg font-bold text-(--color-primary) mt-1">
                    {formatCurrency(parseFloat(car.price))}
                  </div>
                </div>

                <div className="flex items-center gap-2 mb-1 p-2 rounded-lg bg-(--color-background)/50">
                  <div className="h-8 w-8 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-600 text-xs font-bold">
                    {car.user?.first_name?.charAt(0) || 'U'}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-(--color-text) truncate">
                      {car.user?.first_name} {car.user?.last_name}
                    </p>
                    <p className="text-xs text-(--color-body) truncate">
                      {car.user?.email}
                    </p>
                  </div>
                </div>
              </div>

              {/* Actions */}
              <div className="p-4 border-t border-(--color-border) space-y-2">
                {car.status === 'pending' && (
                  <div className="grid grid-cols-2 gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      className="justify-center text-emerald-600 hover:bg-emerald-50 border-emerald-200"
                      onClick={() => handleApprove(car.id)}
                      icon={<CheckCircleIcon className="h-4 w-4" />}
                    >
                      Approve
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      className="justify-center text-red-600 hover:bg-red-50 border-red-200"
                      onClick={() =>
                        setRejectModal({ isOpen: true, carId: car.id })
                      }
                      icon={<XCircleIcon className="h-4 w-4" />}
                    >
                      Reject
                    </Button>
                  </div>
                )}

                <div className="grid grid-cols-2 gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    className="justify-center text-(--color-body) hover:text-(--color-primary)"
                    onClick={() => navigate(`/vehicles/cars/${car.id}`)}
                    icon={<EyeIcon className="h-4 w-4" />}
                  >
                    View
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    className="justify-center text-red-600 hover:bg-red-50 border-red-200 hover:border-red-300"
                    onClick={() =>
                      setDeleteConfirmation({ isOpen: true, carId: car.id })
                    }
                    icon={<TrashIcon className="h-4 w-4" />}
                  >
                    Delete
                  </Button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {pagination && (
        <Pagination pagination={pagination} onPageChange={handlePageChange} />
      )}

      <DeleteCarModal
        isOpen={deleteConfirmation.isOpen}
        onClose={() => setDeleteConfirmation({ isOpen: false, carId: null })}
        onConfirm={handleDelete}
      />

      <RejectCarModal
        isOpen={rejectModal.isOpen}
        onClose={() => setRejectModal({ isOpen: false, carId: null })}
        onSubmit={handleReject}
      />

      <FeatureCarModal
        isOpen={featureConfirmation.isOpen}
        onClose={() => setFeatureConfirmation({ isOpen: false, car: null })}
        onConfirm={handleToggleFeature}
        car={featureConfirmation.car}
        isLoading={featureCarPending || unfeatureCarPending}
      />
    </div>
  );
};

export default Cars;
