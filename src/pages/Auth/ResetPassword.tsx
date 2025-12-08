import { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import VisibilityIcon from '@mui/icons-material/Visibility';
import VisibilityOffIcon from '@mui/icons-material/VisibilityOff';
import IconButton from '@mui/material/IconButton';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import Button from '@/components/Button';
import Input from '@/components/Input';
import { useAuth } from '@/queries/useAuth';
import type { ResetPasswordRequest } from '@/interfaces';
import xdriveLogo from '@/assets/xdrive.png';

const ResetPassword = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { resetPassword, resetPasswordStatus, resetPasswordError } = useAuth();
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<ResetPasswordRequest>();
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const password = watch('password');

  const onSubmit = async (data: ResetPasswordRequest) => {
    try {
      await resetPassword(data);
      navigate('/');
    } catch (err) {
      console.error('Password reset failed:', err);
    }
  };

  const isPasswordStrong =
    password && password.length >= 8 && /[A-Z]/.test(password);

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
              Secure password reset process
            </p>
          </div>

          {/* Right Column - Form */}
          <div className="bg-white flex flex-col justify-center items-center p-12">
            <div className="w-full max-w-md">
              {/* Back Button */}
              <button
                onClick={() => navigate('/verify-forgot-password')}
                className="inline-flex items-center gap-2 text-blue-600 hover:text-blue-700 mb-8 transition-colors font-medium"
              >
                <ArrowBackIcon fontSize="small" />
                <span className="text-sm">Back</span>
              </button>

              <h2 className="text-3xl font-bold text-gray-900 mb-2">
                Reset Password
              </h2>
              <p className="text-gray-600 mb-8">
                Create a new strong password for your account
              </p>

              <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
                {/* Email (read-only) */}
                <div>
                  <Input
                    label="Email Address"
                    type="email"
                    disabled
                    defaultValue={(location.state?.email as string) || ''}
                  />
                </div>

                {/* Code Input */}
                <div>
                  <Input
                    label="Reset Code"
                    type="text"
                    placeholder="Enter the code from your email"
                    {...register('code', {
                      required: 'Reset code is required',
                    })}
                    errorMessage={errors.code?.message as string | undefined}
                  />
                </div>

                {/* New Password Input */}
                <div>
                  <Input
                    label="New Password"
                    type={showPassword ? 'text' : 'password'}
                    placeholder="Create a strong password"
                    icon={
                      <IconButton
                        size="small"
                        onClick={() => setShowPassword(!showPassword)}
                        edge="end"
                        sx={{ mr: -1 }}
                      >
                        {showPassword ? (
                          <VisibilityOffIcon fontSize="small" />
                        ) : (
                          <VisibilityIcon fontSize="small" />
                        )}
                      </IconButton>
                    }
                    iconPosition="end"
                    errorMessage={
                      errors.password?.message as string | undefined
                    }
                    {...register('password', {
                      required: 'Password is required',
                      minLength: {
                        value: 8,
                        message: 'Password must be at least 8 characters',
                      },
                      pattern: {
                        value: /^(?=.*[A-Z])/,
                        message:
                          'Password must contain at least one uppercase letter',
                      },
                    })}
                  />
                  {/* Password Strength Indicator */}
                  {password && (
                    <div className="mt-2 flex items-center gap-2">
                      <div className="flex-1 bg-gray-200 rounded-full h-2">
                        <div
                          className={`h-2 rounded-full transition-all ${
                            isPasswordStrong
                              ? 'bg-green-500 w-full'
                              : 'bg-yellow-500 w-2/3'
                          }`}
                        />
                      </div>
                      <span
                        className={`text-xs font-medium ${
                          isPasswordStrong
                            ? 'text-green-600'
                            : 'text-yellow-600'
                        }`}
                      >
                        {isPasswordStrong ? 'Strong' : 'Good'}
                      </span>
                    </div>
                  )}
                </div>

                {/* Confirm Password Input */}
                <div>
                  <Input
                    label="Confirm Password"
                    type={showConfirmPassword ? 'text' : 'password'}
                    placeholder="Re-enter your password"
                    icon={
                      <IconButton
                        size="small"
                        onClick={() =>
                          setShowConfirmPassword(!showConfirmPassword)
                        }
                        edge="end"
                        sx={{ mr: -1 }}
                      >
                        {showConfirmPassword ? (
                          <VisibilityOffIcon fontSize="small" />
                        ) : (
                          <VisibilityIcon fontSize="small" />
                        )}
                      </IconButton>
                    }
                    iconPosition="end"
                    errorMessage={
                      errors.password_confirmation?.message as
                        | string
                        | undefined
                    }
                    {...register('password_confirmation', {
                      required: 'Please confirm your password',
                      validate: (value) =>
                        value === password || 'Passwords do not match',
                    })}
                  />
                </div>

                {/* Submit Button */}
                <Button
                  fullWidth
                  loading={resetPasswordStatus === 'pending'}
                  disabled={resetPasswordStatus === 'pending'}
                  type="submit"
                >
                  Reset Password
                </Button>
              </form>

              {/* Error Alert */}
              {resetPasswordError && (
                <div className="mt-6 bg-red-50 border border-red-200 rounded-lg p-4 text-sm text-red-700">
                  {resetPasswordError.message ||
                    'Failed to reset password. Please try again.'}
                </div>
              )}

              {/* Password Requirements */}
              <div className="mt-6 bg-gray-50 border border-gray-200 rounded-lg p-4 space-y-3">
                <p className="text-sm font-medium text-gray-900">
                  Password requirements:
                </p>
                <ul className="space-y-2 text-sm">
                  <li className="flex items-center gap-2 text-gray-700">
                    <CheckCircleIcon
                      fontSize="small"
                      className={
                        password && password.length >= 8
                          ? 'text-green-500'
                          : 'text-gray-400'
                      }
                    />
                    At least 8 characters
                  </li>
                  <li className="flex items-center gap-2 text-gray-700">
                    <CheckCircleIcon
                      fontSize="small"
                      className={
                        password && /[A-Z]/.test(password)
                          ? 'text-green-500'
                          : 'text-gray-400'
                      }
                    />
                    One uppercase letter
                  </li>
                  <li className="flex items-center gap-2 text-gray-700">
                    <CheckCircleIcon
                      fontSize="small"
                      className={
                        password && password === watch('password_confirmation')
                          ? 'text-green-500'
                          : 'text-gray-400'
                      }
                    />
                    Passwords match
                  </li>
                </ul>
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

export default ResetPassword;
