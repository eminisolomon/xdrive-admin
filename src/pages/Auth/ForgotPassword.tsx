import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import EmailIcon from '@mui/icons-material/Email';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import Button from '@/components/Button';
import Input from '@/components/Input';
import { useAuth } from '@/queries/useAuth';
import type { ForgotPasswordRequest } from '@/interfaces';
import xdriveLogo from '@/assets/xdrive.png';

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
    try {
      await forgotPassword(data);
      navigate('/verify-forgot-password');
    } catch (err) {
      console.error('Forgot password request failed:', err);
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
              Secure account recovery process
            </p>
          </div>

          {/* Right Column - Form */}
          <div className="bg-white flex flex-col justify-center items-center p-12">
            <div className="w-full max-w-md">
              {/* Back Button */}
              <button
                onClick={() => navigate('/')}
                className="inline-flex items-center gap-2 text-blue-600 hover:text-blue-700 mb-8 transition-colors font-medium"
              >
                <ArrowBackIcon fontSize="small" />
                <span className="text-sm">Back to Login</span>
              </button>

              <h2 className="text-3xl font-bold text-gray-900 mb-2">
                Forgot Password?
              </h2>
              <p className="text-gray-600 mb-8">
                Enter your email address and we'll send you a code to reset your
                password
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
                    errorMessage={errors.email?.message as string | undefined}
                    {...register('email', {
                      required: 'Email is required',
                      pattern: {
                        value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                        message: 'Invalid email address',
                      },
                    })}
                  />
                </div>

                {/* Submit Button */}
                <Button
                  fullWidth
                  loading={forgotPasswordStatus === 'pending'}
                  disabled={forgotPasswordStatus === 'pending'}
                  type="submit"
                >
                  Send Reset Code
                </Button>
              </form>

              {/* Error Alert */}
              {forgotPasswordError && (
                <div className="mt-6 bg-red-50 border border-red-200 rounded-lg p-4 text-sm text-red-700">
                  {forgotPasswordError.message ||
                    'Failed to send reset code. Please try again.'}
                </div>
              )}

              {/* Info Box */}
              <div className="mt-6 bg-blue-50 border border-blue-200 rounded-lg p-4">
                <p className="text-sm text-blue-900">
                  <strong>Tip:</strong> Check your email for the password reset
                  code. It may take a few minutes to arrive.
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

export default ForgotPassword;
