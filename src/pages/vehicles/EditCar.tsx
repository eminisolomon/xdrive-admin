import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { ArrowLeftIcon } from '@heroicons/react/24/outline';
import { useCars } from '@/queries/useCars';
import { useBrand } from '@/queries/useBrand';
import { useBodyType } from '@/queries/useBodyType';
import { useCarModel } from '@/queries/useCarModel';
import {
  Button,
  Input,
  Loading,
  PageHeader,
  SearchableSelect,
} from '@/components';
import { UpdateCarRequest } from '@/interfaces';

const EditCar = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { useGetCar, updateCar, updateCarPending } = useCars();
  const [brandSearch, setBrandSearch] = useState('');

  const { allBrandsQuery } = useBrand(null, 1, brandSearch);
  const { useGetBodyTypes } = useBodyType();
  const { data: bodyTypesData } = useGetBodyTypes();
  const brands = allBrandsQuery.data?.data.data || [];
  const bodyTypes = bodyTypesData?.data || [];

  const { data: carResponse, isLoading: carLoading } = useGetCar(id || '');
  const car = carResponse?.data;

  // Form setup
  const {
    register,
    handleSubmit,
    reset,
    watch,
    setValue,
    formState: { errors },
  } = useForm<UpdateCarRequest>();

  const selectedBrandId = watch('brand_id');
  const listingType = watch('listing_type');

  // Fetch models based on selected brand
  const { useGetCarModels } = useCarModel();
  const { data: modelsResponse } = useGetCarModels(selectedBrandId || '');
  const carModels = modelsResponse?.data.data || [];

  // Populate form
  useEffect(() => {
    if (car) {
      reset({
        // Basic
        title: car.title,
        description: car.description,

        // Classification
        brand_id: car.brand?.id,
        car_model_id: car.car_model?.id,
        body_type_id: car.body_type?.id,
        trim: car.trim,

        // Specs
        year_of_manufacture: car.year_of_manufacture,
        mileage: car.mileage,
        engine_size: parseFloat(car.engine_size) || undefined,
        horse_power: car.horse_power,
        color: car.color,
        condition: car.condition as any,
        second_condition: car.second_condition as any,
        transmission: car.transmission as any,
        fuel_type: car.fuel_type as any,
        gear_type: car.gear_type as any,
        number_of_seats: car.number_of_seats,

        // Pricing
        price: parseFloat(car.price),
        price_negotiable: car.price_negotiable as any,
        listing_type: car.listing_type as any,
        swap_method: car.swap_method as any,
        swap_with: car.swap_with || '',

        // Details
        registered_car: car.registered_car || '',
        my_chasis_number: car.my_chasis_number || '',
        key_features: car.key_features,

        // Location
        address: car.address,
        city: car.city,
        state: car.state,
        country: car.country,

        // Settings
        status: car.status as any,
        is_featured: car.is_featured,
        flagged: !!car.flagged,
        is_approved: !!car.is_approved,
        rejection_reason: car.rejection_reason || '',
      });
    }
  }, [car, reset]);

  const onSubmit = async (data: UpdateCarRequest) => {
    if (!id) return;
    try {
      const payload = {
        ...data,
        year_of_manufacture: Number(data.year_of_manufacture),
        price: Number(data.price),
        mileage: Number(data.mileage),
        number_of_seats: Number(data.number_of_seats),
        engine_size: Number(data.engine_size),
      };

      await updateCar({ id, data: payload });
      navigate(`/vehicles/cars/${id}`);
    } catch (error) {
      console.error('Failed to update car', error);
    }
  };

  if (carLoading) return <Loading />;
  if (!car) return <div>Car not found</div>;

  const inputClass =
    'w-full rounded-lg border border-(--color-border) bg-(--color-background) p-2.5 text-sm text-(--color-text) focus:border-(--color-primary) focus:outline-none focus:ring-1 focus:ring-(--color-primary)';

  return (
    <div className="pb-20">
      <div className="flex items-center gap-4 mb-2">
        <button
          onClick={() => navigate(-1)}
          className="p-2 -ml-2 rounded-lg hover:bg-(--color-background) text-(--color-body) hover:text-(--color-text) transition-colors"
        >
          <ArrowLeftIcon className="h-6 w-6" />
        </button>
      </div>

      <PageHeader
        title="Edit Car"
        description="Update car details and settings"
      />

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Column (Main Content) */}
          <div className="lg:col-span-2 space-y-6">
            {/* Basic Info */}
            <div className="bg-(--color-surface) rounded-2xl border border-(--color-border) p-6 space-y-4">
              <h2 className="text-lg font-bold text-(--color-text) border-b pb-2">
                Basic Information
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="md:col-span-2">
                  <Input
                    label="Title"
                    {...register('title', {
                      required: 'Title is required',
                      maxLength: 255,
                    })}
                    error={errors.title?.message}
                  />
                </div>

                <div className="md:col-span-2 space-y-2">
                  <label className="text-sm font-medium text-(--color-text)">
                    Description
                  </label>
                  <textarea
                    {...register('description', { maxLength: 5000 })}
                    className={`${inputClass} min-h-[120px]`}
                  />
                  {errors.description && (
                    <span className="text-sm text-red-500">
                      {errors.description.message}
                    </span>
                  )}
                </div>
              </div>
            </div>

            {/* Classification */}
            <div className="bg-(--color-surface) rounded-2xl border border-(--color-border) p-6 space-y-4">
              <h2 className="text-lg font-bold text-(--color-text) border-b pb-2">
                Classification
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <SearchableSelect
                    label="Brand"
                    placeholder="Select Brand"
                    options={brands.map((b) => ({ id: b.id, name: b.name }))}
                    value={selectedBrandId}
                    onChange={(val) => {
                      setValue('brand_id', val as string);
                      setValue('car_model_id', '');
                    }}
                    onSearch={setBrandSearch}
                    error={errors.brand_id?.message}
                  />
                  {/* Hidden input for validation if needed, though react-hook-form can work with setValue */}
                  <input
                    type="hidden"
                    {...register('brand_id', { required: 'Brand is required' })}
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium text-(--color-text)">
                    Model
                  </label>
                  <select
                    {...register('car_model_id', {
                      required: 'Model is required',
                    })}
                    className={inputClass}
                    disabled={!selectedBrandId}
                  >
                    <option value="">Select Model</option>
                    {carModels.map((model) => (
                      <option key={model.id} value={model.id}>
                        {model.name}
                      </option>
                    ))}
                  </select>
                  {errors.car_model_id && (
                    <span className="text-sm text-red-500">
                      {errors.car_model_id.message}
                    </span>
                  )}
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium text-(--color-text)">
                    Body Type
                  </label>
                  <select
                    {...register('body_type_id', {
                      required: 'Body Type is required',
                    })}
                    className={inputClass}
                  >
                    <option value="">Select Body Type</option>
                    {bodyTypes.map((bt) => (
                      <option key={bt.id} value={bt.id}>
                        {bt.name}
                      </option>
                    ))}
                  </select>
                  {errors.body_type_id && (
                    <span className="text-sm text-red-500">
                      {errors.body_type_id.message}
                    </span>
                  )}
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium text-(--color-text)">
                    Trim
                  </label>
                  <select {...register('trim')} className={inputClass}>
                    <option value="">Select Trim</option>
                    {[
                      'Base',
                      'Sport',
                      'Luxury',
                      'Limited',
                      'Premium',
                      'Touring',
                      'GT',
                      'Elite',
                      'Ultimate',
                      'Type-S',
                    ].map((opt) => (
                      <option key={opt} value={opt}>
                        {opt}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            </div>

            {/* Specifications */}
            <div className="bg-(--color-surface) rounded-2xl border border-(--color-border) p-6 space-y-4">
              <h2 className="text-lg font-bold text-(--color-text) border-b pb-2">
                Specifications
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Input
                  label="Year"
                  type="number"
                  {...register('year_of_manufacture', { required: 'Required' })}
                />
                <Input
                  label="Mileage"
                  type="number"
                  {...register('mileage', { required: 'Required' })}
                />

                <Input
                  label="Color"
                  {...register('color', { required: 'Required' })}
                />

                <div className="space-y-2">
                  <label className="text-sm font-medium text-(--color-text)">
                    Condition
                  </label>
                  <select {...register('condition')} className={inputClass}>
                    {['new', 'used', 'certified'].map((opt) => (
                      <option key={opt} value={opt} className="capitalize">
                        {opt}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium text-(--color-text)">
                    Second Condition
                  </label>
                  <select
                    {...register('second_condition')}
                    className={inputClass}
                  >
                    <option value="">None</option>
                    {['Excellent', 'Good', 'Fair', 'Salvage'].map((opt) => (
                      <option key={opt} value={opt}>
                        {opt}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium text-(--color-text)">
                    Transmission
                  </label>
                  <select {...register('transmission')} className={inputClass}>
                    {[
                      'automatic',
                      'manual',
                      'cvt',
                      'dct',
                      'semi_automatic',
                      'sequential',
                      'tiptronic',
                      'dsg',
                      'amt',
                      'direct_shift',
                      'e_cvt',
                      'hybrid',
                      'single_speed',
                    ].map((opt) => (
                      <option key={opt} value={opt} className="capitalize">
                        {opt.replace('_', ' ')}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium text-(--color-text)">
                    Fuel Type
                  </label>
                  <select {...register('fuel_type')} className={inputClass}>
                    {['petrol', 'diesel', 'electric', 'hybrid'].map((opt) => (
                      <option key={opt} value={opt} className="capitalize">
                        {opt}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium text-(--color-text)">
                    Gear Type
                  </label>
                  <select {...register('gear_type')} className={inputClass}>
                    <option value="">Select Gear Type</option>
                    {['type_s', 'type_a', 'type_b'].map((opt) => (
                      <option key={opt} value={opt}>
                        {opt}
                      </option>
                    ))}
                  </select>
                </div>

                <Input
                  label="Number of Seats"
                  type="number"
                  {...register('number_of_seats')}
                />
                <Input
                  label="Engine Size"
                  type="number"
                  step="0.1"
                  {...register('engine_size')}
                  placeholder="e.g. 2.0"
                />
                <Input
                  label="Horse Power"
                  {...register('horse_power')}
                  placeholder="e.g. 250hp"
                />
              </div>
            </div>
          </div>

          {/* Right Column (Sidebar) */}
          <div className="space-y-6">
            {/* Pricing & Listing */}
            <div className="bg-(--color-surface) rounded-2xl border border-(--color-border) p-6 space-y-4">
              <h2 className="text-lg font-bold text-(--color-text) border-b pb-2">
                Pricing & Listing
              </h2>
              <div className="space-y-4">
                <Input
                  label="Price"
                  type="number"
                  {...register('price', { required: 'Required' })}
                />

                <div className="space-y-2">
                  <label className="text-sm font-medium text-(--color-text)">
                    Price Type
                  </label>
                  <select
                    {...register('price_negotiable')}
                    className={inputClass}
                  >
                    <option value="fix_amount">Fixed Amount</option>
                    <option value="negotiable">Negotiable</option>
                  </select>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium text-(--color-text)">
                    Listing Type
                  </label>
                  <select {...register('listing_type')} className={inputClass}>
                    <option value="sell">Sell</option>
                    <option value="swap">Swap</option>
                  </select>
                </div>

                {(listingType === 'swap' || listingType === 'sell') && (
                  <>
                    <div className="space-y-2">
                      <label className="text-sm font-medium text-(--color-text)">
                        Swap Method
                      </label>
                      <select
                        {...register('swap_method')}
                        className={inputClass}
                      >
                        <option value="">Select Method</option>
                        {['sell', 'swap', 'both'].map((opt) => (
                          <option key={opt} value={opt} className="capitalize">
                            {opt}
                          </option>
                        ))}
                      </select>
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-medium text-(--color-text)">
                        Swap With
                      </label>
                      <textarea
                        {...register('swap_with')}
                        className={inputClass}
                        placeholder="What to swap with?"
                        rows={3}
                      />
                    </div>
                  </>
                )}
              </div>
            </div>

            {/* Location */}
            <div className="bg-(--color-surface) rounded-2xl border border-(--color-border) p-6 space-y-4">
              <h2 className="text-lg font-bold text-(--color-text) border-b pb-2">
                Location
              </h2>
              <div className="space-y-4">
                <Input label="Address" {...register('address')} />
                <div className="grid grid-cols-2 gap-4">
                  <Input label="City" {...register('city')} />
                  <Input label="State" {...register('state')} />
                </div>
                <Input label="Country" {...register('country')} />
              </div>
            </div>

            {/* Settings & Status */}
            <div className="bg-(--color-surface) rounded-2xl border border-(--color-border) p-6 space-y-4">
              <h2 className="text-lg font-bold text-(--color-text) border-b pb-2">
                Settings
              </h2>
              <div className="space-y-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium text-(--color-text)">
                    Status
                  </label>
                  <select {...register('status')} className={inputClass}>
                    {[
                      'active',
                      'inactive',
                      'sold',
                      'pending',
                      'approved',
                      'rejected',
                    ].map((opt) => (
                      <option key={opt} value={opt} className="capitalize">
                        {opt}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium text-(--color-text)">
                    Rejection Reason
                  </label>
                  <textarea
                    {...register('rejection_reason')}
                    className={inputClass}
                    placeholder="Reason if rejected"
                    rows={2}
                  />
                </div>
              </div>

              <div className="space-y-3 mt-4 border-t border-(--color-border) pt-4">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    {...register('is_featured')}
                    className="h-4 w-4 rounded border-gray-300 text-(--color-primary) focus:ring-(--color-primary)"
                  />
                  <span className="text-sm text-(--color-text)">Featured</span>
                </label>
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    {...register('flagged')}
                    className="h-4 w-4 rounded border-gray-300 text-(--color-primary) focus:ring-(--color-primary)"
                  />
                  <span className="text-sm text-(--color-text)">Flagged</span>
                </label>
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    {...register('is_approved')}
                    className="h-4 w-4 rounded border-gray-300 text-(--color-primary) focus:ring-(--color-primary)"
                  />
                  <span className="text-sm text-(--color-text)">Approved</span>
                </label>
              </div>
            </div>
          </div>
        </div>

        {/* Features & Identification (Full Width) */}
        <div className="bg-(--color-surface) rounded-2xl border border-(--color-border) p-6 space-y-4">
          <h2 className="text-lg font-bold text-(--color-text) border-b pb-2">
            Features & Identification
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Input label="Registered Car No." {...register('registered_car')} />
            <Input label="Chassis Number" {...register('my_chasis_number')} />
          </div>

          <div className="space-y-2 mt-4">
            <label className="text-sm font-medium text-(--color-text)">
              Key Features (JSON)
            </label>
            <textarea
              {...register('key_features')}
              className={`${inputClass} min-h-[100px] font-mono text-xs`}
              placeholder='["Feature 1", "Feature 2"]'
            />
            <p className="text-xs text-gray-500">
              Enter features as a JSON array or string.
            </p>
          </div>
        </div>

        {/* Action Buttons (Full Width, Bottom) */}
        <div className="flex justify-end gap-3 pt-6 border-t border-(--color-border)">
          <Button variant="outline" onClick={() => navigate(-1)} type="button">
            Cancel
          </Button>
          <Button type="submit" isLoading={updateCarPending}>
            Save Changes
          </Button>
        </div>
      </form>
    </div>
  );
};

export default EditCar;
