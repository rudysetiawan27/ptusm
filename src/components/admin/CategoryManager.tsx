'use client';

import { useState, type ChangeEvent, type FormEvent } from 'react';
import { useRouter } from 'next/navigation';
import { useTranslations } from 'next-intl';
import type { AdminCategory } from '@/lib/catalog';

type Props = {
  categories: AdminCategory[];
};

type RowState = {
  id?: string;
  slug: string;
  nameId: string;
  nameEn: string;
  status: string;
  sortOrder: string;
};

const emptyRow: RowState = {
  slug: '',
  nameId: '',
  nameEn: '',
  status: 'active',
  sortOrder: '0',
};

export default function CategoryManager({ categories }: Props) {
  const t = useTranslations('admin');
  const router = useRouter();

  const [rows, setRows] = useState<RowState[]>(
    categories.map((category) => ({
      id: category.id,
      slug: category.slug,
      nameId: category.nameId,
      nameEn: category.nameEn,
      status: category.status,
      sortOrder: String(category.sortOrder),
    }))
  );
  const [fresh, setFresh] = useState<RowState>(emptyRow);
  const [busy, setBusy] = useState<string | null>(null);
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  function updateRow(index: number, field: keyof RowState, value: string) {
    setRows((prev) =>
      prev.map((row, i) =>
        i === index ? ({ ...row, [field]: value } as RowState) : row
      )
    );
  }

  function updater(field: keyof RowState) {
    return (
      event: ChangeEvent<HTMLInputElement | HTMLSelectElement>
    ) => {
      setFresh((prev) => ({ ...prev, [field]: event.target.value } as RowState));
    };
  }

  async function saveRow(row: RowState) {
    setBusy(row.id ?? 'new');
    setError(null);
    setMessage(null);

    try {
      const res = await fetch('/api/admin/categories', {
        method: row.id ? 'PUT' : 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(row),
      });
      const data = await res.json();

      if (!res.ok || !data.ok) {
        setError(data.message ?? t('formError'));
        return;
      }

      setMessage(t('categorySaved'));
      if (!row.id) setFresh(emptyRow);
      router.refresh();
    } catch {
      setError(t('formError'));
    } finally {
      setBusy(null);
    }
  }

  async function handleAdd(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    await saveRow(fresh);
  }

  return (
    <div className="space-y-6">
      {message && (
        <div className="bg-green-50 border border-green-200 text-green-800 text-sm rounded-lg p-3">
          {message}
        </div>
      )}
      {error && (
        <div
          role="alert"
          className="bg-red-50 border border-red-200 text-red-700 text-sm rounded-lg p-3"
        >
          {error}
        </div>
      )}

      {/* Existing categories */}
      <div className="bg-white rounded-lg shadow-md divide-y divide-gray-200">
        {rows.length === 0 && (
          <p className="p-6 text-gray-600">{t('categoryEmpty')}</p>
        )}

        {rows.map((row, index) => (
          <div key={row.id} className="p-4 space-y-3">
            <div className="grid grid-cols-1 lg:grid-cols-6 gap-3">
              <div className="lg:col-span-2">
                <label className="block text-xs font-medium text-gray-500 mb-1">
                  {t('nameId')}
                </label>
                <input
                  value={row.nameId}
                  onChange={(e) => updateRow(index, 'nameId', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-orange"
                />
              </div>
              <div className="lg:col-span-2">
                <label className="block text-xs font-medium text-gray-500 mb-1">
                  {t('nameEn')}
                </label>
                <input
                  value={row.nameEn}
                  onChange={(e) => updateRow(index, 'nameEn', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-orange"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-500 mb-1">
                  {t('slug')}
                </label>
                <input
                  value={row.slug}
                  onChange={(e) => updateRow(index, 'slug', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-orange"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-500 mb-1">
                  {t('status')}
                </label>
                <select
                  value={row.status}
                  onChange={(e) => updateRow(index, 'status', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm bg-white focus:outline-none focus:ring-2 focus:ring-orange"
                >
                  <option value="active">{t('statusActive')}</option>
                  <option value="inactive">{t('statusInactive')}</option>
                </select>
              </div>
            </div>

            <div className="flex justify-end">
              <button
                type="button"
                onClick={() => saveRow(row)}
                disabled={busy !== null}
                className="px-4 py-2 bg-navy hover:bg-orange disabled:bg-gray-300 text-white text-sm font-medium rounded-lg transition-colors"
              >
                {busy === row.id ? t('saving') : t('save')}
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* New category */}
      <form
        onSubmit={handleAdd}
        className="bg-white rounded-lg shadow-md p-4 space-y-3"
      >
        <h2 className="font-semibold text-navy">{t('newCategory')}</h2>

        <div className="grid grid-cols-1 lg:grid-cols-6 gap-3">
          <div className="lg:col-span-2">
            <label className="block text-xs font-medium text-gray-500 mb-1">
              {t('nameId')}
            </label>
            <input
              value={fresh.nameId}
              onChange={updater('nameId')}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-orange"
            />
          </div>
          <div className="lg:col-span-2">
            <label className="block text-xs font-medium text-gray-500 mb-1">
              {t('nameEn')}
            </label>
            <input
              value={fresh.nameEn}
              onChange={updater('nameEn')}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-orange"
            />
          </div>
          <div>
            <label className="block text-xs font-medium text-gray-500 mb-1">
              {t('slug')}
            </label>
            <input
              value={fresh.slug}
              onChange={updater('slug')}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-orange"
            />
          </div>
          <div>
            <label className="block text-xs font-medium text-gray-500 mb-1">
              {t('status')}
            </label>
            <select
              value={fresh.status}
              onChange={updater('status')}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm bg-white focus:outline-none focus:ring-2 focus:ring-orange"
            >
              <option value="active">{t('statusActive')}</option>
              <option value="inactive">{t('statusInactive')}</option>
            </select>
          </div>
        </div>

        <div className="flex justify-end">
          <button
            type="submit"
            disabled={busy !== null}
            className="px-5 py-2 bg-orange hover:bg-orange/90 disabled:bg-gray-300 text-white text-sm font-semibold rounded-lg transition-colors"
          >
            {busy === 'new' ? t('saving') : t('addCategory')}
          </button>
        </div>
      </form>
    </div>
  );
}
