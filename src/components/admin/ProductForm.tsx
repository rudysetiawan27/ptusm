'use client';

import { useState, type ChangeEvent, type FormEvent } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useTranslations } from 'next-intl';

export type ProductFormValues = {
  id?: string;
  imageUrl: string;
  sku: string;
  slug: string;
  nameId: string;
  nameEn: string;
  shortDescriptionId: string;
  shortDescriptionEn: string;
  longDescriptionId: string;
  longDescriptionEn: string;
  categoryId: string;
  status: string;
  unit: string;
  price: string;
  stock: string;
};

type Props = {
  locale: string;
  categories: { id: string; nameId: string; nameEn: string }[];
  initial?: ProductFormValues;
};

const empty: ProductFormValues = {
  imageUrl: '',
  sku: '',
  slug: '',
  nameId: '',
  nameEn: '',
  shortDescriptionId: '',
  shortDescriptionEn: '',
  longDescriptionId: '',
  longDescriptionEn: '',
  categoryId: '',
  status: 'draft',
  unit: 'pcs',
  price: '0',
  stock: '0',
};

export default function ProductForm({ locale, categories, initial }: Props) {
  const t = useTranslations('admin');
  const router = useRouter();
  const [form, setForm] = useState<ProductFormValues>(initial ?? empty);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [message, setMessage] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);

  const isEdit = Boolean(form.id);

  function update(field: keyof ProductFormValues) {
    return (
      event: ChangeEvent<
        HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
      >
    ) => {
      setForm(
        (prev) => ({ ...prev, [field]: event.target.value } as ProductFormValues)
      );
    };
  }

  async function handleImageChange(event: ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];
    event.target.value = '';

    if (!file) return;

    const allowed = ['image/png', 'image/jpeg', 'image/webp', 'image/gif'];

    if (!allowed.includes(file.type)) {
      setUploadError(t('imageTypeError'));
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      setUploadError(t('imageSizeError'));
      return;
    }

    setUploading(true);
    setUploadError(null);

    try {
      const body = new FormData();
      body.append('file', file);

      const res = await fetch('/api/admin/products/image', {
        method: 'POST',
        body,
      });
      const data = await res.json().catch(() => ({}));

      if (!res.ok || !data.ok) {
        setUploadError(
          data.code === 'BUCKET_MISSING'
            ? t('imageBucketMissing')
            : t('imageUploadError')
        );
        return;
      }

      setForm((prev) => ({ ...prev, imageUrl: data.url }));
    } catch {
      setUploadError(t('imageUploadError'));
    } finally {
      setUploading(false);
    }
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setSaving(true);
    setErrors({});
    setMessage(null);

    try {
      const res = await fetch('/api/admin/products', {
        method: isEdit ? 'PUT' : 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });
      const data = await res.json();

      if (!res.ok || !data.ok) {
        if (data.errors) setErrors(data.errors);
        setMessage(
          res.status === 409 ? t('duplicateError') : t('formError')
        );
        return;
      }

      router.push(`/${locale}/admin/products`);
      router.refresh();
    } catch {
      setMessage(t('formError'));
    } finally {
      setSaving(false);
    }
  }

  async function handleDelete() {
    if (!form.id) return;
    if (!window.confirm(t('deleteConfirm'))) return;

    setDeleting(true);
    setMessage(null);

    try {
      const res = await fetch('/api/admin/products', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: form.id }),
      });
      const data = await res.json();

      if (!res.ok || !data.ok) {
        setMessage(t('formError'));
        return;
      }

      router.push(`/${locale}/admin/products`);
      router.refresh();
    } catch {
      setMessage(t('formError'));
    } finally {
      setDeleting(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {message && (
        <div
          role="alert"
          className="bg-red-50 border border-red-200 text-red-700 text-sm rounded-lg p-3"
        >
          {message}
        </div>
      )}

      <div className="bg-white rounded-lg shadow-md p-6 space-y-4">
        <div>
          <h2 className="text-lg font-semibold text-navy">
            {t('productImage')}
          </h2>
          <p className="text-sm text-gray-500 mt-1">
            {t('productImageHint')}
          </p>
        </div>

        <div className="flex flex-col sm:flex-row gap-5">
          <div className="relative w-36 h-36 rounded-lg overflow-hidden bg-light-gray border border-gray-200 shrink-0">
            {form.imageUrl ? (
              <Image
                src={form.imageUrl}
                alt={form.nameId || form.nameEn || 'Produk'}
                fill
                sizes="144px"
                className="object-cover"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-xs text-gray-400 text-center px-2">
                {t('noImage')}
              </div>
            )}
          </div>

          <div className="space-y-2 sm:pt-1">
            <label
              htmlFor="productImage"
              className={`inline-block px-4 py-2 text-white text-sm font-medium rounded-lg cursor-pointer transition-colors ${
                uploading
                  ? 'bg-gray-400 cursor-not-allowed'
                  : 'bg-navy hover:bg-orange'
              }`}
            >
              {uploading ? t('uploadingImage') : t('uploadImage')}
            </label>
            <input
              id="productImage"
              type="file"
              accept="image/png,image/jpeg,image/webp,image/gif"
              onChange={handleImageChange}
              disabled={uploading}
              className="hidden"
            />

            {form.imageUrl && (
              <button
                type="button"
                onClick={() => {
                  setForm((prev) => ({ ...prev, imageUrl: '' }));
                  setUploadError(null);
                }}
                disabled={uploading}
                className="block text-sm text-red-600 hover:text-red-700 disabled:text-gray-400"
              >
                {t('removeImage')}
              </button>
            )}

            {uploadError && (
              <p className="text-sm text-red-600">{uploadError}</p>
            )}
            {errors.imageUrl && (
              <p className="text-sm text-red-600">{errors.imageUrl}</p>
            )}
          </div>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-md p-6 space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Field
            id="sku"
            label={t('sku')}
            value={form.sku}
            onChange={update('sku')}
            error={errors.sku}
          />
          <Field
            id="slug"
            label={t('slug')}
            value={form.slug}
            onChange={update('slug')}
            error={errors.slug}
          />
          <Field
            id="nameId"
            label={t('nameId')}
            value={form.nameId}
            onChange={update('nameId')}
            error={errors.nameId}
          />
          <Field
            id="nameEn"
            label={t('nameEn')}
            value={form.nameEn}
            onChange={update('nameEn')}
            error={errors.nameEn}
          />

          <div>
            <label
              htmlFor="categoryId"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              {t('categoryLabel')}
            </label>
            <select
              id="categoryId"
              value={form.categoryId}
              onChange={update('categoryId')}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-orange"
            >
              <option value="">{t('noCategory')}</option>
              {categories.map((category) => (
                <option key={category.id} value={category.id}>
                  {category.nameId || category.nameEn}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label
              htmlFor="status"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              {t('status')}
            </label>
            <select
              id="status"
              value={form.status}
              onChange={update('status')}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-orange"
            >
              <option value="active">{t('statusActive')}</option>
              <option value="inactive">{t('statusInactive')}</option>
              <option value="draft">{t('statusDraft')}</option>
            </select>
          </div>

          <Field
            id="unit"
            label={t('unit')}
            value={form.unit}
            onChange={update('unit')}
          />
          <Field
            id="price"
            type="number"
            label={t('price')}
            value={form.price}
            onChange={update('price')}
            error={errors.price}
          />
          <Field
            id="stock"
            type="number"
            label={t('stock')}
            value={form.stock}
            onChange={update('stock')}
            error={errors.stock}
          />
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-md p-6 space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Area
            id="shortDescriptionId"
            label={t('shortDescId')}
            value={form.shortDescriptionId}
            onChange={update('shortDescriptionId')}
          />
          <Area
            id="shortDescriptionEn"
            label={t('shortDescEn')}
            value={form.shortDescriptionEn}
            onChange={update('shortDescriptionEn')}
          />
          <Area
            id="longDescriptionId"
            label={t('longDescId')}
            value={form.longDescriptionId}
            onChange={update('longDescriptionId')}
            rows={5}
          />
          <Area
            id="longDescriptionEn"
            label={t('longDescEn')}
            value={form.longDescriptionEn}
            onChange={update('longDescriptionEn')}
            rows={5}
          />
        </div>
      </div>

      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <Link
          href={`/${locale}/admin/products`}
          className="text-sm text-gray-600 hover:text-navy"
        >
          ← {t('backToList')}
        </Link>

        <div className="flex gap-3">
          {isEdit && (
            <button
              type="button"
              onClick={handleDelete}
              disabled={deleting || saving || uploading}
              className="px-5 py-2.5 bg-red-600 hover:bg-red-700 disabled:bg-gray-300 text-white font-medium rounded-lg transition-colors"
            >
              {deleting ? t('deleting') : t('delete')}
            </button>
          )}
          <button
            type="submit"
            disabled={saving || deleting || uploading}
            className="px-6 py-2.5 bg-orange hover:bg-orange/90 disabled:bg-gray-300 disabled:text-gray-500 text-white font-semibold rounded-lg transition-colors"
          >
            {saving ? t('saving') : t('save')}
          </button>
        </div>
      </div>
    </form>
  );
}

type FieldProps = {
  id: string;
  label: string;
  value: string;
  onChange: (
    event: ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => void;
  error?: string;
  type?: string;
};

function Field({ id, label, value, onChange, error, type = 'text' }: FieldProps) {
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
        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange"
      />
      {error && <p className="text-sm text-red-600 mt-1">{error}</p>}
    </div>
  );
}

type AreaProps = {
  id: string;
  label: string;
  value: string;
  onChange: FieldProps['onChange'];
  rows?: number;
};

function Area({ id, label, value, onChange, rows = 3 }: AreaProps) {
  return (
    <div>
      <label htmlFor={id} className="block text-sm font-medium text-gray-700 mb-1">
        {label}
      </label>
      <textarea
        id={id}
        name={id}
        rows={rows}
        value={value}
        onChange={onChange}
        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange resize-none"
      />
    </div>
  );
}
