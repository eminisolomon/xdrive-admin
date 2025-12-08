import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import {
  EyeIcon,
  EyeSlashIcon,
  EnvelopeIcon,
  LockClosedIcon,
} from '@heroicons/react/24/outline';
import Button from '@/components/Button';
import Input from '@/components/Input';
import { useAuth } from '@/queries/useAuth';
import type { LoginRequest } from '@/interfaces';
import xdriveLogo from '@/assets/xdrive.png';

const Home = () => {
  const navigate = useNavigate();
  const { login, loginStatus, loginError } = useAuth();
  const [showPassword, setShowPassword] = useState(false);
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginRequest>();

  const onSubmit = async (data: LoginRequest) => {
    try {
      await login(data);
      navigate('/dashboard');
    } catch (err) {
      console.error('Login failed:', err);
    }
  };

  return (
    <div className="min-h-screen bg-linear-to-r from-blue-600 to-blue-800 flex items-center justify-center">
      <div className="w-full">
        <div className="grid grid-cols-1 lg:grid-cols-2 min-h-screen">
          {/* Left - Branding (Desktop only) */}
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
            <p className="text-lg text-blue-100 text-center max-w-md mb-12">
              Manage your administrative operations with ease and security
            </p>
            <div className="space-y-6">
              {[
                {
                  emoji: 'Lock',
                  title: 'Secure',
                  desc: 'Industry-leading encryption',
                },
                {
                  emoji: 'Lightning',
                  title: 'Fast',
                  desc: 'Lightning-quick performance',
                },
                {
                  emoji: 'Chart',
                  title: 'Reliable',
                  desc: 'Enterprise-grade stability',
                },
              ].map((item) => (
                <div key={item.title} className="flex items-start gap-4">
                  <div className="text-4xl">{item.emoji}</div>
                  <div>
                    <h3 className="font-semibold text-lg">{item.title}</h3>
                    <p className="text-blue-100 text-sm">{item.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Right - Login Form */}
          <div className="bg-white flex flex-col justify-center px-6 py-12 lg:p-12">
            <div className="max-w-md mx-auto w-full">
              {/* Mobile Logo */}
              <div className="lg:hidden flex justify-center mb-8">
                <img src={xdriveLogo} alt="Xdrive" className="h-20 w-auto" />
              </div>

              <h2 className="text-3xl font-bold text-gray-900 mb-2">
                Admin Dashboard
              </h2>
              <p className="text-gray-600 mb-8">
                Sign in to your administrative account
              </p>

              <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
                {/* Email */}
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

                {/* Password */}
                <Input
                  label="Password"
                  type={showPassword ? 'text' : 'password'}
                  placeholder="Enter your password"
                  leftIcon={<LockClosedIcon className="h-5 w-5" />}
                  rightIcon={
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="text-gray-500 hover:text-gray-700 transition-colors"
                    >
                      {showPassword ? (
                        <EyeSlashIcon className="h-5 w-5" />
                      ) : (
                        <EyeIcon className="h-5 w-5" />
                      )}
                    </button>
                  }
                  errorMessage={errors.password?.message}
                  {...register('password', {
                    required: 'Password is required',
                    minLength: {
                      value: 6,
                      message: 'Password must be at least 6 characters',
                    },
                  })}
                />

                {/* Forgot Password */}
                <div className="flex justify-end">
                  <button
                    type="button"
                    onClick={() => navigate('/forgot-password')}
                    className="text-sm text-blue-600 hover:text-blue-700 font-medium"
                  >
                    Forgot Password?
                  </button>
                </div>

                {/* Remember Me */}
                <label className="flex items-center gap-3 cursor-pointer">
                  <input
                    type="checkbox"
                    className="w-4 h-4 rounded border-gray-300 text-blue-600"
                  />
                  <span className="text-sm text-gray-700">
                    Keep me signed in
                  </span>
                </label>

                {/* Submit */}
                <Button
                  fullWidth
                  variant="primary"
                  size="lg"
                  loading={loginStatus === 'pending'}
                  disabled={loginStatus === 'pending'}
                  type="submit"
                >
                  Sign In
                </Button>
              </form>

              {/* Error */}
              {loginError && (
                <div className="mt-6 p-4 bg-red-50 border border-red-200 rounded-xl text-sm text-red-700">
                  {loginError.message || 'Login failed. Please try again.'}
                </div>
              )}

              {/* Footer */}
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

export default Home;
