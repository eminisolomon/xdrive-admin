import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { EnvelopeIcon } from '@heroicons/react/24/outline';
import Button from '@/components/Button';
import Input from '@/components/Input';
import AuthLayout from '@/components/Auth/AuthLayout';
import { useAuth } from '@/queries/useAuth';
import type { ForgotPasswordRequest } from '@/interfaces';

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
    await forgotPassword(data);
    navigate('/verify-forgot-password', { state: { email: data.email } });
  };

  return (
    <AuthLayout
      title="Forgot Password?"
      subtitle="Secure account recovery process"
      backTo="/"
    >
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
          type="submit"
        >
          Send Reset Code
        </Button>

        {forgotPasswordError && (
          <div className="p-4 bg-red-50 border border-red-200 rounded-xl text-sm text-red-700">
            {forgotPasswordError.message || 'Failed to send reset code'}
          </div>
        )}

        <div className="p-4 bg-blue-50 border border-blue-200 rounded-xl text-sm text-blue-900">
          <strong>Tip:</strong> Check your email for the password reset code. It
          may take a few minutes.
        </div>
      </form>
    </AuthLayout>
  );
};

export default ForgotPassword;
