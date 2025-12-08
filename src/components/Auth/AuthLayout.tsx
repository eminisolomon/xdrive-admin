import { ReactNode } from 'react';
import { ArrowLeftIcon } from '@heroicons/react/24/outline';
import { useNavigate } from 'react-router-dom';
import xdriveLogo from '@/assets/xdrive.png';

interface AuthLayoutProps {
  children: ReactNode;
  title: string;
  subtitle: string;
  backTo?: string;
}

const AuthLayout = ({ children, title, subtitle, backTo }: AuthLayoutProps) => {
  const navigate = useNavigate();
  const currentYear = new Date().getFullYear();

  return (
    <div className="min-h-screen bg-linear-to-r from-blue-600 to-blue-800 flex items-center justify-center">
      <div className="w-full">
        <div className="grid grid-cols-1 lg:grid-cols-2 min-h-screen">
          <div className="hidden lg:flex flex-col justify-center items-center p-12 text-white">
            <img
              src={xdriveLogo}
              alt="Xdrive"
              className="w-32 h-32 mb-8 object-contain"
            />
            <h1 className="text-5xl font-bold mb-4 text-center">
              Xdrive Automobile
            </h1>
            <p className="text-xl text-blue-100 mb-8 text-center">
              Xdrive Automobile Limited
            </p>
            <p className="text-lg text-blue-100 text-center max-w-md">
              {subtitle}
            </p>
          </div>

          <div className="bg-white flex flex-col justify-center px-6 py-12 lg:p-12">
            <div className="max-w-md mx-auto w-full">
              <div className="lg:hidden flex justify-center mb-8">
                <img src={xdriveLogo} alt="Xdrive" className="h-20 w-auto" />
              </div>

              {backTo && (
                <button
                  onClick={() => navigate(backTo)}
                  className="inline-flex items-center gap-2 text-blue-600 hover:text-blue-700 mb-8 font-medium transition-colors"
                >
                  <ArrowLeftIcon className="h-5 w-5" />
                  <span>Back</span>
                </button>
              )}

              <h2 className="text-3xl font-bold text-gray-900 mb-2">{title}</h2>
              <p className="text-gray-600 mb-8">{children}</p>

              <div className="mt-10 pt-8 border-t border-gray-200 text-center text-xs text-gray-500">
                © {currentYear} Xdrive Automobile Limited. All rights reserved.
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AuthLayout;
