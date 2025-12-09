import { useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import PageHeader from '@/components/PageHeader';
import {
  CreditCardIcon,
  CalendarDaysIcon,
  XCircleIcon,
} from '@heroicons/react/24/outline';
import { useSubscriptions } from '@/queries/useSubscriptions';
import { Button, Loading, Pagination } from '@/components';
import {
  ExtendSubscriptionModal,
  CancelSubscriptionModal,
} from '@/components/Subscription';
import {
  Subscription,
  ExtendSubscriptionRequest,
} from '@/interfaces/subscription';
import { formatDate } from '@/shared/formatters';

const Subscriptions = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const page = parseInt(searchParams.get('page') || '1', 10);

  const { useGetSubscriptions, cancelSubscription, extendSubscription } =
    useSubscriptions();

  const { data: subscriptionsResponse, isLoading: subscriptionsLoading } =
    useGetSubscriptions(page);

  const [extendModalOpen, setExtendModalOpen] = useState(false);
  const [selectedSubscription, setSelectedSubscription] =
    useState<Subscription | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [cancelConfirmation, setCancelConfirmation] = useState<{
    isOpen: boolean;
    subscriptionId: string | null;
  }>({
    isOpen: false,
    subscriptionId: null,
  });

  const handleExtend = (subscription: Subscription) => {
    setSelectedSubscription(subscription);
    setExtendModalOpen(true);
  };

  const confirmCancel = (id: string) => {
    setCancelConfirmation({ isOpen: true, subscriptionId: id });
  };

  const handleCancel = async () => {
    if (!cancelConfirmation.subscriptionId) return;

    try {
      await cancelSubscription(cancelConfirmation.subscriptionId);
      setCancelConfirmation({ isOpen: false, subscriptionId: null });
    } catch (error) {
      console.error('Failed to cancel subscription', error);
    }
  };

  const handleExtendSubmit = async (data: ExtendSubscriptionRequest) => {
    if (!selectedSubscription) return;

    setIsSubmitting(true);
    try {
      await extendSubscription({
        id: selectedSubscription.id,
        data,
      });
      setExtendModalOpen(false);
    } catch (error) {
      console.error(error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handlePageChange = (newPage: number) => {
    setSearchParams({ page: newPage.toString() });
  };

  if (subscriptionsLoading) {
    return <Loading />;
  }

  const subscriptionsList = subscriptionsResponse?.data?.data || [];
  const pagination = subscriptionsResponse?.data?.pagination;
  const isEmpty = subscriptionsList.length === 0;

  return (
    <div>
      <PageHeader
        title="Subscriptions"
        description="Manage customer subscriptions and billing."
        icon={<CreditCardIcon className="h-12 w-12" />}
      />

      <div className="mt-8">
        {isEmpty ? (
          <div className="text-center py-12 bg-(--color-surface) rounded-3xl border border-dashed border-(--color-border)">
            <CreditCardIcon className="h-12 w-12 mx-auto text-(--color-inactive) mb-3" />
            <h3 className="text-lg font-medium text-(--color-text)">
              No subscriptions found
            </h3>
            <p className="text-(--color-body)">
              There are no active subscriptions at the moment.
            </p>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {subscriptionsList.map((sub) => (
                <div
                  key={sub.id}
                  className="bg-(--color-surface) rounded-2xl border border-(--color-border) shadow-sm hover:shadow-md transition-all duration-200 flex flex-col"
                >
                  {/* Card Header: User Info & Status */}
                  <div className="p-5 border-b border-(--color-border)">
                    <div className="flex justify-between items-start mb-3">
                      <div className="flex items-center gap-3">
                        <div className="h-10 w-10 rounded-full bg-blue-50 text-blue-600 flex items-center justify-center font-bold text-lg">
                          {sub.user.first_name.charAt(0)}
                        </div>
                        <div>
                          <h3 className="font-bold text-(--color-text) text-sm leading-tight">
                            {sub.user.first_name} {sub.user.last_name}
                          </h3>
                          <p className="text-xs text-(--color-body)">
                            {sub.user.email}
                          </p>
                        </div>
                      </div>
                      <span
                        className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium
                          ${sub.status === 'active' ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-500/20 dark:text-emerald-400' : ''}
                          ${sub.status === 'canceled' ? 'bg-red-100 text-red-800 dark:bg-red-500/20 dark:text-red-400' : ''}
                          ${sub.status === 'expired' ? 'bg-gray-100 text-gray-800 dark:bg-gray-500/20 dark:text-gray-400' : ''}
                          ${sub.status === 'trial' ? 'bg-blue-100 text-blue-800 dark:bg-blue-500/20 dark:text-blue-400' : ''}
                        `}
                      >
                        {sub.status_label}
                      </span>
                    </div>
                  </div>

                  {/* Card Body: Plan Details & Dates */}
                  <div className="p-5 flex-1 space-y-4">
                    <div>
                      <p className="text-xs font-medium text-(--color-body) mb-1 uppercase tracking-wider">
                        Plan
                      </p>
                      <div className="flex items-baseline gap-2">
                        <span className="text-lg font-bold text-(--color-text)">
                          {sub.plan.name}
                        </span>
                        <span className="text-sm text-(--color-body)">
                          {sub.plan.formatted_price} / {sub.plan.billing_cycle}
                        </span>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <p className="text-xs font-medium text-(--color-body) mb-1 uppercase tracking-wider">
                          Start Date
                        </p>
                        <p className="text-sm text-(--color-text) font-medium">
                          {formatDate(sub.starts_at)}
                        </p>
                      </div>
                      <div>
                        <p className="text-xs font-medium text-(--color-body) mb-1 uppercase tracking-wider">
                          End Date
                        </p>
                        <p className="text-sm text-(--color-text) font-medium">
                          {formatDate(sub.ends_at)}
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Card Footer: Actions */}
                  {sub.is_active && (
                    <div className="p-3 bg-(--color-background)/30 border-t border-(--color-border) rounded-b-2xl flex justify-end gap-2">
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleExtend(sub)}
                        icon={<CalendarDaysIcon className="h-4 w-4" />}
                      >
                        Extend
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        className="text-red-600! hover:bg-red-50! hover:border-red-200!"
                        onClick={() => confirmCancel(sub.id)}
                        icon={<XCircleIcon className="h-4 w-4" />}
                      >
                        Cancel
                      </Button>
                    </div>
                  )}
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
      </div>

      <ExtendSubscriptionModal
        isOpen={extendModalOpen}
        onClose={() => setExtendModalOpen(false)}
        onSubmit={handleExtendSubmit}
        subscription={selectedSubscription}
        isLoading={isSubmitting}
      />

      <CancelSubscriptionModal
        isOpen={cancelConfirmation.isOpen}
        onClose={() =>
          setCancelConfirmation({ isOpen: false, subscriptionId: null })
        }
        onConfirm={handleCancel}
      />
    </div>
  );
};

export default Subscriptions;
