import { useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
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
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    if (!email) navigate('/forgot-password', { replace: true });
  }, [email, navigate]);

  return (
    <div className="min-h-screen bg-linear-to-r from-blue-600 to-blue-800 flex items-center">
      <div className="w-full">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-0 min-h-screen">
          <div className="hidden lg:flex bg-linear-to-r from-blue-600 to-blue-800 flex-col justify-center items-center p-12 text-white">
            <div className="w-32 h-32 mb-8">
              <img
                src={xdriveLogo}
                alt="Xdrive"
                className="w-full h-full object-contain"
              />
            </div>
            <h1 className="text-5xl font-bold mb-4 text-center">
              Xdrive Automobile
            </h1>
            <p className="text-xl text-blue-100 text-center mb-8">
              Xdrive Automobile Limited
            </p>
            <p className="text-lg text-blue-100 text-center max-w-md">
              Two-step verification for enhanced security
            </p>
          </div>

          <div className="bg-white flex flex-col justify-center items-center p-6 sm:p-8 md:p-12">
            <div className="w-full max-w-md">
              <div className="lg:hidden flex justify-center mb-8">
                <div className="w-20 h-20">
                  <img
                    src={xdriveLogo}
                    alt="Xdrive"
                    className="w-full h-full object-contain"
                  />
                </div>
              </div>

              <button
                onClick={() => navigate('/forgot-password')}
                className="inline-flex items-center gap-2 text-blue-600 hover:text-blue-700 mb-8 transition-colors font-medium"
              >
                <ArrowBackIcon fontSize="small" />
                <span className="text-sm">Back</span>
              </button>

              <h2 className="text-3xl font-bold text-gray-900 mb-2">
                Check your email
              </h2>
              <p className="text-base text-gray-600 mb-8">
                We sent a 6-digit code to{' '}
                <span className="font-semibold">{email}</span>
              </p>

              <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                <Input
                  label="Enter verification code"
                  type="text"
                  placeholder="000000"
                  maxLength={6}
                  {...register('code', {
                    required: 'Code is required',
                    pattern: { value: /^\d{6}$/, message: 'Must be 6 digits' },
                  })}
                  errorMessage={errors.code?.message}
                />

                <Button
                  fullWidth
                  loading={verifyOtpStatus === 'pending'}
                  disabled={verifyOtpStatus === 'pending'}
                  type="submit"
                >
                  Continue
                </Button>
              </form>

              {verifyOtpError && (
                <div className="mt-6 bg-red-50 border border-red-200 rounded-lg p-4 text-sm text-red-700">
                  {verifyOtpError.message || 'Invalid or expired code'}
                </div>
              )}

              <p className="mt-6 text-center text-sm text-gray-600">
                Didn't receive it?{' '}
                <button
                  type="button"
                  onClick={() => navigate('/forgot-password')}
                  className="text-blue-600 font-medium hover:text-blue-700"
                >
                  Send again
                </button>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default VerifyForgotPassword;
