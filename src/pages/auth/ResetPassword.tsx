import { useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import {
  ArrowLeftIcon,
  LockClosedIcon,
  EyeIcon,
  EyeSlashIcon,
  CheckCircleIcon,
} from '@heroicons/react/24/outline';
import Button from '@/components/Button';
import Input from '@/components/Input';
import { useAuth } from '@/queries/useAuth';
import xdriveLogo from '@/assets/xdrive.png';

const ResetPassword = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { resetPassword, resetPasswordStatus, resetPasswordError } = useAuth();

  const state = location.state as { email: string; code: string } | null;
  const [showPass, setShowPass] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm({
    defaultValues: {
      email: state?.email || '',
      code: state?.code || '',
      password: '',
      password_confirmation: '',
    },
  });

  const password = watch('password');

  useEffect(() => {
    if (!state?.email || !state?.code) {
      navigate('/forgot-password', { replace: true });
    }
  }, [state, navigate]);

  const onSubmit = async (data: any) => {
    try {
      await resetPassword({
        email: state!.email,
        code: state!.code,
        password: data.password,
        password_confirmation: data.password_confirmation,
      });
      navigate('/', { replace: true });
    } catch {}
  };

  const hasUpper = /[A-Z]/.test(password);
  const hasMinLength = password.length >= 8;

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
              Create a strong new password
            </p>
          </div>

          <div className="bg-white flex flex-col justify-center px-6 py-12 lg:p-12">
            <div className="max-w-md mx-auto w-full">
              <div className="lg:hidden flex justify-center mb-8">
                <img src={xdriveLogo} alt="Xdrive" className="h-20 w-auto" />
              </div>

              <button
                onClick={() => navigate(-1)}
                className="inline-flex items-center gap-2 text-blue-600 hover:text-blue-700 mb-8 font-medium transition-colors"
              >
                <ArrowLeftIcon className="h-5 w-5" />
                <span>Back</span>
              </button>

              <h2 className="text-3xl font-bold text-gray-900 mb-2">
                Set new password
              </h2>
              <p className="text-gray-600 mb-8">
                Your new password must be different from previous ones
              </p>

              <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                <Input
                  label="New Password"
                  type={showPass ? 'text' : 'password'}
                  placeholder="Enter new password"
                  leftIcon={<LockClosedIcon className="h-5 w-5" />}
                  rightIcon={
                    <button
                      type="button"
                      onClick={() => setShowPass(!showPass)}
                      className="text-gray-500 hover:text-gray-700 transition-colors"
                    >
                      {showPass ? (
                        <EyeSlashIcon className="h-5 w-5" />
                      ) : (
                        <EyeIcon className="h-5 w-5" />
                      )}
                    </button>
                  }
                  errorMessage={errors.password?.message}
                  {...register('password', {
                    required: 'Password is required',
                    minLength: { value: 8, message: 'Minimum 8 characters' },
                    pattern: {
                      value: /[A-Z]/,
                      message: 'At least one uppercase letter',
                    },
                  })}
                />

                <Input
                  label="Confirm Password"
                  type={showConfirm ? 'text' : 'password'}
                  placeholder="Confirm new password"
                  leftIcon={<LockClosedIcon className="h-5 w-5" />}
                  rightIcon={
                    <button
                      type="button"
                      onClick={() => setShowConfirm(!showConfirm)}
                      className="text-gray-500 hover:text-gray-700 transition-colors"
                    >
                      {showConfirm ? (
                        <EyeSlashIcon className="h-5 w-5" />
                      ) : (
                        <EyeIcon className="h-5 w-5" />
                      )}
                    </button>
                  }
                  errorMessage={errors.password_confirmation?.message}
                  {...register('password_confirmation', {
                    required: 'Please confirm password',
                    validate: (v) => v === password || 'Passwords do not match',
                  })}
                />

                <div className="space-y-2">
                  <div className="flex items-center gap-3 text-sm">
                    <CheckCircleIcon
                      className={`h-5 w-5 ${hasMinLength ? 'text-green-500' : 'text-gray-400'}`}
                    />
                    <span
                      className={
                        hasMinLength ? 'text-green-700' : 'text-gray-500'
                      }
                    >
                      At least 8 characters
                    </span>
                  </div>
                  <div className="flex items-center gap-3 text-sm">
                    <CheckCircleIcon
                      className={`h-5 w-5 ${hasUpper ? 'text-green-500' : 'text-gray-400'}`}
                    />
                    <span
                      className={hasUpper ? 'text-green-700' : 'text-gray-500'}
                    >
                      One uppercase letter
                    </span>
                  </div>
                </div>

                <Button
                  fullWidth
                  size="lg"
                  loading={resetPasswordStatus === 'pending'}
                  disabled={resetPasswordStatus === 'pending'}
                  type="submit"
                >
                  Reset Password
                </Button>
              </form>

              {resetPasswordError && (
                <div className="mt-6 p-4 bg-red-50 border border-red-200 rounded-xl text-sm text-red-700">
                  {resetPasswordError.message || 'Failed to reset password'}
                </div>
              )}

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

export default ResetPassword;
