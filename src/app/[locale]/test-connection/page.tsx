'use client';

import { useEffect, useState } from 'react';
import { createClient } from '@/lib/supabase/client';

export default function TestConnectionPage() {
  const [status, setStatus] = useState<string>('Testing...');
  const [categories, setCategories] = useState<any[]>([]);
  const [products, setProducts] = useState<any[]>([]);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function testConnection() {
      const supabase = createClient();
      
      try {
        // Test categories
        const { data: catData, error: catError } = await supabase
          .from('categories')
          .select('*, category_translations(*)')
          .eq('status', 'active');
        
        if (catError) throw catError;
        setCategories(catData || []);
        
        // Test products
        const { data: prodData, error: prodError } = await supabase
          .from('products')
          .select('*, product_translations(*)')
          .eq('status', 'active')
          .limit(4);
        
        if (prodError) throw prodError;
        setProducts(prodData || []);
        
        setStatus('✅ Connected successfully!');
      } catch (err: any) {
        setError(err.message);
        setStatus('❌ Connection failed');
      }
    }
    
    testConnection();
  }, []);

  return (
    <div className="min-h-screen bg-light-gray p-8">
      <div className="max-w-4xl mx-auto">
        <div className="bg-white rounded-lg shadow-md p-8">
          <h1 className="text-3xl font-bold text-navy mb-4">
            Supabase Connection Test
          </h1>
          
          <div className="mb-6">
            <p className="text-lg font-semibold">{status}</p>
            {error && (
              <div className="mt-4 p-4 bg-red-50 border border-red-200 rounded">
                <p className="text-red-700 font-mono text-sm">{error}</p>
              </div>
            )}
          </div>

          {!error && (
            <>
              <div className="mb-6">
                <h2 className="text-xl font-semibold text-navy mb-3">
                  Categories ({categories.length})
                </h2>
                <div className="space-y-2">
                  {categories.map((cat) => (
                    <div key={cat.id} className="p-3 bg-gray-50 rounded">
                      <p className="font-medium">{cat.slug}</p>
                      <p className="text-sm text-gray-600">
                        Translations: {cat.category_translations?.length || 0}
                      </p>
                    </div>
                  ))}
                </div>
              </div>

              <div>
                <h2 className="text-xl font-semibold text-navy mb-3">
                  Products ({products.length})
                </h2>
                <div className="space-y-2">
                  {products.map((prod) => (
                    <div key={prod.id} className="p-3 bg-gray-50 rounded">
                      <p className="font-medium">{prod.sku}</p>
                      <p className="text-sm text-gray-600">
                        Price: Rp {prod.price?.toLocaleString('id-ID')} | Stock: {prod.stock}
                      </p>
                      <p className="text-sm text-gray-600">
                        Translations: {prod.product_translations?.length || 0}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            </>
          )}

          <div className="mt-8 p-4 bg-blue-50 border border-blue-200 rounded">
            <h3 className="font-semibold text-navy mb-2">Next Steps:</h3>
            <ul className="list-disc list-inside space-y-1 text-sm">
              <li>Jika berhasil: Lanjut ke implementasi Auth UI</li>
              <li>Jika error "relation does not exist": Jalankan schema.sql di Supabase</li>
              <li>Jika error "row-level security": Policy belum sempurna (normal untuk tahap ini)</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
