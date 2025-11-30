import React, { useState, useEffect } from 'react';
import { useStore } from '../contexts/StoreContext';
import { Product, ProductVariant } from '../types';
import { X, Plus, Filter, Minus } from 'lucide-react';

const Shop: React.FC = () => {
  const { products, addToCart } = useStore();
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);

  // State to track selected options (e.g., { "Size": "M", "Color": "Blue" })
  const [selectedOptions, setSelectedOptions] = useState<Record<string, string>>({});
  const [currentVariant, setCurrentVariant] = useState<ProductVariant | null>(null);
  const [quantity, setQuantity] = useState(1);

  const [filterCategory, setFilterCategory] = useState<string>('All');

  const categories = ['All', ...Array.from(new Set(products.map(p => p.category)))];

  const filteredProducts = filterCategory === 'All'
    ? products
    : products.filter(p => p.category === filterCategory);

  const openProduct = (product: Product) => {
    setSelectedProduct(product);
    setQuantity(1);

    // Initialize options with the first variant's options (default selection)
    if (product.variants && product.variants.length > 0) {
      const defaultOptions: Record<string, string> = {};
      product.variants[0].selectedOptions.forEach(opt => {
        defaultOptions[opt.name] = opt.value;
      });
      setSelectedOptions(defaultOptions);
      setCurrentVariant(product.variants[0]);
    } else {
      setSelectedOptions({});
      setCurrentVariant(null);
    }
  };

  const closeProduct = () => setSelectedProduct(null);

  const handleOptionChange = (optionName: string, value: string) => {
    const newOptions = { ...selectedOptions, [optionName]: value };
    setSelectedOptions(newOptions);

    // Find the variant that matches all new options
    if (selectedProduct?.variants) {
      const match = selectedProduct.variants.find(v => {
        return v.selectedOptions.every(opt => newOptions[opt.name] === opt.value);
      });
      setCurrentVariant(match || null);
    }
  };

  const handleQuantityChange = (delta: number) => {
    setQuantity(prev => Math.max(1, prev + delta));
  };

  // Safe fallback if variants are missing (shouldn't happen with correct API data)
  const displayPrice = currentVariant ? currentVariant.price : selectedProduct?.price || 0;
  const displayImage = currentVariant?.image || selectedProduct?.image || '';

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
              className={`text-xs font-bold uppercase px-4 py-2 border ${filterCategory === cat ? 'bg-black text-white border-black' : 'border-gray-200 hover:border-black'
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
                onError={(e) => { e.currentTarget.src = 'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?q=80&w=800&auto=format&fit=crop'; }}
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
              <p className="text-gray-500 font-mono text-xs">EGP {product.price}</p>
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

            {/* Image Side - Updates based on Variant Selection if variant has an image */}
            <div className="w-full md:w-1/2 h-[50vh] md:h-[700px]">
              <img
                src={displayImage}
                alt={selectedProduct.name}
                onError={(e) => { e.currentTarget.src = 'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?q=80&w=800&auto=format&fit=crop'; }}
                className="w-full h-full object-cover"
              />
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
                {/* Dynamic Price */}
                <p className="text-2xl font-mono mb-8">EGP {displayPrice}</p>

                <p className="text-sm leading-relaxed text-gray-600 mb-8 border-l-2 border-black pl-4">
                  {selectedProduct.description}
                </p>

                {/* Dynamic Option Selectors (Size, Color, etc) */}
                {selectedProduct.options && selectedProduct.options.map((option) => (
                  <div key={option.name} className="mb-6">
                    <span className="text-xs font-bold uppercase tracking-widest block mb-3">{option.name}</span>
                    <div className="flex flex-wrap gap-2">
                      {option.values.map(val => {
                        const isSelected = selectedOptions[option.name] === val;
                        const isColor = option.name.toLowerCase() === 'color' || option.name.toLowerCase() === 'colour';

                        if (isColor) {
                          // Color Swatch Button
                          return (
                            <button
                              key={val}
                              onClick={() => handleOptionChange(option.name, val)}
                              title={val}
                              className={`w-10 h-10 rounded-full border flex items-center justify-center transition-all ${isSelected
                                ? 'ring-2 ring-offset-2 ring-black border-transparent'
                                : 'border-gray-200 hover:border-black'
                                }`}
                              style={{ backgroundColor: val.replace(/\s/g, '') }}
                            >
                              {/* Indicator for selected state, contrasting with background */}
                              {isSelected && (
                                <div className={`w-1.5 h-1.5 rounded-full ${['white', 'ivory', 'cream', 'yellow', 'beige'].some(c => val.toLowerCase().includes(c))
                                  ? 'bg-black'
                                  : 'bg-white'
                                  }`} />
                              )}
                            </button>
                          );
                        }

                        return (
                          <button
                            key={val}
                            onClick={() => handleOptionChange(option.name, val)}
                            className={`min-w-[48px] px-4 h-12 flex items-center justify-center border font-bold text-sm transition-all ${isSelected
                              ? 'bg-black text-white border-black'
                              : 'border-gray-200 hover:border-black text-gray-600'
                              }`}
                          >
                            {val}
                          </button>
                        );
                      })}
                    </div>
                  </div>
                ))}

                {/* Quantity Selector */}
                <div className="mb-8">
                  <span className="text-xs font-bold uppercase tracking-widest block mb-3">Quantity</span>
                  <div className="flex items-center border border-gray-200 w-32">
                    <button
                      onClick={() => handleQuantityChange(-1)}
                      className="w-10 h-12 flex items-center justify-center hover:bg-gray-100 transition-colors"
                    >
                      <Minus size={16} />
                    </button>
                    <div className="flex-1 h-12 flex items-center justify-center font-bold text-sm border-x border-gray-200">
                      {quantity}
                    </div>
                    <button
                      onClick={() => handleQuantityChange(1)}
                      className="w-10 h-12 flex items-center justify-center hover:bg-gray-100 transition-colors"
                    >
                      <Plus size={16} />
                    </button>
                  </div>
                </div>

                {/* Variant Availability Warning */}
                {currentVariant && currentVariant.availableForSale === false && (
                  <p className="text-red-500 text-xs font-bold uppercase mb-4">Sold Out</p>
                )}

                {/* Fallback if combination doesn't exist */}
                {!currentVariant && selectedProduct.variants && selectedProduct.variants.length > 0 && (
                  <p className="text-red-500 text-xs font-bold uppercase mb-4">Unavailable Combination</p>
                )}
              </div>

              <button
                onClick={() => {
                  if (currentVariant && currentVariant.availableForSale !== false) {
                    addToCart(selectedProduct, currentVariant, quantity);
                    closeProduct();
                  }
                }}
                disabled={!currentVariant || currentVariant.availableForSale === false}
                className={`w-full py-4 font-bold uppercase tracking-widest transition-colors ${!currentVariant || currentVariant.availableForSale === false
                  ? 'bg-gray-200 text-gray-400 cursor-not-allowed'
                  : 'bg-black text-white hover:bg-gray-800'
                  }`}
              >
                {currentVariant && currentVariant.availableForSale !== false
                  ? `Add To Cart - EGP ${(displayPrice * quantity).toFixed(2)}`
                  : 'Unavailable'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Shop;