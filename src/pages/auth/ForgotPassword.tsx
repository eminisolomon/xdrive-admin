import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { ArrowLeftIcon, EnvelopeIcon } from '@heroicons/react/24/outline';
import Button from '@/components/Button';
import Input from '@/components/Input';
import { useAuth } from '@/queries/useAuth';
import type { ForgotPasswordRequest } from '@/interfaces';
import xdriveLogo from '@/assets/xdrive.png';

const ForgotPassword = () => {
  const navigate = useNavigate();
  const { forgotPassword, forgotPasswordStatus, forgotPasswordError } =
    useAuth();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ForgotPasswordRequest>();

  const onSubmit = async (data: ForgotPasswordRequest) => {
    try {
      await forgotPassword(data);
      navigate('/verify-forgot-password', { state: { email: data.email } });
    } catch (err) {
      console.error('Forgot password request failed:', err);
    }
  };

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
              Secure account recovery process
            </p>
          </div>

          <div className="bg-white flex flex-col justify-center px-6 py-12 lg:p-12">
            <div className="max-w-md mx-auto w-full">
              <div className="lg:hidden flex justify-center mb-8">
                <img src={xdriveLogo} alt="Xdrive" className="h-20 w-auto" />
              </div>

              <button
                onClick={() => navigate('/')}
                className="inline-flex items-center gap-2 text-blue-600 hover:text-blue-700 mb-8 font-medium transition-colors"
              >
                <ArrowLeftIcon className="h-5 w-5" />
                <span>Back to Login</span>
              </button>

              <h2 className="text-3xl font-bold text-gray-900 mb-2">
                Forgot Password?
              </h2>
              <p className="text-gray-600 mb-8">
                Enter your email address and we'll send you a code to reset your
                password
              </p>

              <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                <Input
                  label="Email Address"
                  type="email"
                  placeholder="admin@example.com"
                  leftIcon={<EnvelopeIcon className="h-5 w-5" />}
                  errorMessage={errors.email?.message}
                  {...register('email', {
                    required: 'Email is required',
                    pattern: {
                      value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                      message: 'Invalid email address',
                    },
                  })}
                />

                <Button
                  fullWidth
                  size="lg"
                  loading={forgotPasswordStatus === 'pending'}
                  disabled={forgotPasswordStatus === 'pending'}
                  type="submit"
                >
                  Send Reset Code
                </Button>
              </form>

              {forgotPasswordError && (
                <div className="mt-6 p-4 bg-red-50 border border-red-200 rounded-xl text-sm text-red-700">
                  {forgotPasswordError.message ||
                    'Failed to send reset code. Please try again.'}
                </div>
              )}

              <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-xl">
                <p className="text-sm text-blue-900">
                  <strong>Tip:</strong> Check your email for the password reset
                  code. It may take a few minutes to arrive.
                </p>
              </div>

              <div className="mt-10 pt-8 border-t border-gray-200 text-center text-xs text-gray-500">
                © 2025 Xdrive Automobile Limited. All rights reserved.
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ForgotPassword;
