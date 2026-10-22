export type Product = {
  id: string;
  sku: string;
  slug: string;
  category: string;
  status: 'active' | 'inactive';
  name: {
    id: string;
    en: string;
  };
  shortDescription: {
    id: string;
    en: string;
  };
  longDescription: {
    id: string;
    en: string;
  };
  specifications: {
    attribute: string;
    value: {
      id: string;
      en: string;
    };
  }[];
  images: {
    url: string;
    alt: {
      id: string;
      en: string;
    };
    isPrimary: boolean;
  }[];
  // Harga dan stok: null bila pengguna belum login / belum approved.
  // Nilai ini hanya diisi server setelah lolos pengecekan (PRD 12.1).
  price: number | null;
  stock: number | null;
  unit: string;
};

export type Category = {
  id: string;
  slug: string;
  name: {
    id: string;
    en: string;
  };
  status: 'active' | 'inactive';
};
