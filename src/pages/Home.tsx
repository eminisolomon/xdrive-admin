import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import EmailIcon from '@mui/icons-material/Email';
import VisibilityIcon from '@mui/icons-material/Visibility';
import VisibilityOffIcon from '@mui/icons-material/VisibilityOff';
import IconButton from '@mui/material/IconButton';
import Button from '@/components/Button';
import Input from '@/components/Input';
import { useAuth } from '@/queries/useAuth';
import type { LoginRequest } from '@/interfaces';
import xdriveLogo from '@/assets/xdrive.png';

const Home = () => {
  const navigate = useNavigate();
  const { login, loginStatus, loginError } = useAuth();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginRequest>();
  const [showPassword, setShowPassword] = useState(false);

  const onSubmit = async (data: LoginRequest) => {
    try {
      await login(data);
      navigate('/dashboard');
    } catch (err) {
      console.error('Login failed:', err);
    }
  };

  const getErrorMessage = (field: keyof LoginRequest) => {
    return errors[field]?.message as string | undefined;
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
              Manage your administrative operations with ease and security
            </p>
            <div className="mt-12 space-y-4">
              <div className="flex items-start gap-4">
                <div className="text-3xl">🔒</div>
                <div>
                  <h3 className="font-semibold text-lg">Secure</h3>
                  <p className="text-blue-100 text-sm">
                    Industry-leading encryption
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-4">
                <div className="text-3xl">⚡</div>
                <div>
                  <h3 className="font-semibold text-lg">Fast</h3>
                  <p className="text-blue-100 text-sm">
                    Lightning-quick performance
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-4">
                <div className="text-3xl">📊</div>
                <div>
                  <h3 className="font-semibold text-lg">Reliable</h3>
                  <p className="text-blue-100 text-sm">
                    Enterprise-grade stability
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column - Login Form */}
          <div className="bg-white flex flex-col justify-center items-center p-12">
            <div className="w-full max-w-md">
              <h2 className="text-3xl font-bold text-gray-900 mb-2">
                Admin Dashboard
              </h2>
              <p className="text-gray-600 mb-8">
                Sign in to your administrative account
              </p>

              <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
                {/* Email Input */}
                <div>
                  <Input
                    label="Email Address"
                    type="email"
                    placeholder="admin@example.com"
                    icon={<EmailIcon fontSize="small" />}
                    iconPosition="start"
                    errorMessage={getErrorMessage('email')}
                    {...register('email', {
                      required: 'Email is required',
                      pattern: {
                        value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                        message: 'Invalid email address',
                      },
                    })}
                  />
                </div>

                {/* Password Input */}
                <div>
                  <Input
                    label="Password"
                    type={showPassword ? 'text' : 'password'}
                    placeholder="Enter your password"
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
                    errorMessage={getErrorMessage('password')}
                    {...register('password', {
                      required: 'Password is required',
                      minLength: {
                        value: 6,
                        message: 'Password must be at least 6 characters',
                      },
                    })}
                  />
                </div>

                {/* Forgot Password Link */}
                <div className="flex justify-end">
                  <button
                    type="button"
                    onClick={() => navigate('/forgot-password')}
                    className="text-sm text-blue-600 hover:text-blue-700 font-medium transition-colors"
                  >
                    Forgot Password?
                  </button>
                </div>

                {/* Remember Me */}
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    className="w-4 h-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                  />
                  <span className="text-sm text-gray-700">
                    Keep me signed in
                  </span>
                </label>

                {/* Login Button */}
                <Button
                  fullWidth
                  loading={loginStatus === 'pending'}
                  disabled={loginStatus === 'pending'}
                  type="submit"
                >
                  Sign In
                </Button>
              </form>

              {/* Error Alert */}
              {loginError && (
                <div className="mt-6 bg-red-50 border border-red-200 rounded-lg p-4 text-sm text-red-700">
                  {loginError.message || 'Login failed. Please try again.'}
                </div>
              )}

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

export default Home;
