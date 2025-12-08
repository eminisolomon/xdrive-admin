import { useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import {
  LockClosedIcon,
  EyeIcon,
  EyeSlashIcon,
  CheckCircleIcon,
} from '@heroicons/react/24/outline';
import Button from '@/components/Button';
import Input from '@/components/Input';
import AuthLayout from '@/components/Auth/AuthLayout';
import { useAuth } from '@/queries/useAuth';

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
      password: '',
      password_confirmation: '',
    },
  });

  const password = watch('password');
  const hasUpper = /[A-Z]/.test(password);
  const hasMinLength = password.length >= 8;

  useEffect(() => {
    if (!state?.email || !state?.code) {
      navigate('/forgot-password', { replace: true });
    }
  }, [state, navigate]);

  const onSubmit = async (data: any) => {
    await resetPassword({
      email: state!.email,
      code: state!.code,
      password: data.password,
      password_confirmation: data.password_confirmation,
    });
    navigate('/', { replace: true });
  };

  return (
    <AuthLayout
      title="Set new password"
      subtitle="Create a strong new password"
      backTo="/verify-forgot-password"
    >
      <p className="mb-8 text-gray-600">
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
              className="text-gray-500 hover:text-gray-700"
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
              className="text-gray-500 hover:text-gray-700"
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
            <span className={hasMinLength ? 'text-green-700' : 'text-gray-500'}>
              At least 8 characters
            </span>
          </div>
          <div className="flex items-center gap-3 text-sm">
            <CheckCircleIcon
              className={`h-5 w-5 ${hasUpper ? 'text-green-500' : 'text-gray-400'}`}
            />
            <span className={hasUpper ? 'text-green-700' : 'text-gray-500'}>
              One uppercase letter
            </span>
          </div>
        </div>

        <Button
          fullWidth
          size="lg"
          loading={resetPasswordStatus === 'pending'}
          type="submit"
        >
          Reset Password
        </Button>

        {resetPasswordError && (
          <div className="p-4 bg-red-50 border border-red-200 rounded-xl text-sm text-red-700">
            {resetPasswordError.message || 'Failed to reset password'}
          </div>
        )}
      </form>
    </AuthLayout>
  );
};

export default ResetPassword;
