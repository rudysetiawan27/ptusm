'use client';

import { useState } from 'react';
import Link from 'next/link';

type Language = 'id' | 'en';

export default function LoginPage() {
  const [locale] = useState<Language>('id');

  const text = {
    title: {
      id: 'Masuk ke Akun Anda',
      en: 'Sign In to Your Account',
    },
    subtitle: {
      id: 'Masuk untuk mengakses harga dan melakukan pemesanan',
      en: 'Sign in to access pricing and place orders',
    },
    placeholder: {
      id: '⚠️ Halaman placeholder - Autentikasi akan diimplementasikan pada Tahap 3',
      en: '⚠️ Placeholder page - Authentication will be implemented in Stage 3',
    },
    form: {
      email: { id: 'Email', en: 'Email' },
      password: { id: 'Password', en: 'Password' },
      remember: { id: 'Ingat saya', en: 'Remember me' },
      forgot: { id: 'Lupa password?', en: 'Forgot password?' },
      submit: { id: 'Masuk', en: 'Sign In' },
      placeholder: {
        email: { id: 'email@perusahaan.com', en: 'email@company.com' },
        password: { id: 'Password Anda', en: 'Your password' },
      },
    },
    noAccount: {
      text: { id: 'Belum punya akun?', en: "Don't have an account?" },
      link: { id: 'Daftar sebagai perusahaan', en: 'Register as company' },
    },
    notice: {
      id: '⚠️ Form ini belum fungsional. Autentikasi akan menggunakan Supabase pada Tahap 3.',
      en: '⚠️ This form is not functional yet. Authentication will use Supabase in Stage 3.',
    },
  };

  return (
    <div className="min-h-screen bg-light-gray flex items-center justify-center py-12 px-4">
      <div className="max-w-md w-full">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center space-x-2 mb-4">
            <div className="bg-orange px-3 py-1 rounded">
              <span className="text-white font-bold text-xl">IH</span>
            </div>
            <span className="font-semibold text-lg text-navy">Industrial Heating</span>
          </div>
          <h1 className="text-3xl font-bold text-navy mb-2">{text.title[locale]}</h1>
          <p className="text-gray-600">{text.subtitle[locale]}</p>
        </div>

        {/* Placeholder Notice */}
        <div className="bg-orange/10 border-l-4 border-orange py-3 px-4 mb-6 rounded">
          <p className="text-sm font-medium text-orange">{text.placeholder[locale]}</p>
        </div>

        {/* Login Form */}
        <div className="bg-white rounded-lg shadow-md p-8">
          {/* Form Notice */}
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 mb-6">
            <p className="text-sm text-blue-700">{text.notice[locale]}</p>
          </div>

          <form className="space-y-4">
            {/* Email */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                {text.form.email[locale]}
              </label>
              <input
                type="email"
                placeholder={text.form.placeholder.email[locale]}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange focus:border-transparent"
                disabled
              />
            </div>

            {/* Password */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                {text.form.password[locale]}
              </label>
              <input
                type="password"
                placeholder={text.form.placeholder.password[locale]}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange focus:border-transparent"
                disabled
              />
            </div>

            {/* Remember & Forgot */}
            <div className="flex items-center justify-between">
              <label className="flex items-center">
                <input
                  type="checkbox"
                  className="rounded border-gray-300 text-orange focus:ring-orange"
                  disabled
                />
                <span className="ml-2 text-sm text-gray-600">
                  {text.form.remember[locale]}
                </span>
              </label>
              <button
                type="button"
                className="text-sm text-orange hover:text-orange/80 cursor-not-allowed"
                disabled
              >
                {text.form.forgot[locale]}
              </button>
            </div>

            {/* Submit Button */}
            <button
              type="button"
              disabled
              className="w-full px-6 py-3 bg-gray-300 text-gray-500 font-semibold rounded-lg cursor-not-allowed"
            >
              {text.form.submit[locale]}
            </button>
          </form>

          {/* Register Link */}
          <div className="mt-6 text-center">
            <p className="text-sm text-gray-600">
              {text.noAccount.text[locale]}{' '}
              <Link href="/register" className="text-orange hover:text-orange/80 font-medium">
                {text.noAccount.link[locale]}
              </Link>
            </p>
          </div>
        </div>

        {/* Back to Home */}
        <div className="mt-6 text-center">
          <Link href="/" className="text-sm text-gray-600 hover:text-navy">
            ← {locale === 'id' ? 'Kembali ke Beranda' : 'Back to Home'}
          </Link>
        </div>
      </div>
    </div>
  );
}
