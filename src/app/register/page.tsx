'use client';

import { useState } from 'react';
import Link from 'next/link';

type Language = 'id' | 'en';

export default function RegisterPage() {
  const [locale] = useState<Language>('id');

  const text = {
    title: {
      id: 'Daftar Akun Perusahaan',
      en: 'Register Company Account',
    },
    subtitle: {
      id: 'Daftarkan perusahaan Anda untuk mengakses harga B2B dan melakukan pemesanan',
      en: 'Register your company to access B2B pricing and place orders',
    },
    placeholder: {
      id: '⚠️ Halaman placeholder - Pendaftaran akan diimplementasikan pada Tahap 3',
      en: '⚠️ Placeholder page - Registration will be implemented in Stage 3',
    },
    sections: {
      user: { id: 'Informasi Pengguna', en: 'User Information' },
      company: { id: 'Informasi Perusahaan', en: 'Company Information' },
    },
    form: {
      fullName: { id: 'Nama Lengkap', en: 'Full Name' },
      email: { id: 'Email', en: 'Email' },
      phone: { id: 'Nomor Telepon', en: 'Phone Number' },
      password: { id: 'Password', en: 'Password' },
      confirmPassword: { id: 'Konfirmasi Password', en: 'Confirm Password' },
      companyName: { id: 'Nama Perusahaan', en: 'Company Name' },
      companyRegNumber: { id: 'Nomor Registrasi/NPWP', en: 'Registration/Tax Number' },
      companyAddress: { id: 'Alamat Perusahaan', en: 'Company Address' },
      companyCity: { id: 'Kota', en: 'City' },
      companyPhone: { id: 'Telepon Perusahaan', en: 'Company Phone' },
      submit: { id: 'Daftar Sekarang', en: 'Register Now' },
      placeholder: {
        fullName: { id: 'Nama lengkap Anda', en: 'Your full name' },
        email: { id: 'email@perusahaan.com', en: 'email@company.com' },
        phone: { id: '+62 812 3456 7890', en: '+62 812 3456 7890' },
        password: { id: 'Minimal 8 karakter', en: 'Minimum 8 characters' },
        companyName: { id: 'PT. Nama Perusahaan', en: 'PT. Company Name' },
        companyRegNumber: { id: 'NPWP atau nomor registrasi', en: 'Tax or registration number' },
        companyAddress: { id: 'Alamat lengkap perusahaan', en: 'Full company address' },
        companyCity: { id: 'Jakarta', en: 'Jakarta' },
        companyPhone: { id: '+62 21 1234 5678', en: '+62 21 1234 5678' },
      },
    },
    approval: {
      title: { id: 'Proses Persetujuan', en: 'Approval Process' },
      content: {
        id: 'Setelah mendaftar, akun Anda akan ditinjau oleh tim kami. Anda akan menerima notifikasi setelah akun disetujui dan dapat mengakses harga serta melakukan pemesanan.',
        en: 'After registration, your account will be reviewed by our team. You will receive notification once your account is approved and can access pricing and place orders.',
      },
    },
    haveAccount: {
      text: { id: 'Sudah punya akun?', en: 'Already have an account?' },
      link: { id: 'Masuk di sini', en: 'Sign in here' },
    },
    notice: {
      id: '⚠️ Form ini belum fungsional. Pendaftaran dan persetujuan akun akan diimplementasikan pada Tahap 3.',
      en: '⚠️ This form is not functional yet. Registration and account approval will be implemented in Stage 3.',
    },
  };

  return (
    <div className="min-h-screen bg-light-gray py-12 px-4">
      <div className="max-w-3xl mx-auto">
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

        {/* Registration Form */}
        <div className="bg-white rounded-lg shadow-md p-8 mb-6">
          {/* Form Notice */}
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 mb-6">
            <p className="text-sm text-blue-700">{text.notice[locale]}</p>
          </div>

          <form className="space-y-6">
            {/* User Information */}
            <div>
              <h2 className="text-xl font-semibold text-navy mb-4">
                {text.sections.user[locale]}
              </h2>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    {text.form.fullName[locale]}
                  </label>
                  <input
                    type="text"
                    placeholder={text.form.placeholder.fullName[locale]}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange focus:border-transparent"
                    disabled
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      {text.form.phone[locale]}
                    </label>
                    <input
                      type="tel"
                      placeholder={text.form.placeholder.phone[locale]}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange focus:border-transparent"
                      disabled
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      {text.form.confirmPassword[locale]}
                    </label>
                    <input
                      type="password"
                      placeholder={text.form.placeholder.password[locale]}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange focus:border-transparent"
                      disabled
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Company Information */}
            <div className="pt-6 border-t border-gray-200">
              <h2 className="text-xl font-semibold text-navy mb-4">
                {text.sections.company[locale]}
              </h2>
              <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      {text.form.companyName[locale]}
                    </label>
                    <input
                      type="text"
                      placeholder={text.form.placeholder.companyName[locale]}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange focus:border-transparent"
                      disabled
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      {text.form.companyRegNumber[locale]}
                    </label>
                    <input
                      type="text"
                      placeholder={text.form.placeholder.companyRegNumber[locale]}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange focus:border-transparent"
                      disabled
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    {text.form.companyAddress[locale]}
                  </label>
                  <textarea
                    rows={3}
                    placeholder={text.form.placeholder.companyAddress[locale]}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange focus:border-transparent resize-none"
                    disabled
                  ></textarea>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      {text.form.companyCity[locale]}
                    </label>
                    <input
                      type="text"
                      placeholder={text.form.placeholder.companyCity[locale]}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange focus:border-transparent"
                      disabled
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      {text.form.companyPhone[locale]}
                    </label>
                    <input
                      type="tel"
                      placeholder={text.form.placeholder.companyPhone[locale]}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange focus:border-transparent"
                      disabled
                    />
                  </div>
                </div>
              </div>
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
        </div>

        {/* Approval Process Info */}
        <div className="bg-blue-50 rounded-lg p-6 mb-6">
          <h3 className="font-semibold text-navy mb-2">
            {text.approval.title[locale]}
          </h3>
          <p className="text-sm text-gray-700">{text.approval.content[locale]}</p>
        </div>

        {/* Login Link */}
        <div className="text-center">
          <p className="text-sm text-gray-600">
            {text.haveAccount.text[locale]}{' '}
            <Link href="/login" className="text-orange hover:text-orange/80 font-medium">
              {text.haveAccount.link[locale]}
            </Link>
          </p>
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
