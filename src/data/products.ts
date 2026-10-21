import { Product, Category } from '@/types/product';

// ⚠️ DEMO DATA - Bukan data produk atau harga sebenarnya
export const categories: Category[] = [
  {
    id: 'demo-cat-1',
    slug: 'infrared-heaters',
    name: {
      id: 'Pemanas Infrared',
      en: 'Infrared Heaters',
    },
    status: 'active',
  },
  {
    id: 'demo-cat-2',
    slug: 'band-heaters',
    name: {
      id: 'Pemanas Band',
      en: 'Band Heaters',
    },
    status: 'active',
  },
  {
    id: 'demo-cat-3',
    slug: 'cartridge-heaters',
    name: {
      id: 'Pemanas Kartrid',
      en: 'Cartridge Heaters',
    },
    status: 'active',
  },
  {
    id: 'demo-cat-4',
    slug: 'tubular-heaters',
    name: {
      id: 'Pemanas Tubular',
      en: 'Tubular Heaters',
    },
    status: 'active',
  },
];

// ⚠️ DEMO DATA - Bukan data produk atau harga sebenarnya
export const products: Product[] = [
  {
    id: 'demo-prod-1',
    sku: 'DEMO-CIH-001',
    slug: 'ceramic-infrared-heater',
    category: 'infrared-heaters',
    status: 'active',
    name: {
      id: 'Ceramic Infrared Heater',
      en: 'Ceramic Infrared Heater',
    },
    shortDescription: {
      id: 'Pemanas infrared keramik untuk aplikasi industri dengan efisiensi tinggi',
      en: 'High-efficiency ceramic infrared heater for industrial applications',
    },
    longDescription: {
      id: 'Ceramic Infrared Heater dirancang untuk memberikan pemanasan yang efisien dan merata pada berbagai aplikasi industri. Menggunakan teknologi keramik berkualitas tinggi yang tahan lama dan efisien energi.',
      en: 'Ceramic Infrared Heater is designed to provide efficient and uniform heating for various industrial applications. Uses high-quality ceramic technology that is durable and energy efficient.',
    },
    specifications: [
      {
        attribute: 'Power',
        value: { id: '500W - 2000W', en: '500W - 2000W' },
      },
      {
        attribute: 'Voltage',
        value: { id: '220V - 380V', en: '220V - 380V' },
      },
      {
        attribute: 'Material',
        value: { id: 'Keramik', en: 'Ceramic' },
      },
      {
        attribute: 'Max Temperature',
        value: { id: '650°C', en: '650°C' },
      },
    ],
    images: [
      {
        url: 'https://placehold.co/600x400/172B3A/E87524?text=Ceramic+Infrared+Heater',
        alt: {
          id: 'Ceramic Infrared Heater',
          en: 'Ceramic Infrared Heater',
        },
        isPrimary: true,
      },
    ],
    price: 1500000, // DEMO price
    stock: 50, // DEMO stock
    unit: 'pcs',
  },
  {
    id: 'demo-prod-2',
    sku: 'DEMO-NBH-002',
    slug: 'nozzle-band-heater',
    category: 'band-heaters',
    status: 'active',
    name: {
      id: 'Nozzle Band Heater',
      en: 'Nozzle Band Heater',
    },
    shortDescription: {
      id: 'Band heater khusus untuk nozzle mesin injeksi plastik',
      en: 'Specialized band heater for plastic injection machine nozzles',
    },
    longDescription: {
      id: 'Nozzle Band Heater dirancang khusus untuk pemanasan nozzle pada mesin injeksi plastik. Memberikan distribusi panas yang optimal dan kontrol suhu yang presisi untuk hasil produksi terbaik.',
      en: 'Nozzle Band Heater is specifically designed for heating nozzles in plastic injection machines. Provides optimal heat distribution and precise temperature control for best production results.',
    },
    specifications: [
      {
        attribute: 'Power',
        value: { id: '300W - 1500W', en: '300W - 1500W' },
      },
      {
        attribute: 'Voltage',
        value: { id: '220V', en: '220V' },
      },
      {
        attribute: 'Material',
        value: { id: 'Mica', en: 'Mica' },
      },
      {
        attribute: 'Max Temperature',
        value: { id: '450°C', en: '450°C' },
      },
      {
        attribute: 'Diameter',
        value: { id: '25mm - 100mm', en: '25mm - 100mm' },
      },
    ],
    images: [
      {
        url: 'https://placehold.co/600x400/172B3A/E87524?text=Nozzle+Band+Heater',
        alt: {
          id: 'Nozzle Band Heater',
          en: 'Nozzle Band Heater',
        },
        isPrimary: true,
      },
    ],
    price: 850000, // DEMO price
    stock: 75, // DEMO stock
    unit: 'pcs',
  },
  {
    id: 'demo-prod-3',
    sku: 'DEMO-CH-003',
    slug: 'cartridge-heater',
    category: 'cartridge-heaters',
    status: 'active',
    name: {
      id: 'Cartridge Heater',
      en: 'Cartridge Heater',
    },
    shortDescription: {
      id: 'Pemanas kartrid untuk aplikasi die casting dan hot runner',
      en: 'Cartridge heater for die casting and hot runner applications',
    },
    longDescription: {
      id: 'Cartridge Heater adalah solusi pemanasan yang kompak dan powerful untuk aplikasi die casting, hot runner, dan berbagai kebutuhan pemanasan industri lainnya. Desain tubular memungkinkan instalasi yang mudah dan transfer panas yang efisien.',
      en: 'Cartridge Heater is a compact and powerful heating solution for die casting, hot runner, and various other industrial heating needs. Tubular design allows easy installation and efficient heat transfer.',
    },
    specifications: [
      {
        attribute: 'Power',
        value: { id: '200W - 1000W', en: '200W - 1000W' },
      },
      {
        attribute: 'Voltage',
        value: { id: '220V', en: '220V' },
      },
      {
        attribute: 'Diameter',
        value: { id: '6mm - 16mm', en: '6mm - 16mm' },
      },
      {
        attribute: 'Length',
        value: { id: '50mm - 300mm', en: '50mm - 300mm' },
      },
      {
        attribute: 'Max Temperature',
        value: { id: '800°C', en: '800°C' },
      },
    ],
    images: [
      {
        url: 'https://placehold.co/600x400/172B3A/E87524?text=Cartridge+Heater',
        alt: {
          id: 'Cartridge Heater',
          en: 'Cartridge Heater',
        },
        isPrimary: true,
      },
    ],
    price: 650000, // DEMO price
    stock: 100, // DEMO stock
    unit: 'pcs',
  },
  {
    id: 'demo-prod-4',
    sku: 'DEMO-TH-004',
    slug: 'tubular-heater',
    category: 'tubular-heaters',
    status: 'active',
    name: {
      id: 'Tubular Heater',
      en: 'Tubular Heater',
    },
    shortDescription: {
      id: 'Pemanas tubular serbaguna untuk oven dan aplikasi pemanasan udara',
      en: 'Versatile tubular heater for ovens and air heating applications',
    },
    longDescription: {
      id: 'Tubular Heater adalah elemen pemanas yang fleksibel dan serbaguna, cocok untuk berbagai aplikasi seperti oven industri, pemanasan udara, dan sistem HVAC. Dapat dibentuk sesuai kebutuhan dengan performa pemanasan yang handal.',
      en: 'Tubular Heater is a flexible and versatile heating element, suitable for various applications such as industrial ovens, air heating, and HVAC systems. Can be formed as needed with reliable heating performance.',
    },
    specifications: [
      {
        attribute: 'Power',
        value: { id: '1000W - 5000W', en: '1000W - 5000W' },
      },
      {
        attribute: 'Voltage',
        value: { id: '220V - 380V', en: '220V - 380V' },
      },
      {
        attribute: 'Diameter',
        value: { id: '8mm - 16mm', en: '8mm - 16mm' },
      },
      {
        attribute: 'Material',
        value: { id: 'Stainless Steel 304/316', en: 'Stainless Steel 304/316' },
      },
      {
        attribute: 'Max Temperature',
        value: { id: '600°C', en: '600°C' },
      },
    ],
    images: [
      {
        url: 'https://placehold.co/600x400/172B3A/E87524?text=Tubular+Heater',
        alt: {
          id: 'Tubular Heater',
          en: 'Tubular Heater',
        },
        isPrimary: true,
      },
    ],
    price: 1200000, // DEMO price
    stock: 60, // DEMO stock
    unit: 'pcs',
  },
];
