import React, { useState } from 'react';
import { useStore } from '../contexts/StoreContext';
import { Product } from '../types';
import { X, Plus, Filter } from 'lucide-react';

const SIZES = ['S', 'M', 'L', 'XL'];

const Shop: React.FC = () => {
  const { products, addToCart } = useStore();
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [selectedSize, setSelectedSize] = useState<string>('M');
  const [filterCategory, setFilterCategory] = useState<string>('All');

  const categories = ['All', ...Array.from(new Set(products.map(p => p.category)))];

  const filteredProducts = filterCategory === 'All' 
    ? products 
    : products.filter(p => p.category === filterCategory);

  const openProduct = (product: Product) => {
    setSelectedProduct(product);
    setSelectedSize('M');
  };

  const closeProduct = () => setSelectedProduct(null);

  return (
    <div className="pt-8 pb-20 px-4 md:px-8 max-w-[1920px] mx-auto min-h-screen">
      
      {/* Header & Filter */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-12 gap-6">
        <h1 className="text-4xl md:text-6xl font-black uppercase tracking-tighter italic">
          Shop All
        </h1>
        
        <div className="flex flex-wrap gap-4 items-center">
            <span className="flex items-center gap-2 text-sm font-bold uppercase">
                <Filter size={16} /> Filter:
            </span>
            {categories.map(cat => (
                <button
                    key={cat}
                    onClick={() => setFilterCategory(cat)}
                    className={`text-xs font-bold uppercase px-4 py-2 border ${
                        filterCategory === cat ? 'bg-black text-white border-black' : 'border-gray-200 hover:border-black'
                    } transition-colors`}
                >
                    {cat}
                </button>
            ))}
        </div>
      </div>

      {/* Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-y-12 gap-x-6">
        {filteredProducts.map((product) => (
          <div key={product.id} className="group cursor-pointer" onClick={() => openProduct(product)}>
            <div className="relative aspect-[3/4] overflow-hidden bg-gray-100 mb-4">
              <img 
                src={product.image} 
                alt={product.name}
                className="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-500"
              />
              <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors" />
              <button className="absolute bottom-4 right-4 bg-white text-black p-2 rounded-full opacity-0 group-hover:opacity-100 transform translate-y-4 group-hover:translate-y-0 transition-all duration-300">
                 <Plus size={20} />
              </button>
            </div>
            <div className="space-y-1">
              <h3 className="font-bold text-sm uppercase tracking-wide group-hover:underline decoration-1 underline-offset-4">
                {product.name}
              </h3>
              <p className="text-gray-500 font-mono text-xs">${product.price}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Product Detail Modal */}
      {selectedProduct && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={closeProduct} />
          <div className="relative bg-white w-full max-w-5xl h-[90vh] md:h-auto overflow-y-auto md:overflow-hidden flex flex-col md:flex-row shadow-2xl animate-[scaleIn_0.2s_ease-out]">
            
            <button 
                onClick={closeProduct} 
                className="absolute top-4 right-4 z-10 bg-white/80 p-2 rounded-full hover:bg-black hover:text-white transition-colors"
            >
                <X size={24} />
            </button>

            {/* Image Side */}
            <div className="w-full md:w-1/2 h-[50vh] md:h-[700px]">
              <img src={selectedProduct.image} alt={selectedProduct.name} className="w-full h-full object-cover" />
            </div>

            {/* Info Side */}
            <div className="w-full md:w-1/2 p-8 md:p-12 flex flex-col justify-between">
               <div>
                   <span className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-2 block">
                       {selectedProduct.category}
                   </span>
                   <h2 className="text-3xl md:text-5xl font-black uppercase tracking-tighter leading-none mb-4">
                       {selectedProduct.name}
                   </h2>
                   <p className="text-2xl font-mono mb-8">${selectedProduct.price}</p>
                   
                   <p className="text-sm leading-relaxed text-gray-600 mb-8 border-l-2 border-black pl-4">
                       {selectedProduct.description}
                   </p>

                   {/* Size Selector */}
                   <div className="mb-8">
                       <span className="text-xs font-bold uppercase tracking-widest block mb-3">Select Size</span>
                       <div className="flex gap-2">
                           {SIZES.map(size => (
                               <button 
                                   key={size}
                                   onClick={() => setSelectedSize(size)}
                                   className={`w-12 h-12 flex items-center justify-center border font-bold text-sm ${
                                       selectedSize === size ? 'bg-black text-white border-black' : 'border-gray-200 hover:border-black'
                                   }`}
                               >
                                   {size}
                               </button>
                           ))}
                       </div>
                   </div>
               </div>

               <button 
                   onClick={() => {
                       addToCart(selectedProduct, selectedSize);
                       closeProduct();
                   }}
                   className="w-full bg-black text-white py-4 font-bold uppercase tracking-widest hover:bg-gray-800 transition-colors"
               >
                   Add To Cart - ${(selectedProduct.price).toFixed(2)}
               </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Shop;
