import { useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import {
  ChatBubbleBottomCenterTextIcon,
  StarIcon,
  TrashIcon,
  FlagIcon,
} from '@heroicons/react/24/outline';
import { FlagIcon as FlagIconSolid } from '@heroicons/react/24/solid';
import PageHeader from '@/components/PageHeader';
import { Button, Loading, Pagination } from '@/components';
import { DeleteReviewModal } from '@/components/Feedback';
import { useReviews } from '@/queries/useReviews';
import { formatDate } from '@/shared/formatters';

const Reviews = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const page = Number(searchParams.get('page')) || 1;
  const [selectedReviewId, setSelectedReviewId] = useState<string | null>(null);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);

  const {
    useGetReviews,
    deleteReview,
    deleteReviewPending,
    flagReview,
    unflagReview,
  } = useReviews();
  const { data: reviewsData, isLoading } = useGetReviews(page);
  const reviewsList = reviewsData?.data?.data || [];
  const pagination = reviewsData?.data?.pagination;

  const handlePageChange = (newPage: number) => {
    setSearchParams({ page: newPage.toString() });
  };

  const handleDeleteClick = (id: string) => {
    setSelectedReviewId(id);
    setIsDeleteModalOpen(true);
  };

  const handleDeleteConfirm = async () => {
    if (selectedReviewId) {
      try {
        await deleteReview(selectedReviewId);
        setIsDeleteModalOpen(false);
        setSelectedReviewId(null);
      } catch (error) {
        console.error('Delete failed:', error);
      }
    }
  };

  const handleToggleFlag = async (id: string, isFlagged: boolean) => {
    try {
      if (isFlagged) {
        await unflagReview(id);
      } else {
        await flagReview(id);
      }
    } catch (error) {
      console.error('Flag toggle failed:', error);
    }
  };

  if (isLoading) return <Loading />;

  return (
    <div>
      <PageHeader
        title="Reviews"
        description="Manage user reviews for workshops and mechanics."
        icon={<ChatBubbleBottomCenterTextIcon className="h-12 w-12" />}
      />

      <div className="mt-6 flex flex-col gap-4">
        {reviewsList.length === 0 ? (
          <div className="text-center py-12 bg-(--color-surface) rounded-3xl border border-dashed border-(--color-border)">
            <ChatBubbleBottomCenterTextIcon className="h-12 w-12 mx-auto text-(--color-inactive) mb-3" />
            <h3 className="text-lg font-medium text-(--color-text)">
              No reviews found
            </h3>
          </div>
        ) : (
          <div className="grid gap-4">
            {reviewsList.map((review) => (
              <div
                key={review.id}
                className="bg-(--color-surface) p-6 rounded-2xl border border-(--color-border) shadow-xs transition-shadow hover:shadow-md"
              >
                <div className="flex flex-col md:flex-row md:items-start justify-between gap-4">
                  <div className="flex-1 space-y-2">
                    <div className="flex items-center gap-2">
                      <div className="flex text-amber-400">
                        {[...Array(5)].map((_, i) => (
                          <StarIcon
                            key={i}
                            className={`h-4 w-4 ${
                              i < review.rating
                                ? 'fill-current'
                                : 'text-gray-300'
                            }`}
                          />
                        ))}
                      </div>
                      <span className="text-sm font-medium text-(--color-text)">
                        {review.rating}/5
                      </span>
                      <span className="text-xs text-(--color-body)">•</span>
                      <span className="text-xs text-(--color-body)">
                        {formatDate(review.created_at)}
                      </span>
                    </div>

                    <p className="text-(--color-text) text-base leading-relaxed">
                      "{review.comment}"
                    </p>

                    <div className="flex items-center gap-2 text-sm text-(--color-body) mt-2">
                      <span className="font-medium text-(--color-primary)">
                        {review.user?.first_name} {review.user?.last_name}
                      </span>
                      <span>reviewed</span>
                      <span className="font-medium text-(--color-text)">
                        {review.reviewable?.name || 'Unknown Target'}
                      </span>
                      <span className="px-2 py-0.5 rounded-full bg-gray-100 text-xs font-medium capitalize">
                        {review.reviewable?.type}
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 md:self-start shrink-0">
                    <Button
                      variant="ghost"
                      size="sm"
                      className={`${
                        review.flagged
                          ? 'text-red-600 bg-red-50 hover:bg-red-100'
                          : 'text-(--color-body) hover:text-red-600 hover:bg-red-50'
                      }`}
                      onClick={() =>
                        handleToggleFlag(review.id, !!review.flagged)
                      }
                      title={review.flagged ? 'Unflag Review' : 'Flag Review'}
                    >
                      {review.flagged ? (
                        <FlagIconSolid className="h-4 w-4" />
                      ) : (
                        <FlagIcon className="h-4 w-4" />
                      )}
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="text-(--color-body) hover:text-red-600 hover:bg-red-50"
                      onClick={() => handleDeleteClick(review.id)}
                      title="Delete Review"
                    >
                      <TrashIcon className="h-4 w-4" />
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

        <DeleteReviewModal
          isOpen={isDeleteModalOpen}
          onClose={() => setIsDeleteModalOpen(false)}
          onConfirm={handleDeleteConfirm}
          isLoading={deleteReviewPending}
        />
      </div>
    </div>
  );
};

export default Reviews;
