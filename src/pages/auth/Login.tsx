import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import {
  EnvelopeIcon,
  LockClosedIcon,
  EyeIcon,
  EyeSlashIcon,
} from '@heroicons/react/24/outline';
import AuthLayout from '@/components/Auth/AuthLayout';
import { useAuth } from '@/queries';
import type { LoginRequest } from '@/interfaces';
import { validateEmailDomain } from '@/shared';
import { useState } from 'react';
import { Button, Input } from '@/components';

const Login = () => {
  const navigate = useNavigate();
  const { login, loginStatus, loginError } = useAuth();
  const [showPassword, setShowPassword] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginRequest>();

  const onSubmit = async (data: LoginRequest) => {
    await login(data);
    navigate('/dashboard');
  };

  return (
    <AuthLayout
      title="Admin Dashboard"
      subtitle="Sign in to your administrative account"
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
            validate: validateEmailDomain,
          })}
        />

        <Input
          label="Password"
          type={showPassword ? 'text' : 'password'}
          placeholder="Enter your password"
          leftIcon={<LockClosedIcon className="h-5 w-5" />}
          rightIcon={
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="text-gray-500 hover:text-gray-700"
            >
              {showPassword ? (
                <EyeSlashIcon className="h-5 w-5" />
              ) : (
                <EyeIcon className="h-5 w-5" />
              )}
            </button>
          }
          errorMessage={errors.password?.message}
          {...register('password', { required: 'Password is required' })}
        />

        <div className="flex justify-between items-center">
          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="checkbox"
              className="w-4 h-4 rounded border-gray-300 text-blue-600"
            />
            <span className="text-sm text-gray-700">Keep me signed in</span>
          </label>
          <button
            type="button"
            onClick={() => navigate('/forgot-password')}
            className="text-sm text-blue-600 hover:text-blue-700 font-medium"
          >
            Forgot Password?
          </button>
        </div>

        <Button
          fullWidth
          size="lg"
          loading={loginStatus === 'pending'}
          type="submit"
        >
          Sign In
        </Button>

        {loginError && (
          <div className="p-4 bg-red-50 border border-red-200 rounded-xl text-sm text-red-700">
            {loginError.message || 'Login failed. Please try again.'}
          </div>
        )}
      </form>
    </AuthLayout>
  );
};

export default Login;
