import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Link, useNavigate } from '@tanstack/react-router';
import { InteractiveHoverButton } from '@/components/magicui/interactive-hover-button';
import { Mail, Lock, ArrowRight } from 'lucide-react';
import { ErrorAlert } from './ErrorAlert';
import { IconFormField } from './IconFormField';
import { Checkbox } from './Checkbox';
import { OrDivider } from './OrDivider';
import { GoogleSignInButton } from './button/GoogleButton';
import { PasswordFieldWithIcon } from './PasswordFieldWithIcon';
import { useAuth } from '@/hooks/useAuth';
import useToast from '@/hooks/useToast';
import { DemoHelper } from '../demo/DemoHelper';
import { mockAuthApi } from '../../api/mockAuth';

export function LoginForm() {
  const { login, refreshUser } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();

  // Demo mode - set to true for presentations
  const DEMO_MODE =
    process.env.NODE_ENV === 'development' ||
    window.location.search.includes('demo=true');

  const [form, setForm] = useState({ email: '', password: '' });
  const [errors, setErrors] = useState({
    email: '',
    password: '',
    general: '',
  });
  const [isLoading, setIsLoading] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);

  const validateEmail = (email: string) =>
    /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    const { name, value } = e.target;
    setForm({ ...form, [name]: value });
    setErrors({ ...errors, [name]: '', general: '' });
  }

  function validateForm() {
    const newErrors = { email: '', password: '', general: '' };
    let isValid = true;

    if (!validateEmail(form.email)) {
      newErrors.email = 'Please enter a valid email address';
      isValid = false;
    }
    if (!form.password) {
      newErrors.password = 'Please enter your password';
      isValid = false;
    }
    setErrors(newErrors);
    return isValid;
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!validateForm()) return;

    setIsLoading(true);
    setErrors({ ...errors, general: '' });
    try {
      let result;
      if (DEMO_MODE) {
        // Use mock API for demo
        result = await mockAuthApi.login({
          email: form.email,
          password: form.password,
        });
        // Simulate successful login for demo
        if (result?.status === 'success') {
          await refreshUser();
          toast.success({
            title: 'Success!',
            message: 'Logged in successfully!',
            autoClose: 3000,
            position: 'top-right',
          });
          navigate({ to: '/dashboard' });
        } else if (result?.message) {
          throw new Error(result.message);
        }
      } else {
        // Use real API
        result = await login({
          email: form.email,
          password: form.password,
        });
        // Check if result has status property and is successful
        if (
          result &&
          typeof result === 'object' &&
          'status' in result &&
          (result as { status: string }).status === 'success'
        ) {
          await refreshUser();
          toast.success({
            title: 'Success!',
            message: 'Logged in successfully!',
            autoClose: 3000,
            position: 'top-right',
          });
          navigate({ to: '/dashboard' });
        }
      }
    } catch (error: unknown) {
      const errorMessage =
        error instanceof Error
          ? error.message
          : 'Login failed. Please try again.';
      setErrors({
        ...errors,
        general: errorMessage,
      });
      toast.error({
        title: 'Error!',
        message: errorMessage,
        autoClose: 3000,
        position: 'top-right',
      });
    } finally {
      setIsLoading(false);
    }
  }

  function handleGoogleSignIn() {
    // Implement Google OAuth sign-in
    console.log('Signing in with Google...');
  }

  const forgotPasswordLink = (
    <a
      href="/forgot-password"
      className="text-sm text-blue-600 hover:text-blue-800"
    >
      Forgot password?
    </a>
  );

  return (
    <div className="flex flex-col items-center justify-center min-h-svh p-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-6">
          <h1 className="text-3xl font-bold mb-2">lootopia</h1>
          <p className="text-gray-600">Sign in to access your account</p>
          {DEMO_MODE && (
            <div className="mt-2 px-3 py-1 bg-yellow-100 text-yellow-800 text-sm rounded-md">
              Demo Mode Active
            </div>
          )}
        </div>

        {DEMO_MODE && <DemoHelper />}

        <ErrorAlert message={errors.general} />

        <form
          onSubmit={handleSubmit}
          className="flex flex-col gap-5 w-full p-8 bg-white rounded-xl shadow-lg"
        >
          <IconFormField
            id="email"
            name="email"
            type="email"
            label="Email"
            value={form.email}
            onChange={handleChange}
            required
            autoComplete="email"
            placeholder="your.email@example.com"
            error={errors.email}
            icon={<Mail size={18} />}
          />

          <PasswordFieldWithIcon
            id="password"
            name="password"
            label="Password"
            value={form.password}
            onChange={handleChange}
            required
            autoComplete="current-password"
            placeholder="Enter your password"
            error={errors.password}
            icon={<Lock size={18} />}
            labelRight={forgotPasswordLink}
          />

          <Checkbox
            id="remember-me"
            name="remember-me"
            label="Remember me"
            checked={rememberMe}
            onChange={(e) => setRememberMe(e.target.checked)}
          />

          <Button
            type="submit"
            disabled={isLoading}
            className="flex items-center justify-center gap-2 mt-2"
          >
            {isLoading ? 'Signing in...' : 'Sign in'}
            {!isLoading && <ArrowRight size={16} />}
          </Button>

          <OrDivider />

          <GoogleSignInButton onClick={handleGoogleSignIn} />
        </form>

        <div className="mt-6 text-center">
          <Link to="/signup" className="text-sm text-gray-600">
            <InteractiveHoverButton>
              Don't have an account? Create one
            </InteractiveHoverButton>
          </Link>
        </div>
      </div>
    </div>
  );
}
