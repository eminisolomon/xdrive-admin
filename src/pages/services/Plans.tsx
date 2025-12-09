import { useState } from 'react';
import PageHeader from '@/components/PageHeader';
import {
  CurrencyDollarIcon,
  PlusIcon,
  PencilIcon,
  TrashIcon,
  ListBulletIcon,
} from '@heroicons/react/24/outline';
import { usePlan } from '@/queries/usePlan';
import { Button, Loading } from '@/components';
import {
  PlanModal,
  PlanFeaturesModal,
  DeletePlanModal,
} from '@/components/Plan';
import { Plan, CreatePlanRequest } from '@/interfaces/plan';
import { formatCurrency } from '@/shared/formatters';
import { toast } from 'sonner';

const Plans = () => {
  const {
    allPlans,
    allPlansLoading,
    create,
    update,
    delete: deletePlan,
  } = usePlan();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingPlan, setEditingPlan] = useState<Plan | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [isFeatureModalOpen, setIsFeatureModalOpen] = useState(false);
  const [selectedPlanForFeatures, setSelectedPlanForFeatures] =
    useState<Plan | null>(null);

  const [deleteConfirmation, setDeleteConfirmation] = useState<{
    isOpen: boolean;
    planId: string | null;
  }>({
    isOpen: false,
    planId: null,
  });

  const handleCreate = () => {
    setEditingPlan(null);
    setIsModalOpen(true);
  };

  const handleEdit = (plan: Plan) => {
    setEditingPlan(plan);
    setIsModalOpen(true);
  };

  const handleManageFeatures = (plan: Plan) => {
    setSelectedPlanForFeatures(plan);
    setIsFeatureModalOpen(true);
  };

  const handleDelete = (id: string) => {
    setDeleteConfirmation({ isOpen: true, planId: id });
  };

  const confirmDelete = async () => {
    if (!deleteConfirmation.planId) return;

    try {
      await deletePlan(deleteConfirmation.planId);
      setDeleteConfirmation({ isOpen: false, planId: null });
    } catch (error) {
      console.error('Failed to delete plan', error);
    }
  };

  const handleToggleActive = async (plan: Plan) => {
    try {
      await update({
        id: plan.id,
        data: { is_active: !plan.is_active },
      });
    } catch (error) {
      console.error('Failed to update plan status', error);
    }
  };

  const handleSubmit = async (data: CreatePlanRequest) => {
    setIsSubmitting(true);
    try {
      if (editingPlan) {
        const updateData = {
          ...data,
          slug: data.slug || undefined,
          description: data.description || undefined,
          trial_days: data.trial_days || undefined,
          is_active: data.is_active ?? undefined,
          sort_order: data.sort_order || undefined,
        };
        await update({ id: editingPlan.id, data: updateData });
      } else {
        await create(data);
      }
      setIsModalOpen(false);
    } catch (error) {
      console.error(error);
      toast.error('Failed to save plan');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (allPlansLoading) {
    return <Loading />;
  }

  return (
    <div>
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <PageHeader
          title="Service Plans"
          description="Manage service plans and their operations."
          icon={<CurrencyDollarIcon className="h-12 w-12" />}
        />
        <Button onClick={handleCreate} icon={<PlusIcon className="h-5 w-5" />}>
          Create Plan
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {allPlans?.data?.map((plan) => (
          <div
            key={plan.id}
            className={`
              relative bg-(--color-surface) rounded-2xl border transition-all duration-200
              ${
                plan.is_active
                  ? 'border-(--color-border) shadow-sm hover:shadow-md'
                  : 'border-(--color-border) opacity-75 bg-(--color-background)/50'
              }
            `}
          >
            {/* Status Badge */}
            <div className="absolute top-4 right-4">
              <span
                className={`
                  px-2.5 py-1 rounded-full text-xs font-medium border
                  ${
                    plan.is_active
                      ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                      : 'bg-gray-100 text-gray-600 border-gray-200'
                  }
                `}
              >
                {plan.is_active ? 'Active' : 'Inactive'}
              </span>
            </div>

            <div className="p-6">
              <h3 className="text-xl font-bold text-(--color-text) mb-1">
                {plan.name}
              </h3>
              <div className="flex items-baseline gap-1 mb-4">
                <span className="text-3xl font-extrabold text-(--color-primary)">
                  {formatCurrency(plan.price)}
                </span>
                <span className="text-(--color-body) text-sm">
                  /{plan.billing_cycle}
                </span>
              </div>

              <p className="text-(--color-body) text-sm line-clamp-2 mb-6 h-10">
                {plan.description}
              </p>

              <div className="space-y-3 border-t border-(--color-border) pt-4">
                <div className="flex justify-between text-sm">
                  <span className="text-(--color-body)">Trial Period</span>
                  <span className="font-medium text-(--color-text)">
                    {plan.trial_days} days
                  </span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-(--color-body)">Subscribers</span>
                  <span className="font-medium text-(--color-text)">
                    {plan.subscribers_count || 0}
                  </span>
                </div>
              </div>

              <div className="mt-4">
                <button
                  onClick={() => handleManageFeatures(plan)}
                  className="w-full flex items-center justify-center gap-2 py-2 rounded-lg bg-(--color-background) border border-(--color-border) text-sm font-medium text-(--color-text) hover:bg-(--color-surface) transition-colors"
                >
                  <ListBulletIcon className="h-4 w-4" />
                  Manage Features
                </button>
              </div>

              <div className="flex items-center gap-2 mt-4 pt-4 border-t border-(--color-border)">
                <Button
                  variant="outline"
                  size="sm"
                  className="flex-1"
                  onClick={() => handleToggleActive(plan)}
                >
                  {plan.is_active ? 'Deactivate' : 'Activate'}
                </Button>
                <button
                  onClick={() => handleEdit(plan)}
                  className="p-2 rounded-lg text-(--color-body) hover:bg-(--color-hover) hover:text-(--color-primary) transition-colors"
                  title="Edit Plan"
                >
                  <PencilIcon className="h-5 w-5" />
                </button>
                <button
                  onClick={() => handleDelete(plan.id)}
                  className="p-2 rounded-lg text-(--color-body) hover:bg-(--color-hover) hover:text-(--color-error) transition-colors"
                  title="Delete Plan"
                >
                  <TrashIcon className="h-5 w-5" />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      <PlanModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSubmit={handleSubmit}
        initialData={editingPlan}
        isLoading={isSubmitting}
      />

      <PlanFeaturesModal
        isOpen={isFeatureModalOpen}
        onClose={() => setIsFeatureModalOpen(false)}
        plan={selectedPlanForFeatures}
      />

      <DeletePlanModal
        isOpen={deleteConfirmation.isOpen}
        onClose={() => setDeleteConfirmation({ isOpen: false, planId: null })}
        onConfirm={confirmDelete}
      />
    </div>
  );
};

export default Plans;
