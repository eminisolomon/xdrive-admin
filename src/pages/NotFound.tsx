import { useNavigate } from 'react-router-dom';
import { HomeIcon, MagnifyingGlassIcon } from '@heroicons/react/24/outline';
import Button from '@/components/Button';
import xdriveLogo from '@/assets/xdrive.png';

const NotFound = () => {
  const navigate = useNavigate();
  const currentYear = new Date().getFullYear();

  return (
    <div className="min-h-screen bg-white flex items-center justify-center">
      <div className="w-full max-w-2xl px-8 py-12 text-center">
        <div className="w-24 h-24 mx-auto mb-8">
          <img
            src={xdriveLogo}
            alt="Xdrive"
            className="w-full h-full object-contain"
          />
        </div>

        <MagnifyingGlassIcon className="h-20 w-20 mx-auto mb-6 text-(--color-primary)" />

        <h1 className="text-8xl font-bold text-gray-900 mb-4">404</h1>
        <h2 className="text-3xl font-bold text-gray-900 mb-4">
          Page Not Found
        </h2>
        <p className="text-lg text-gray-600 mb-10 max-w-md mx-auto">
          The page you're looking for doesn't exist or has been moved.
        </p>

        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Button
            onClick={() => navigate('/dashboard')}
            icon={<HomeIcon className="h-5 w-5" />}
            iconPosition="left"
            size="lg"
          >
            Go to Dashboard
          </Button>

          <button
            onClick={() => navigate(-1)}
            className="px-6 py-3 text-(--color-primary) hover:text-(--color-primary)/80 font-medium transition-colors"
          >
            Go Back
          </button>
        </div>

        <div className="mt-12 pt-8 border-t border-gray-200">
          <p className="text-sm text-gray-500 mb-2">
            Need help? Contact support at support@xdrive.com
          </p>
          <p className="text-xs text-gray-400">
            © {currentYear} Xdrive Automobile Limited. All rights reserved.
          </p>
        </div>
      </div>
    </div>
  );
};

export default NotFound;
