import { useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import {
  ChatBubbleLeftRightIcon,
  TrashIcon,
  FlagIcon,
} from '@heroicons/react/24/outline';
import {
  FlagIcon as FlagIconSolid,
  HeartIcon as HeartIconSolid,
} from '@heroicons/react/24/solid';
import PageHeader from '@/components/PageHeader';
import { Button, Loading, Pagination } from '@/components';
import { DeleteCommentModal } from '@/components/Feedback';
import { useComments } from '@/queries/useComments';
import { formatDate } from '@/shared/formatters';

const Comments = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const page = Number(searchParams.get('page')) || 1;
  const [selectedCommentId, setSelectedCommentId] = useState<string | null>(
    null,
  );
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);

  const {
    useGetComments,
    deleteComment,
    deleteCommentPending,
    flagComment,
    unflagComment,
  } = useComments();
  const { data: commentsData, isLoading } = useGetComments(page);
  const commentsList = commentsData?.data?.data || [];
  const pagination = commentsData?.data?.pagination;

  const handlePageChange = (newPage: number) => {
    setSearchParams({ page: newPage.toString() });
  };

  const handleDeleteClick = (id: string) => {
    setSelectedCommentId(id);
    setIsDeleteModalOpen(true);
  };

  const handleDeleteConfirm = async () => {
    if (selectedCommentId) {
      try {
        await deleteComment(selectedCommentId);
        setIsDeleteModalOpen(false);
        setSelectedCommentId(null);
      } catch (error) {
        console.error('Delete failed:', error);
      }
    }
  };

  const handleToggleFlag = async (id: string, isFlagged: boolean) => {
    try {
      if (isFlagged) {
        await unflagComment(id);
      } else {
        await flagComment(id);
      }
    } catch (error) {
      console.error('Flag toggle failed:', error);
    }
  };

  if (isLoading) return <Loading />;

  return (
    <div>
      <PageHeader
        title="Comments"
        description="Manage comments on cars and posts."
        icon={<ChatBubbleLeftRightIcon className="h-12 w-12" />}
      />

      <div className="mt-6 flex flex-col gap-4">
        {commentsList.length === 0 ? (
          <div className="text-center py-12 bg-(--color-surface) rounded-3xl border border-dashed border-(--color-border)">
            <ChatBubbleLeftRightIcon className="h-12 w-12 mx-auto text-(--color-inactive) mb-3" />
            <h3 className="text-lg font-medium text-(--color-text)">
              No comments found
            </h3>
          </div>
        ) : (
          <div className="grid gap-4">
            {commentsList.map((comment) => (
              <div
                key={comment.id}
                className="bg-(--color-surface) p-6 rounded-2xl border border-(--color-border) shadow-xs transition-shadow hover:shadow-md"
              >
                <div className="flex flex-col md:flex-row md:items-start justify-between gap-4">
                  <div className="flex-1 space-y-2">
                    <div className="flex items-center gap-2 text-sm text-(--color-body)">
                      <span className="font-semibold text-(--color-text)">
                        {comment.user?.first_name} {comment.user?.last_name}
                      </span>
                      <span>•</span>
                      <span>{formatDate(comment.created_at)}</span>
                    </div>

                    <p className="text-(--color-text) text-base leading-relaxed">
                      {comment.content}
                    </p>

                    <div className="flex items-center gap-4 text-xs text-(--color-body) mt-2">
                      {comment.car && (
                        <div className="flex items-center gap-1 bg-gray-100 px-2 py-1 rounded-md">
                          <span className="font-medium">Car:</span>
                          <span>
                            {comment.car.brand?.name}{' '}
                            {comment.car.car_model?.name}
                          </span>
                        </div>
                      )}
                      <div className="flex items-center gap-1">
                        <HeartIconSolid className="h-3 w-3 text-red-500" />
                        <span>{comment.likes_count} likes</span>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 md:self-start shrink-0">
                    <Button
                      variant="ghost"
                      size="sm"
                      className={`${
                        comment.flagged
                          ? 'text-red-600 bg-red-50 hover:bg-red-100'
                          : 'text-(--color-body) hover:text-red-600 hover:bg-red-50'
                      }`}
                      onClick={() =>
                        handleToggleFlag(comment.id, !!comment.flagged)
                      }
                      title={
                        comment.flagged ? 'Unflag Comment' : 'Flag Comment'
                      }
                    >
                      {comment.flagged ? (
                        <FlagIconSolid className="h-4 w-4" />
                      ) : (
                        <FlagIcon className="h-4 w-4" />
                      )}
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="text-(--color-body) hover:text-red-600 hover:bg-red-50"
                      onClick={() => handleDeleteClick(comment.id)}
                      title="Delete Comment"
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

        <DeleteCommentModal
          isOpen={isDeleteModalOpen}
          onClose={() => setIsDeleteModalOpen(false)}
          onConfirm={handleDeleteConfirm}
          isLoading={deleteCommentPending}
        />
      </div>
    </div>
  );
};

export default Comments;
