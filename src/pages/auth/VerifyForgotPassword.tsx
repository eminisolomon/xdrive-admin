import { useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import Button from '@/components/Button';
import Input from '@/components/Input';
import AuthLayout from '@/components/Auth/AuthLayout';
import { useAuth } from '@/queries/useAuth';
import type { VerifyForgotPasswordRequest } from '@/interfaces';

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
    await verifyOtp({ email, code: data.code });
    navigate('/reset-password', { state: { email, code: data.code } });
  };

  useEffect(() => {
    if (!email) navigate('/forgot-password', { replace: true });
  }, [email, navigate]);

  return (
    <AuthLayout
      title="Check your email"
      subtitle="Two-step verification for enhanced security"
      backTo="/forgot-password"
    >
      <p className="mb-8 text-gray-600">
        We sent a 6-digit code to <span className="font-semibold">{email}</span>
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
          type="submit"
        >
          Continue
        </Button>

        {verifyOtpError && (
          <div className="p-4 bg-red-50 border border-red-200 rounded-xl text-sm text-red-700">
            {verifyOtpError.message || 'Invalid or expired code'}
          </div>
        )}

        <p className="text-center text-sm text-gray-600">
          Didn’t receive it?{' '}
          <button
            type="button"
            onClick={() => navigate('/forgot-password')}
            className="text-blue-600 font-medium hover:text-blue-700"
          >
            Send again
          </button>
        </p>
      </form>
    </AuthLayout>
  );
};

export default VerifyForgotPassword;
