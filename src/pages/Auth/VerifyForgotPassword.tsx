import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import Button from '@/components/Button';
import Input from '@/components/Input';
import { useAuth } from '@/queries/useAuth';
import type { VerifyForgotPasswordRequest } from '@/interfaces';
import xdriveLogo from '@/assets/xdrive.png';

const VerifyForgotPassword = () => {
  const navigate = useNavigate();
  const { verifyOtp, verifyOtpStatus, verifyOtpError } = useAuth();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<VerifyForgotPasswordRequest>();
  const [email] = useState(() => {
    const params = new URLSearchParams(window.location.search);
    return params.get('email') || '';
  });

  const onSubmit = async (data: VerifyForgotPasswordRequest) => {
    try {
      await verifyOtp(data);
      navigate('/reset-password', { state: { email: data.email } });
    } catch (err) {
      console.error('OTP verification failed:', err);
    }
  };

  return (
    <div className="min-h-screen bg-linear-to-r from-blue-600 to-blue-800 flex items-center">
      <div className="w-full">
        <div className="grid grid-cols-2 gap-0 min-h-screen">
          {/* Left Column - Branding */}
          <div className="bg-linear-to-br from-blue-600 to-blue-800 flex flex-col justify-center items-center p-12 text-white">
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

          {/* Right Column - Form */}
          <div className="bg-white flex flex-col justify-center items-center p-12">
            <div className="w-full max-w-md">
              {/* Back Button */}
              <button
                onClick={() => navigate('/forgot-password')}
                className="inline-flex items-center gap-2 text-blue-600 hover:text-blue-700 mb-8 transition-colors font-medium"
              >
                <ArrowBackIcon fontSize="small" />
                <span className="text-sm">Back</span>
              </button>

              <h2 className="text-3xl font-bold text-gray-900 mb-2">
                Verify Code
              </h2>
              <p className="text-gray-600 mb-8">
                We've sent a verification code to your email address
              </p>

              <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
                {/* Email Input */}
                <div>
                  <Input
                    label="Email Address"
                    type="email"
                    defaultValue={email}
                    placeholder="admin@example.com"
                    {...register('email', {
                      required: 'Email is required',
                      pattern: {
                        value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                        message: 'Invalid email address',
                      },
                    })}
                    errorMessage={errors.email?.message as string | undefined}
                  />
                </div>

                {/* OTP Input */}
                <div>
                  <Input
                    label="Verification Code"
                    type="text"
                    placeholder="Enter 6-digit code"
                    maxLength={6}
                    {...register('code', {
                      required: 'Verification code is required',
                      minLength: {
                        value: 6,
                        message: 'Code must be 6 digits',
                      },
                      maxLength: {
                        value: 6,
                        message: 'Code must be 6 digits',
                      },
                    })}
                    errorMessage={errors.code?.message as string | undefined}
                  />
                </div>

                {/* Submit Button */}
                <Button
                  fullWidth
                  loading={verifyOtpStatus === 'pending'}
                  disabled={verifyOtpStatus === 'pending'}
                  type="submit"
                >
                  Verify Code
                </Button>
              </form>

              {/* Error Alert */}
              {verifyOtpError && (
                <div className="mt-6 bg-red-50 border border-red-200 rounded-lg p-4 text-sm text-red-700">
                  {verifyOtpError.message || 'Invalid code. Please try again.'}
                </div>
              )}

              {/* Resend Link */}
              <div className="mt-6 pt-6 border-t border-gray-200 text-center">
                <p className="text-sm text-gray-600">
                  Didn't receive the code?{' '}
                  <button
                    type="button"
                    onClick={() => navigate('/forgot-password')}
                    className="text-blue-600 hover:text-blue-700 font-medium transition-colors"
                  >
                    Request a new one
                  </button>
                </p>
              </div>

              {/* Footer */}
              <div className="mt-8 pt-8 border-t border-gray-200 text-center text-xs text-gray-500">
                <p>© 2025 Xdrive Automobile Limited. All rights reserved.</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default VerifyForgotPassword;
