'use client';

import { useState } from 'react';

type Language = 'id' | 'en';

export default function ContactPage() {
  const [locale] = useState<Language>('id');

  const text = {
    title: {
      id: 'Hubungi Kami',
      en: 'Contact Us',
    },
    subtitle: {
      id: 'Kami siap membantu kebutuhan peralatan pemanas industri Anda',
      en: 'We are ready to help with your industrial heating equipment needs',
    },
    placeholder: {
      id: '⚠️ Ini adalah halaman placeholder - Informasi kontak sebenarnya akan ditambahkan',
      en: '⚠️ This is a placeholder page - Actual contact information will be added',
    },
    contactInfo: {
      title: { id: 'Informasi Kontak', en: 'Contact Information' },
      address: { id: 'Alamat', en: 'Address' },
      phone: { id: 'Telepon', en: 'Phone' },
      email: { id: 'Email', en: 'Email' },
      hours: { id: 'Jam Operasional', en: 'Business Hours' },
    },
    form: {
      title: { id: 'Kirim Pesan', en: 'Send Message' },
      name: { id: 'Nama', en: 'Name' },
      email: { id: 'Email', en: 'Email' },
      company: { id: 'Perusahaan', en: 'Company' },
      subject: { id: 'Subjek', en: 'Subject' },
      message: { id: 'Pesan', en: 'Message' },
      send: { id: 'Kirim Pesan', en: 'Send Message' },
      placeholder: {
        name: { id: 'Nama lengkap Anda', en: 'Your full name' },
        email: { id: 'email@perusahaan.com', en: 'email@company.com' },
        company: { id: 'Nama perusahaan', en: 'Company name' },
        subject: { id: 'Subjek pesan', en: 'Message subject' },
        message: { id: 'Tuliskan pesan Anda di sini...', en: 'Write your message here...' },
      },
      notice: {
        id: '⚠️ Form ini belum fungsional - Akan diintegrasikan pada tahap berikutnya',
        en: '⚠️ This form is not functional yet - Will be integrated in the next stage',
      },
    },
    placeholderData: {
      address: {
        id: 'Jakarta, Indonesia (Alamat lengkap akan ditambahkan)',
        en: 'Jakarta, Indonesia (Full address will be added)',
      },
      phone: '+62 21 1234 5678 (Placeholder)',
      email: 'info@industrialheating.com (Placeholder)',
      hours: {
        id: 'Senin - Jumat: 08:00 - 17:00 WIB',
        en: 'Monday - Friday: 08:00 - 17:00 WIB',
      },
    },
  };

  return (
    <div className="min-h-screen bg-light-gray">
      {/* Page Header */}
      <section className="bg-navy text-white py-12">
        <div className="container mx-auto px-4">
          <h1 className="text-4xl font-bold mb-2">{text.title[locale]}</h1>
          <p className="text-lg text-white/90">{text.subtitle[locale]}</p>
        </div>
      </section>

      {/* Placeholder Notice */}
      <div className="bg-orange/10 border-l-4 border-orange py-3">
        <div className="container mx-auto px-4">
          <p className="text-sm font-medium text-orange">
            {text.placeholder[locale]}
          </p>
        </div>
      </div>

      {/* Content */}
      <section className="py-12">
        <div className="container mx-auto px-4 max-w-6xl">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Contact Information */}
            <div className="bg-white rounded-lg shadow-md p-8">
              <h2 className="text-2xl font-bold text-navy mb-6">
                {text.contactInfo.title[locale]}
              </h2>

              <div className="space-y-6">
                {/* Address */}
                <div className="flex items-start">
                  <div className="w-12 h-12 bg-orange/10 rounded-lg flex items-center justify-center flex-shrink-0 mr-4">
                    <svg
                      className="w-6 h-6 text-orange"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                      />
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                      />
                    </svg>
                  </div>
                  <div>
                    <h3 className="font-semibold text-navy mb-1">
                      {text.contactInfo.address[locale]}
                    </h3>
                    <p className="text-gray-600">{text.placeholderData.address[locale]}</p>
                  </div>
                </div>

                {/* Phone */}
                <div className="flex items-start">
                  <div className="w-12 h-12 bg-orange/10 rounded-lg flex items-center justify-center flex-shrink-0 mr-4">
                    <svg
                      className="w-6 h-6 text-orange"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"
                      />
                    </svg>
                  </div>
                  <div>
                    <h3 className="font-semibold text-navy mb-1">
                      {text.contactInfo.phone[locale]}
                    </h3>
                    <p className="text-gray-600">{text.placeholderData.phone}</p>
                  </div>
                </div>

                {/* Email */}
                <div className="flex items-start">
                  <div className="w-12 h-12 bg-orange/10 rounded-lg flex items-center justify-center flex-shrink-0 mr-4">
                    <svg
                      className="w-6 h-6 text-orange"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                      />
                    </svg>
                  </div>
                  <div>
                    <h3 className="font-semibold text-navy mb-1">
                      {text.contactInfo.email[locale]}
                    </h3>
                    <p className="text-gray-600">{text.placeholderData.email}</p>
                  </div>
                </div>

                {/* Business Hours */}
                <div className="flex items-start">
                  <div className="w-12 h-12 bg-orange/10 rounded-lg flex items-center justify-center flex-shrink-0 mr-4">
                    <svg
                      className="w-6 h-6 text-orange"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                      />
                    </svg>
                  </div>
                  <div>
                    <h3 className="font-semibold text-navy mb-1">
                      {text.contactInfo.hours[locale]}
                    </h3>
                    <p className="text-gray-600">{text.placeholderData.hours[locale]}</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Contact Form */}
            <div className="bg-white rounded-lg shadow-md p-8">
              <h2 className="text-2xl font-bold text-navy mb-6">
                {text.form.title[locale]}
              </h2>

              {/* Form Notice */}
              <div className="bg-orange/10 border border-orange/30 rounded-lg p-3 mb-6">
                <p className="text-sm text-orange">{text.form.notice[locale]}</p>
              </div>

              <form className="space-y-4">
                {/* Name */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    {text.form.name[locale]}
                  </label>
                  <input
                    type="text"
                    placeholder={text.form.placeholder.name[locale]}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange focus:border-transparent"
                    disabled
                  />
                </div>

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

                {/* Company */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    {text.form.company[locale]}
                  </label>
                  <input
                    type="text"
                    placeholder={text.form.placeholder.company[locale]}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange focus:border-transparent"
                    disabled
                  />
                </div>

                {/* Subject */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    {text.form.subject[locale]}
                  </label>
                  <input
                    type="text"
                    placeholder={text.form.placeholder.subject[locale]}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange focus:border-transparent"
                    disabled
                  />
                </div>

                {/* Message */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    {text.form.message[locale]}
                  </label>
                  <textarea
                    rows={5}
                    placeholder={text.form.placeholder.message[locale]}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange focus:border-transparent resize-none"
                    disabled
                  ></textarea>
                </div>

                {/* Submit Button */}
                <button
                  type="button"
                  disabled
                  className="w-full px-6 py-3 bg-gray-300 text-gray-500 font-semibold rounded-lg cursor-not-allowed"
                >
                  {text.form.send[locale]}
                </button>
              </form>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
