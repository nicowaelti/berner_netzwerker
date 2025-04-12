'use client';

import { useState } from 'react';
import type { ExtendedFirebaseError } from '@/lib/types/firebase';
import Link from 'next/link';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { resetUserPassword } from '@/lib/firebase/auth';
import { LoadingSpinner } from '@/components/ui/loading';

const forgotPasswordSchema = z.object({
  email: z.string().email('Invalid email address'),
});

type ForgotPasswordFormData = z.infer<typeof forgotPasswordSchema>;

export default function ForgotPasswordPage() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ForgotPasswordFormData>({
    resolver: zodResolver(forgotPasswordSchema),
  });

  const onSubmit = async (data: ForgotPasswordFormData) => {
    try {
      setLoading(true);
      setError('');
      await resetUserPassword(data.email);
      setSuccess(true);
    } catch (err) {
      if ((err as ExtendedFirebaseError).code === 'auth/user-not-found') {
        setError('No account found with this email address.');
        return;
      }
      console.error('Password reset error:', err);
      setError('Password reset failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <>
        <h1 className="mt-6 text-center text-3xl font-bold tracking-tight text-gray-900">
          Check your email
        </h1>
        <p className="mt-2 text-center text-sm text-gray-600">
          We&apos;ve sent you a link to reset your password.
        </p>
        <div className="mt-8">
          <Link
            href="/login"
            className="flex w-full justify-center rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
          >
            Back to login
          </Link>
        </div>
      </>
    );
  }

  return (
    <>
      <h1 className="mt-6 text-center text-3xl font-bold tracking-tight text-gray-900">
        Reset your password
      </h1>
      <p className="mt-2 text-center text-sm text-gray-600">
        Enter your email address and we&apos;ll send you a link to reset your
        password.
      </p>

      <div className="mt-8">
        <div className="bg-white px-4 py-8 shadow sm:rounded-lg sm:px-10">
          <form className="space-y-6" onSubmit={handleSubmit(onSubmit)}>
            <div>
              <label
                htmlFor="email"
                className="block text-sm font-medium text-gray-700"
              >
                Email
              </label>
              <div className="mt-1">
                <input
                  {...register('email')}
                  type="email"
                  className="block w-full rounded-lg border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                />
                {errors.email && (
                  <p className="mt-1 text-sm text-red-600">
                    {errors.email.message}
                  </p>
                )}
              </div>
            </div>

            {error && (
              <div className="rounded-md bg-red-50 p-4">
                <p className="text-sm text-red-600">{error}</p>
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="flex w-full justify-center rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50"
            >
              {loading ? (
                <LoadingSpinner className="h-5 w-5 text-white" />
              ) : (
                'Send reset link'
              )}
            </button>
          </form>

          <div className="mt-6">
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-300" />
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="bg-white px-2 text-gray-500">
                  Remember your password?
                </span>
              </div>
            </div>

            <div className="mt-6">
              <Link
                href="/login"
                className="flex w-full justify-center rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
              >
                Back to login
              </Link>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
