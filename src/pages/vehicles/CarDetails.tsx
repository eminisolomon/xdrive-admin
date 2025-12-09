import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  ArrowLeftIcon,
  CalendarIcon,
  MapPinIcon,
  CheckCircleIcon,
  XCircleIcon,
  TrashIcon,
  StarIcon,
  PhoneIcon,
  UserIcon,
} from '@heroicons/react/24/outline';
import { StarIcon as StarIconSolid } from '@heroicons/react/24/solid';
import { useCars } from '@/queries/useCars';
import {
  Button,
  Loading,
  DeleteCarModal,
  RejectCarModal,
  FeatureCarModal,
} from '@/components';
import { formatCurrency } from '@/shared/formatters';

const CarDetails = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const {
    useGetCar,
    deleteCar,
    approveCar,
    rejectCar,
    featureCar,
    unfeatureCar,
    featureCarPending,
    unfeatureCarPending,
  } = useCars();

  const { data: carResponse, isLoading } = useGetCar(id || '');
  const car = carResponse?.data;

  const [deleteConfirmation, setDeleteConfirmation] = useState(false);
  const [rejectModal, setRejectModal] = useState(false);
  const [featureModal, setFeatureModal] = useState(false);
  const [activeImageIndex, setActiveImageIndex] = useState(0);

  if (isLoading) return <Loading />;
  if (!car) return <div>Car not found</div>;

  const allImages = [
    ...(car.primary_image ? [car.primary_image] : []),
    ...(car.images || []),
  ].filter(
    (img, index, self) => index === self.findIndex((t) => t.id === img.id),
  );

  const images = allImages.length > 0 ? allImages : [];

  const handleDelete = async () => {
    if (!id) return;
    try {
      await deleteCar(id);
      navigate('/vehicles/cars');
    } catch (error) {
      console.error('Failed to delete car', error);
    }
  };

  const handleReject = async (data: { reason: string }) => {
    if (!id) return;
    try {
      await rejectCar({ id, data });
      setRejectModal(false);
    } catch (error) {
      console.error('Failed to reject car', error);
    }
  };

  const handleApprove = async () => {
    if (!id) return;
    try {
      await approveCar(id);
    } catch (error) {
      console.error('Failed to approve car', error);
    }
  };

  const handleToggleFeature = async () => {
    if (!id) return;
    try {
      if (car.is_featured) {
        await unfeatureCar(id);
      } else {
        await featureCar(id);
      }
      setFeatureModal(false);
    } catch (error) {
      console.error('Failed to toggle feature', error);
    }
  };

  const getKeyFeatures = () => {
    try {
      return JSON.parse(car.key_features || '[]');
    } catch {
      return [];
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <button
          onClick={() => navigate(-1)}
          className="p-2 rounded-lg hover:bg-(--color-background) text-(--color-body) hover:text-(--color-text) transition-colors"
        >
          <ArrowLeftIcon className="h-6 w-6" />
        </button>
        <div>
          <h1 className="text-2xl font-bold text-(--color-text)">
            Car Details
          </h1>
          <p className="text-(--color-body)">View and manage car listing</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column: Images & Specs */}
        <div className="lg:col-span-2 space-y-6">
          {/* Image Gallery */}
          <div className="bg-(--color-surface) rounded-2xl border border-(--color-border) overflow-hidden p-4">
            <div className="aspect-video bg-gray-100 rounded-xl overflow-hidden mb-4 relative">
              {images.length > 0 ? (
                <img
                  src={images[activeImageIndex]?.image_url}
                  alt={car.title}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-gray-400">
                  No Image Available
                </div>
              )}
              {/* Status Badge Overlay */}
              <div className="absolute top-4 left-4">
                <span
                  className={`px-3 py-1 rounded-full text-sm font-medium border shadow-sm backdrop-blur-md
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
            </div>

            {images.length > 1 && (
              <div className="flex gap-2 overflow-x-auto pb-2">
                {images.map((img, idx) => (
                  <button
                    key={img.id}
                    onClick={() => setActiveImageIndex(idx)}
                    className={`w-20 h-20 shrink-0 rounded-lg overflow-hidden border-2 transition-all ${
                      activeImageIndex === idx
                        ? 'border-(--color-primary)'
                        : 'border-transparent opacity-70 hover:opacity-100'
                    }`}
                  >
                    <img
                      src={img.image_url}
                      alt={`View ${idx + 1}`}
                      className="w-full h-full object-cover"
                    />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Description & Features */}
          <div className="bg-(--color-surface) rounded-2xl border border-(--color-border) p-6 space-y-6">
            <div>
              <h2 className="text-lg font-bold text-(--color-text) mb-3">
                Description
              </h2>
              <p className="text-(--color-body) whitespace-pre-wrap leading-relaxed">
                {car.description}
              </p>
            </div>

            <div>
              <h2 className="text-lg font-bold text-(--color-text) mb-3">
                Key Features
              </h2>
              <div className="flex flex-wrap gap-2">
                {getKeyFeatures().map((feature: string, idx: number) => (
                  <span
                    key={idx}
                    className="px-3 py-1 bg-(--color-background) text-(--color-text) rounded-full text-sm border border-(--color-border)"
                  >
                    {feature}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Info & Actions */}
        <div className="space-y-6">
          {/* Price & Title Card */}
          <div className="bg-(--color-surface) rounded-2xl border border-(--color-border) p-6">
            <h2 className="text-xl font-bold text-(--color-text) mb-2">
              {car.title}
            </h2>
            <div className="text-3xl font-bold text-(--color-primary) mb-4">
              {formatCurrency(parseFloat(car.price))}
            </div>

            <div className="grid grid-cols-2 gap-4 text-sm">
              <div className="bg-(--color-background) p-3 rounded-lg">
                <p className="text-(--color-body) text-xs mb-1">Condition</p>
                <p className="font-semibold text-(--color-text) capitalize">
                  {car.condition} {car.second_condition}
                </p>
              </div>
              <div className="bg-(--color-background) p-3 rounded-lg">
                <p className="text-(--color-body) text-xs mb-1">Mileage</p>
                <p className="font-semibold text-(--color-text)">
                  {car.mileage.toLocaleString()} km
                </p>
              </div>
              <div className="bg-(--color-background) p-3 rounded-lg">
                <p className="text-(--color-body) text-xs mb-1">Year</p>
                <p className="font-semibold text-(--color-text)">
                  {car.year_of_manufacture}
                </p>
              </div>
              <div className="bg-(--color-background) p-3 rounded-lg">
                <p className="text-(--color-body) text-xs mb-1">Transmission</p>
                <p className="font-semibold text-(--color-text) capitalize">
                  {car.transmission}
                </p>
              </div>
            </div>

            <div className="mt-6 pt-6 border-t border-(--color-border) space-y-3">
              <div className="flex items-center gap-3 text-(--color-body)">
                <MapPinIcon className="h-5 w-5 shrink-0" />
                <span>
                  {car.city}, {car.state}, {car.country}
                </span>
              </div>
              <div className="flex items-center gap-3 text-(--color-body)">
                <CalendarIcon className="h-5 w-5 shrink-0" />
                <span>
                  Posted on {new Date(car.created_at).toLocaleDateString()}
                </span>
              </div>
            </div>
          </div>

          {/* User Info */}
          <div className="bg-(--color-surface) rounded-2xl border border-(--color-border) p-6">
            <h3 className="text-lg font-bold text-(--color-text) mb-4">
              Seller Information
            </h3>
            <div className="flex items-center gap-3 mb-4">
              <div className="h-12 w-12 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-600 font-bold text-lg">
                {car.user?.first_name?.charAt(0) || (
                  <UserIcon className="h-6 w-6" />
                )}
              </div>
              <div>
                <p className="font-bold text-(--color-text)">
                  {car.user?.first_name} {car.user?.last_name}
                </p>
                <p className="text-sm text-(--color-body)">{car.user?.email}</p>
              </div>
            </div>
            <div className="space-y-2">
              <div className="flex items-center gap-2 text-sm text-(--color-body)">
                <PhoneIcon className="h-4 w-4" />
                <span>{car.user?.phone_number || 'No phone number'}</span>
              </div>
              <div className="flex items-center gap-2 text-sm text-(--color-body)">
                <MapPinIcon className="h-4 w-4" />
                <span>
                  {car.user?.town_city}, {car.user?.country}
                </span>
              </div>
            </div>
          </div>

          {/* Actions */}
          <div className="bg-(--color-surface) rounded-2xl border border-(--color-border) p-6 space-y-3">
            <h3 className="text-lg font-bold text-(--color-text) mb-4">
              Actions
            </h3>

            {car.status === 'pending' && (
              <div className="grid grid-cols-2 gap-3">
                <Button
                  variant="outline"
                  className="justify-center text-emerald-600 border-emerald-200 hover:bg-emerald-50"
                  onClick={handleApprove}
                  icon={<CheckCircleIcon className="h-5 w-5" />}
                >
                  Approve
                </Button>
                <Button
                  variant="outline"
                  className="justify-center text-red-600 border-red-200 hover:bg-red-50"
                  onClick={() => setRejectModal(true)}
                  icon={<XCircleIcon className="h-5 w-5" />}
                >
                  Reject
                </Button>
              </div>
            )}

            <Button
              variant={car.is_featured ? 'primary' : 'outline'}
              className={`w-full justify-center ${car.is_featured ? 'bg-amber-500 hover:bg-amber-600 border-amber-500' : 'text-amber-600 border-amber-200 hover:bg-amber-50'}`}
              onClick={() => setFeatureModal(true)}
              icon={
                car.is_featured ? (
                  <StarIconSolid className="h-5 w-5" />
                ) : (
                  <StarIcon className="h-5 w-5" />
                )
              }
            >
              {car.is_featured ? 'Unfeature Car' : 'Feature Car'}
            </Button>

            <Button
              variant="outline"
              className="w-full justify-center text-red-600 border-red-200 hover:bg-red-50 hover:border-red-300"
              onClick={() => setDeleteConfirmation(true)}
              icon={<TrashIcon className="h-5 w-5" />}
            >
              Delete Car
            </Button>
          </div>
        </div>
      </div>

      <DeleteCarModal
        isOpen={deleteConfirmation}
        onClose={() => setDeleteConfirmation(false)}
        onConfirm={handleDelete}
      />

      <RejectCarModal
        isOpen={rejectModal}
        onClose={() => setRejectModal(false)}
        onSubmit={handleReject}
      />

      <FeatureCarModal
        isOpen={featureModal}
        onClose={() => setFeatureModal(false)}
        onConfirm={handleToggleFeature}
        car={car}
        isLoading={featureCarPending || unfeatureCarPending}
      />
    </div>
  );
};

export default CarDetails;
