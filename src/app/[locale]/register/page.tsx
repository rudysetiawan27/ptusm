'use client';

import { useState, type ChangeEvent, type FormEvent } from 'react';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { useTranslations } from 'next-intl';

type FormState = {
  fullName: string;
  email: string;
  phone: string;
  password: string;
  confirmPassword: string;
  companyName: string;
  registrationNumber: string;
  address: string;
  city: string;
  companyPhone: string;
};

const initialState: FormState = {
  fullName: '',
  email: '',
  phone: '',
  password: '',
  confirmPassword: '',
  companyName: '',
  registrationNumber: '',
  address: '',
  city: '',
  companyPhone: '',
};

export default function RegisterPage() {
  const t = useTranslations('register');
  const params = useParams<{ locale: string }>();
  const locale = params?.locale ?? 'id';

  const [form, setForm] = useState<FormState>(initialState);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [message, setMessage] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  function update(field: keyof FormState) {
    return (
      event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
    ) => {
      setForm((prev) => ({ ...prev, [field]: event.target.value }));
    };
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setMessage(null);
    setErrors({});

    if (form.password !== form.confirmPassword) {
      setErrors({ confirmPassword: t('passwordMismatch') });
      return;
    }

    setLoading(true);

    try {
      const res = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });
      const data = await res.json();

      if (!res.ok) {
        if (data.errors) setErrors(data.errors);
        else setMessage(data.message ?? t('genericError'));
        return;
      }

      setSuccess(true);
    } catch {
      setMessage(t('genericError'));
    } finally {
      setLoading(false);
    }
  }

  if (success) {
    return (
      <div className="min-h-screen bg-light-gray py-16 px-4">
        <div className="max-w-xl mx-auto bg-white rounded-lg shadow-md p-8 text-center">
          <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg
              className="w-8 h-8 text-green-600"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M5 13l4 4L19 7"
              />
            </svg>
          </div>
          <h1 className="text-2xl font-bold text-navy mb-3">
            {t('successTitle')}
          </h1>
          <p className="text-gray-600 mb-6">{t('successBody')}</p>
          <Link
            href={`/${locale}/login`}
            className="inline-block px-6 py-3 bg-orange hover:bg-orange/90 text-white font-semibold rounded-lg transition-colors"
          >
            {t('goToLogin')}
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-light-gray py-12 px-4">
      <div className="max-w-3xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center space-x-2 mb-4">
            <div className="bg-orange px-3 py-1 rounded">
              <span className="text-white font-bold text-xl">IH</span>
            </div>
            <span className="font-semibold text-lg text-navy">
              United Heater
            </span>
          </div>
          <h1 className="text-3xl font-bold text-navy mb-2">{t('title')}</h1>
          <p className="text-gray-600">{t('subtitle')}</p>
        </div>

        {/* Registration Form */}
        <div className="bg-white rounded-lg shadow-md p-8 mb-6">
          <form className="space-y-6" onSubmit={handleSubmit} noValidate>
            {message && (
              <div
                role="alert"
                className="bg-red-50 border border-red-200 text-red-700 text-sm rounded-lg p-3"
              >
                {message}
              </div>
            )}

            {/* User Information */}
            <div>
              <h2 className="text-xl font-semibold text-navy mb-4">
                {t('sections.user')}
              </h2>
              <div className="space-y-4">
                <Field
                  id="fullName"
                  label={t('form.fullName')}
                  value={form.fullName}
                  onChange={update('fullName')}
                  placeholder={t('form.placeholder.fullName')}
                  error={errors.fullName}
                  required
                />

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <Field
                    id="email"
                    type="email"
                    label={t('form.email')}
                    value={form.email}
                    onChange={update('email')}
                    placeholder={t('form.placeholder.email')}
                    error={errors.email}
                    required
                  />
                  <Field
                    id="phone"
                    type="tel"
                    label={t('form.phone')}
                    value={form.phone}
                    onChange={update('phone')}
                    placeholder={t('form.placeholder.phone')}
                    error={errors.phone}
                    required
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <Field
                    id="password"
                    type="password"
                    label={t('form.password')}
                    value={form.password}
                    onChange={update('password')}
                    placeholder={t('form.placeholder.password')}
                    error={errors.password}
                    required
                  />
                  <Field
                    id="confirmPassword"
                    type="password"
                    label={t('form.confirmPassword')}
                    value={form.confirmPassword}
                    onChange={update('confirmPassword')}
                    placeholder={t('form.placeholder.password')}
                    error={errors.confirmPassword}
                    required
                  />
                </div>
              </div>
            </div>

            {/* Company Information */}
            <div className="pt-6 border-t border-gray-200">
              <h2 className="text-xl font-semibold text-navy mb-4">
                {t('sections.company')}
              </h2>
              <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <Field
                    id="companyName"
                    label={t('form.companyName')}
                    value={form.companyName}
                    onChange={update('companyName')}
                    placeholder={t('form.placeholder.companyName')}
                    error={errors.companyName}
                    required
                  />
                  <Field
                    id="registrationNumber"
                    label={t('form.companyRegNumber')}
                    value={form.registrationNumber}
                    onChange={update('registrationNumber')}
                    placeholder={t('form.placeholder.companyRegNumber')}
                  />
                </div>

                <div>
                  <label
                    htmlFor="address"
                    className="block text-sm font-medium text-gray-700 mb-1"
                  >
                    {t('form.companyAddress')}
                  </label>
                  <textarea
                    id="address"
                    rows={3}
                    value={form.address}
                    onChange={update('address')}
                    placeholder={t('form.placeholder.companyAddress')}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange focus:border-transparent resize-none"
                  />
                  {errors.address && (
                    <p className="text-sm text-red-600 mt-1">{errors.address}</p>
                  )}
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <Field
                    id="city"
                    label={t('form.companyCity')}
                    value={form.city}
                    onChange={update('city')}
                    placeholder={t('form.placeholder.companyCity')}
                    error={errors.city}
                    required
                  />
                  <Field
                    id="companyPhone"
                    type="tel"
                    label={t('form.companyPhone')}
                    value={form.companyPhone}
                    onChange={update('companyPhone')}
                    placeholder={t('form.placeholder.companyPhone')}
                    error={errors.companyPhone}
                    required
                  />
                </div>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full px-6 py-3 bg-orange hover:bg-orange/90 disabled:bg-gray-300 disabled:text-gray-500 text-white font-semibold rounded-lg transition-colors"
            >
              {loading ? t('submitting') : t('submitButton')}
            </button>
          </form>
        </div>

        {/* Approval Process Info */}
        <div className="bg-blue-50 rounded-lg p-6 mb-6">
          <h3 className="font-semibold text-navy mb-2">
            {t('approval.title')}
          </h3>
          <p className="text-sm text-gray-700">{t('approval.content')}</p>
        </div>

        {/* Login Link */}
        <div className="text-center">
          <p className="text-sm text-gray-600">
            {t('haveAccount.text')}{' '}
            <Link
              href={`/${locale}/login`}
              className="text-orange hover:text-orange/80 font-medium"
            >
              {t('haveAccount.link')}
            </Link>
          </p>
        </div>

        <div className="mt-6 text-center">
          <Link
            href={`/${locale}`}
            className="text-sm text-gray-600 hover:text-navy"
          >
            ← {t('backToHome')}
          </Link>
        </div>
      </div>
    </div>
  );
}

type FieldProps = {
  id: string;
  label: string;
  value: string;
  onChange: (
    event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => void;
  placeholder?: string;
  error?: string;
  type?: string;
  required?: boolean;
};

function Field({
  id,
  label,
  value,
  onChange,
  placeholder,
  error,
  type = 'text',
  required,
}: FieldProps) {
  return (
    <div>
      <label htmlFor={id} className="block text-sm font-medium text-gray-700 mb-1">
        {label}
      </label>
      <input
        id={id}
        name={id}
        type={type}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        required={required}
        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange focus:border-transparent"
      />
      {error && <p className="text-sm text-red-600 mt-1">{error}</p>}
    </div>
  );
}
