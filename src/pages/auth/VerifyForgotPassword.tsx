import { useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { ArrowLeftIcon } from '@heroicons/react/24/outline';
import Button from '@/components/Button';
import Input from '@/components/Input';
import { useAuth } from '@/queries/useAuth';
import type { VerifyForgotPasswordRequest } from '@/interfaces';
import xdriveLogo from '@/assets/xdrive.png';

const VerifyForgotPassword = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { verifyOtp, verifyOtpStatus, verifyOtpError } = useAuth();

  const email = (location.state as { email?: string } | null)?.email || '';

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<Pick<VerifyForgotPasswordRequest, 'code'> & { email: string }>({
    defaultValues: { email },
  });

  const onSubmit = async (data: { code: string }) => {
    try {
      await verifyOtp({ email, code: data.code });
      navigate('/reset-password', { state: { email, code: data.code } });
    } catch {}
  };

  useEffect(() => {
    if (!email) navigate('/forgot-password', { replace: true });
  }, [email, navigate]);

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
              Two-step verification for enhanced security
            </p>
          </div>

          <div className="bg-white flex flex-col justify-center px-6 py-12 lg:p-12">
            <div className="max-w-md mx-auto w-full">
              <div className="lg:hidden flex justify-center mb-8">
                <img src={xdriveLogo} alt="Xdrive" className="h-20 w-auto" />
              </div>

              <button
                onClick={() => navigate('/forgot-password')}
                className="inline-flex items-center gap-2 text-blue-600 hover:text-blue-700 mb-8 font-medium transition-colors"
              >
                <ArrowLeftIcon className="h-5 w-5" />
                <span>Back</span>
              </button>

              <h2 className="text-3xl font-bold text-gray-900 mb-2">
                Check your email
              </h2>
              <p className="text-gray-600 mb-8">
                We sent a 6-digit code to{' '}
                <span className="font-semibold">{email}</span>
              </p>

              <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                <Input
                  label="Enter verification code"
                  type="text"
                  placeholder="000000"
                  maxLength={6}
                  errorMessage={errors.code?.message}
                  {...register('code', {
                    required: 'Code is required',
                    pattern: { value: /^\d{6}$/, message: 'Must be 6 digits' },
                  })}
                />

                <Button
                  fullWidth
                  size="lg"
                  loading={verifyOtpStatus === 'pending'}
                  disabled={verifyOtpStatus === 'pending'}
                  type="submit"
                >
                  Continue
                </Button>
              </form>

              {verifyOtpError && (
                <div className="mt-6 p-4 bg-red-50 border border-red-200 rounded-xl text-sm text-red-700">
                  {verifyOtpError.message || 'Invalid or expired code'}
                </div>
              )}

              <p className="mt-6 text-center text-sm text-gray-600">
                Didn’t receive it?{' '}
                <button
                  type="button"
                  onClick={() => navigate('/forgot-password')}
                  className="text-blue-600 font-medium hover:text-blue-700"
                >
                  Send again
                </button>
              </p>

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

export default VerifyForgotPassword;
