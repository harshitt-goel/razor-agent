import React, { useState, useEffect } from 'react';
import { Product } from '../../types';
import { api } from '../../services/api';
import { Store, Search, Filter, Star, CheckCircle } from 'lucide-react';

export const CatalogGridModal: React.FC = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('ALL');
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadProducts();
  }, []);

  const loadProducts = async () => {
    setIsLoading(true);
    const data = await api.searchProducts('');
    setProducts(data);
    setIsLoading(false);
  };

  const categories = ['ALL', 'Audio', 'Accessories', 'Office', 'Gaming', 'Fitness', 'Electronics'];

  const filteredProducts = products.filter(p => {
    const matchesSearch = searchQuery === '' || 
      p.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
      p.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.brand.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesCat = selectedCategory === 'ALL' || p.category.toLowerCase() === selectedCategory.toLowerCase();
    return matchesSearch && matchesCat;
  });

  return (
    <div className="space-y-6 text-slate-100 animate-fadeIn">
      
      {/* Header */}
      <div className="bg-[#151c2e] border border-cyan-500/30 rounded-2xl p-6 shadow-xl flex flex-wrap items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-xl font-extrabold text-white">Merchant Catalog Inspector</h2>
            <span className="text-xs font-bold text-cyan-400 bg-cyan-500/10 border border-cyan-500/30 px-3 py-1 rounded-full uppercase">
              50+ Products Seeded
            </span>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            Real merchant inventory graph indexed by RazorAgent tool calling layer with complementary product mappings.
          </p>
        </div>

        <div className="text-xs font-mono text-slate-300 bg-slate-900 px-3.5 py-2 rounded-xl border border-slate-800">
          Total Products: <span className="text-cyan-400 font-bold">{products.length}</span>
        </div>
      </div>

      {/* Filter Bar */}
      <div className="flex flex-wrap items-center justify-between gap-4 bg-[#151c2e] p-4 rounded-2xl border border-slate-800">
        
        {/* Search Input */}
        <div className="flex items-center gap-2 bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs w-full sm:w-72 focus-within:border-cyan-500 transition">
          <Search className="w-4 h-4 text-slate-500" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search catalog products, brands, tags..."
            className="bg-transparent outline-none text-white w-full placeholder-slate-500"
          />
        </div>

        {/* Category Pills */}
        <div className="flex flex-wrap items-center gap-1.5">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition ${
                selectedCategory === cat
                  ? 'bg-cyan-500 text-white shadow-md shadow-cyan-500/25'
                  : 'bg-slate-900 text-slate-400 hover:bg-slate-800 hover:text-slate-200'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Products Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredProducts.map((product) => (
          <div
            key={product.id}
            className="bg-[#151c2e] border border-slate-800 hover:border-cyan-500/50 rounded-2xl p-4 flex flex-col justify-between transition group space-y-3"
          >
            <div className="space-y-3">
              <div className="relative h-40 rounded-xl overflow-hidden bg-slate-950 border border-slate-800">
                <img
                  src={product.imageUrl}
                  alt={product.name}
                  className="w-full h-full object-cover group-hover:scale-105 transition duration-300"
                />
                <span className="absolute top-2 left-2 text-[10px] font-bold uppercase tracking-wider text-cyan-400 bg-slate-950/80 px-2 py-0.5 rounded border border-cyan-500/30 backdrop-blur">
                  {product.category}
                </span>
                <span className="absolute top-2 right-2 text-[10px] font-bold text-amber-400 bg-slate-950/80 px-2 py-0.5 rounded border border-amber-500/30 flex items-center gap-1 backdrop-blur">
                  <Star className="w-3 h-3 fill-current" />
                  {product.rating || 4.5}
                </span>
              </div>

              <div>
                <div className="text-[10px] text-slate-400 font-mono">{product.brand} • ID: {product.id}</div>
                <h4 className="font-bold text-sm text-white line-clamp-1 mt-0.5">{product.name}</h4>
                <p className="text-xs text-slate-400 line-clamp-2 mt-1">{product.description}</p>
              </div>
            </div>

            <div className="pt-3 border-t border-slate-800/80 flex items-center justify-between font-mono text-xs">
              <div className="text-lg font-black text-white">₹{product.price.toLocaleString()}</div>
              <span className="text-[10px] font-bold text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/30">
                In Stock ({product.inventory})
              </span>
            </div>
          </div>
        ))}
      </div>

    </div>
  );
};
