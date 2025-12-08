import { useEffect, useState } from 'react';
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
    } catch (err) {
      console.error(err);
    }
  };

  const hasUpper = /[A-Z]/.test(password);
  const hasMinLength = password.length >= 8;

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
              Create a strong new password
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
                onClick={() => navigate(-1)}
                className="inline-flex items-center gap-2 text-blue-600 hover:text-blue-700 mb-8 font-medium"
              >
                <ArrowBackIcon fontSize="small" />
                Back
              </button>

              <h2 className="text-3xl font-bold text-gray-900 mb-2">
                Set new password
              </h2>
              <p className="text-base text-gray-600 mb-8">
                Your new password must be different from previous ones
              </p>

              <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                <div>
                  <Input
                    label="New Password"
                    type={showPass ? 'text' : 'password'}
                    placeholder="Enter new password"
                    icon={
                      <IconButton
                        onClick={() => setShowPass(!showPass)}
                        size="small"
                      >
                        {showPass ? (
                          <VisibilityOffIcon fontSize="small" />
                        ) : (
                          <VisibilityIcon fontSize="small" />
                        )}
                      </IconButton>
                    }
                    iconPosition="end"
                    {...register('password', {
                      required: 'Password is required',
                      minLength: { value: 8, message: 'Minimum 8 characters' },
                      pattern: {
                        value: /[A-Z]/,
                        message: 'At least one uppercase letter',
                      },
                    })}
                    errorMessage={errors.password?.message}
                  />
                </div>

                <div>
                  <Input
                    label="Confirm Password"
                    type={showConfirm ? 'text' : 'password'}
                    placeholder="Confirm new password"
                    icon={
                      <IconButton
                        onClick={() => setShowConfirm(!showConfirm)}
                        size="small"
                      >
                        {showConfirm ? (
                          <VisibilityOffIcon fontSize="small" />
                        ) : (
                          <VisibilityIcon fontSize="small" />
                        )}
                      </IconButton>
                    }
                    iconPosition="end"
                    {...register('password_confirmation', {
                      required: 'Please confirm password',
                      validate: (v) =>
                        v === password || 'Passwords do not match',
                    })}
                    errorMessage={errors.password_confirmation?.message}
                  />
                </div>

                <div className="space-y-2">
                  <div className="flex items-center gap-2 text-sm">
                    <CheckCircleIcon
                      fontSize="small"
                      className={
                        hasMinLength ? 'text-green-500' : 'text-gray-400'
                      }
                    />
                    <span
                      className={
                        hasMinLength ? 'text-green-700' : 'text-gray-500'
                      }
                    >
                      At least 8 characters
                    </span>
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <CheckCircleIcon
                      fontSize="small"
                      className={hasUpper ? 'text-green-500' : 'text-gray-400'}
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
                  loading={resetPasswordStatus === 'pending'}
                  disabled={resetPasswordStatus === 'pending'}
                  type="submit"
                >
                  Reset Password
                </Button>
              </form>

              {resetPasswordError && (
                <div className="mt-6 bg-red-50 border border-red-200 rounded-lg p-4 text-sm text-red-700">
                  {resetPasswordError.message || 'Failed to reset password'}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ResetPassword;
