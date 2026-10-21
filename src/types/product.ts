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
  // Harga dan stok - hanya untuk pengguna yang approved
  price: number;
  stock: number;
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
