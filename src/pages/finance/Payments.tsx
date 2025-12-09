import { useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import {
  CurrencyDollarIcon,
  ArrowPathIcon,
  MagnifyingGlassIcon,
  UserIcon,
} from '@heroicons/react/24/outline';
import PageHeader from '@/components/PageHeader';
import { Button, Loading, Pagination, Input } from '@/components';
import { RefundPaymentModal } from '@/components/Finance';
import { usePayments } from '@/queries/usePayments';
import { formatCurrency, formatDate } from '@/shared/formatters';
import { Payment } from '@/interfaces/payment';

const Payments = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const page = Number(searchParams.get('page')) || 1;
  const [selectedPayment, setSelectedPayment] = useState<Payment | null>(null);
  const [isRefundModalOpen, setIsRefundModalOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  const { useGetPayments, refundPaymentPending, refundPayment } = usePayments();
  const { data: paymentsData, isLoading } = useGetPayments(page);
  const paymentsList = paymentsData?.data?.data || [];
  const pagination = paymentsData?.data?.pagination;

  const handlePageChange = (newPage: number) => {
    setSearchParams({ page: newPage.toString() });
  };

  const handleRefundClick = (payment: Payment) => {
    setSelectedPayment(payment);
    setIsRefundModalOpen(true);
  };

  const handleRefundConfirm = async () => {
    if (selectedPayment) {
      try {
        await refundPayment({ id: selectedPayment.id });
        setIsRefundModalOpen(false);
        setSelectedPayment(null);
      } catch (error) {
        console.error('Refund failed:', error);
      }
    }
  };

  // Status Badge Helper
  const getStatusBadge = (status: string) => {
    const styles = {
      completed: 'bg-emerald-100 text-emerald-800 border-emerald-200',
      succeeded: 'bg-emerald-100 text-emerald-800 border-emerald-200',
      pending: 'bg-amber-100 text-amber-800 border-amber-200',
      failed: 'bg-red-100 text-red-800 border-red-200',
      refunded: 'bg-gray-100 text-gray-800 border-gray-200',
    };
    const key = status.toLowerCase() as keyof typeof styles;
    return (
      <span
        className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border capitalize ${
          styles[key] || 'bg-gray-100 text-gray-800 border-gray-200'
        }`}
      >
        {status}
      </span>
    );
  };

  if (isLoading) return <Loading />;

  const isEmpty = paymentsList.length === 0;

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <PageHeader
          title="Payments"
          description="View and manage transaction history."
          icon={<CurrencyDollarIcon className="h-12 w-12" />}
        />
        <div className="w-full sm:w-72">
          <Input
            placeholder="Search payments..."
            leftIcon={<MagnifyingGlassIcon className="h-5 w-5 text-gray-400" />}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
      </div>

      <div className="mt-8">
        {isEmpty ? (
          <div className="text-center py-12 bg-(--color-surface) rounded-3xl border border-dashed border-(--color-border)">
            <CurrencyDollarIcon className="h-12 w-12 mx-auto text-(--color-inactive) mb-3" />
            <h3 className="text-lg font-medium text-(--color-text)">
              No payments found
            </h3>
            <p className="text-(--color-body)">
              Try adjusting your search criteria.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {paymentsList.map((payment) => (
              <div
                key={payment.id}
                className="bg-(--color-surface) rounded-2xl border border-(--color-border) shadow-sm hover:shadow-md transition-all duration-200 flex flex-col"
              >
                {/* Card Header: User Info & Status */}
                <div className="p-5 border-b border-(--color-border)">
                  <div className="flex justify-between items-start mb-3">
                    <div className="flex items-center gap-3">
                      <div className="h-10 w-10 rounded-full bg-indigo-50 text-indigo-600 flex items-center justify-center font-bold text-lg">
                        {payment.user?.first_name?.charAt(0) || (
                          <UserIcon className="h-5 w-5" />
                        )}
                      </div>
                      <div className="overflow-hidden">
                        <h3 className="font-bold text-(--color-text) text-sm leading-tight truncate">
                          {payment.user?.first_name} {payment.user?.last_name}
                        </h3>
                        <p className="text-xs text-(--color-body) truncate">
                          {payment.user?.email}
                        </p>
                      </div>
                    </div>
                    {getStatusBadge(payment.status)}
                  </div>
                </div>

                {/* Card Body: Amount & Details */}
                <div className="p-5 flex-1 space-y-4">
                  <div>
                    <p className="text-xs font-medium text-(--color-body) mb-1 uppercase tracking-wider">
                      Amount
                    </p>
                    <div className="flex items-baseline gap-2">
                      <span className="text-2xl font-bold text-(--color-text)">
                        {formatCurrency(payment.amount)}
                      </span>
                      <span className="text-sm font-medium text-(--color-inactive) uppercase">
                        {payment.currency || 'NGN'}
                      </span>
                    </div>
                  </div>

                  <div className="space-y-3">
                    <div>
                      <p className="text-xs font-medium text-(--color-body) mb-1 uppercase tracking-wider">
                        Transaction ID
                      </p>
                      <p className="text-xs font-mono bg-gray-50 text-(--color-text) px-2 py-1.5 rounded border border-gray-100 break-all">
                        {payment.transaction_id || payment.id}
                      </p>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <p className="text-xs font-medium text-(--color-body) mb-1 uppercase tracking-wider">
                          Date
                        </p>
                        <p className="text-sm text-(--color-text) font-medium">
                          {formatDate(payment.created_at)}
                        </p>
                      </div>
                      {payment.subscription && (
                        <div>
                          <p className="text-xs font-medium text-(--color-body) mb-1 uppercase tracking-wider">
                            Plan
                          </p>
                          <p className="text-sm text-(--color-primary) font-medium truncate">
                            {payment.subscription.plan_name}
                          </p>
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                {/* Card Footer: Actions */}
                {(payment.status === 'succeeded' ||
                  payment.status === 'completed') && (
                  <div className="p-3 bg-(--color-background)/30 border-t border-(--color-border) rounded-b-2xl flex justify-end">
                    <Button
                      variant="outline"
                      size="sm"
                      className="text-amber-600 border-amber-200 hover:bg-amber-50 hover:border-amber-300 transition-colors"
                      onClick={() => handleRefundClick(payment)}
                      title="Refund Payment"
                      icon={<ArrowPathIcon className="h-4 w-4" />}
                    >
                      Refund
                    </Button>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>

      {pagination && (
        <Pagination pagination={pagination} onPageChange={handlePageChange} />
      )}

      <RefundPaymentModal
        isOpen={isRefundModalOpen}
        onClose={() => setIsRefundModalOpen(false)}
        onConfirm={handleRefundConfirm}
        payment={selectedPayment}
        isLoading={refundPaymentPending}
      />
    </div>
  );
};

export default Payments;
