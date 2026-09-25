import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Link, useNavigate } from 'react-router-dom';
import { useRegisterMutation } from '@/store/api/authApi';
import { useAppDispatch } from '@/store';
import { setCredentials } from '@/store/authSlice';
import Button from '@/components/common/Button';
import Input from '@/components/common/Input';
import ErrorMessage from '@/components/common/ErrorMessage';
import BookHavenLogo from '@/components/common/BookHavenLogo';
import AuthPageShell from '@/components/layout/AuthPageShell';
import type { ApiError } from '@/types/api';

const schema = z.object({
  firstName: z.string().min(1, 'First name is required'),
  lastName:  z.string().min(1, 'Last name is required'),
  email:     z.string().email('Enter a valid email address'),
  password:  z.string().min(8, 'Password must be at least 8 characters'),
});
type FormValues = z.infer<typeof schema>;

export default function RegisterPage() {
  const dispatch  = useAppDispatch();
  const navigate  = useNavigate();
  const [register, { isLoading, error }] = useRegisterMutation();

  const {
    register: formRegister,
    handleSubmit,
    formState: { errors },
  } = useForm<FormValues>({ resolver: zodResolver(schema) });

  async function onSubmit(values: FormValues) {
    try {
      const result = await register(values).unwrap();
      dispatch(setCredentials({
        user:         result.user,
        accessToken:  result.accessToken,
        refreshToken: result.refreshToken,
      }));
      navigate('/');
    } catch {
      // shown via error below
    }
  }

  const errorMsg = error
    ? ((error as { data: ApiError }).data?.message ?? 'Registration failed. Please try again.')
    : undefined;

  return (
    <AuthPageShell>
    <div
      className="max-w-sm mx-auto"
      style={{ paddingTop: '48px', paddingBottom: '64px' }}
    >
      <div
        className="bg-white rounded-2xl shadow-md"
        style={{ border: '1px solid #E8E2D8', padding: '36px 32px 32px' }}
      >

        {/* Logo — centred, no link, no outline */}
        <div style={{ display: 'flex', justifyContent: 'center', marginBottom: 20 }}>
          <BookHavenLogo variant="auth" noLink />
        </div>

        {/* Heading */}
        <div className="text-center" style={{ marginBottom: 24 }}>
          <h1
            style={{
              fontSize: 22,
              fontWeight: 800,
              color: '#0F5132',
              fontFamily: 'Georgia, "Times New Roman", serif',
              lineHeight: 1.2,
              marginBottom: 4,
            }}
          >
            Create your account
          </h1>
          <p style={{ fontSize: 13.5, color: '#6B7280' }}>
            Join thousands of readers on BookHaven
          </p>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div className="grid grid-cols-2 gap-3">
            <Input label="First name" placeholder="Priya" error={errors.firstName?.message} {...formRegister('firstName')} />
            <Input label="Last name"  placeholder="Sharma" error={errors.lastName?.message}  {...formRegister('lastName')} />
          </div>
          <Input label="Email address" type="email" placeholder="you@example.com" autoComplete="email" error={errors.email?.message} {...formRegister('email')} />
          <Input label="Password"      type="password" placeholder="At least 8 characters" autoComplete="new-password" error={errors.password?.message} {...formRegister('password')} />

          <ErrorMessage message={errorMsg} />

          <Button type="submit" loading={isLoading} className="w-full">
            Create account
          </Button>
        </form>

        <p className="mt-5 text-sm text-center" style={{ color: '#6B7280' }}>
          Already have an account?{' '}
          <Link to="/login" className="hover:underline font-medium" style={{ color: '#0F5132' }}>Sign in</Link>
        </p>
      </div>
    </div>
    </AuthPageShell>
  );
}
