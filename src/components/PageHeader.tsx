import { Helmet } from 'react-helmet-async';
import { ArrowLeftIcon } from '@heroicons/react/24/outline';
import { useNavigate } from 'react-router-dom';

interface PageHeaderProps {
  title: string;
  breadcrumb?: string;
  backTo?: string;
  browserTitle?: string;
}

const PageHeader: React.FC<PageHeaderProps> = ({
  title,
  breadcrumb,
  backTo,
  browserTitle,
}) => {
  const navigate = useNavigate();
  const pageTitle = browserTitle || title;

  const handleBack = () => {
    if (backTo) navigate(backTo);
    else navigate(-1);
  };

  return (
    <>
      <Helmet>
        <title>{pageTitle} | Xdrive Admin</title>
      </Helmet>

      <div className="pt-8 pb-12 border-b border-(--color-border)/40">
        {breadcrumb && (
          <div className="flex items-center gap-2 text-sm text-(--color-body) mb-4">
            <button
              onClick={handleBack}
              className="flex items-center gap-1.5 hover:text-(--color-primary) transition-colors font-medium"
            >
              <ArrowLeftIcon className="h-4 w-4" />
              Back
            </button>
            <span className="text-(--color-inactive)">/</span>
            <span className="text-(--color-inactive)">{breadcrumb}</span>
          </div>
        )}

        <h1 className="text-4xl md:text-5xl font-extrabold text-(--color-text) tracking-tight leading-tight">
          {title}
        </h1>

        <div className="mt-6 h-1.5 w-28 bg-(--color-primary) rounded-full" />
      </div>
    </>
  );
};

export default PageHeader;
