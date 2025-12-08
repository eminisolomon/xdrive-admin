interface LoadingProps {
  fullScreen?: boolean;
  message?: string;
}

const Loading: React.FC<LoadingProps> = ({
  fullScreen = false,
  message = 'Loading...',
}) => {
  const content = (
    <div className="flex flex-col items-center justify-center gap-4">
      <svg
        className="animate-spin h-12 w-12 text-(--color-primary)"
        viewBox="0 0 24 24"
        fill="none"
      >
        <circle
          className="opacity-25"
          cx="12"
          cy="12"
          r="10"
          stroke="currentColor"
          strokeWidth="4"
        />
        <path
          className="opacity-75"
          fill="currentColor"
          d="M4 12a8 8 0 018-8v8z"
        />
      </svg>
      {message && (
        <p className="text-sm font-medium text-(--color-body)">{message}</p>
      )}
    </div>
  );

  if (fullScreen) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-white/95 backdrop-blur-sm">
        {content}
      </div>
    );
  }

  return (
    <div className="flex min-h-48 items-center justify-center">{content}</div>
  );
};

export default Loading;
