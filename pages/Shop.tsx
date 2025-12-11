import React, { useState, useEffect } from 'react';
import { useStore } from '../contexts/StoreContext';
import { Product, ProductVariant } from '../types';
import { X, Plus, Filter, Minus, ArrowRight } from 'lucide-react';

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
    // 1. Update the selection
    let newOptions = { ...selectedOptions, [optionName]: value };

    // 2. Check if this new combination is valid
    // If not, we try to find a valid combination by keeping the NEWLY selected option
    // and finding the first available variant that has it.

    if (selectedProduct?.variants) {
      const exactMatch = selectedProduct.variants.find(v => {
        return v.selectedOptions.every(opt => {
          const selectedVal = newOptions[opt.name];
          return selectedVal === undefined || selectedVal === opt.value;
        });
      });

      // If no exact match for the new combination, switch to a valid one
      if (!exactMatch) {
        // Find ANY variant that has the new option value
        const validVariant = selectedProduct.variants.find(v =>
          v.selectedOptions.some(opt => opt.name === optionName && opt.value === value)
        );

        if (validVariant) {
          // Switch all options to match this valid variant
          const validOptions: Record<string, string> = {};
          validVariant.selectedOptions.forEach(opt => {
            validOptions[opt.name] = opt.value;
          });
          newOptions = validOptions;
        }
      }
    }

    setSelectedOptions(newOptions);

    // 3. Update current variant based on the (potentially adjusted) newOptions
    if (selectedProduct?.variants) {
      const match = selectedProduct.variants.find(v => {
        return v.selectedOptions.every(opt => {
          const selectedKey = Object.keys(newOptions).find(
            k => k.trim().toLowerCase() === opt.name.trim().toLowerCase()
          );
          return selectedKey ? newOptions[selectedKey] === opt.value : false;
        });
      });
      setCurrentVariant(match || null);
    }
  };

  // Helper to check if an option value is valid given the OTHER currently selected options
  const isOptionValueAvailable = (optionName: string, optionValue: string) => {
    if (!selectedProduct?.variants) return false;

    const normalize = (s: string) => s.trim().toLowerCase();
    const targetName = normalize(optionName);
    const isColor = targetName === 'color' || targetName === 'colour';

    return selectedProduct.variants.some(v => {
      // 1. Variant must have the target value
      const hasValue = v.selectedOptions.some(opt => normalize(opt.name) === targetName && opt.value === optionValue);
      if (!hasValue) return false;

      // 2. Apply constraints
      if (isColor) {
        // Color is Level 1: No constraints from other options.
        // We show all colors that exist in at least one variant.
        return true;
      } else {
        // Other options (Level 2+): Must match selected Color (Level 1).
        // We find the Color key in selectedOptions
        const colorKey = Object.keys(selectedOptions).find(k => {
          const n = normalize(k);
          return n === 'color' || n === 'colour';
        });

        if (colorKey) {
          const selectedColor = selectedOptions[colorKey];
          const variantColor = v.selectedOptions.find(opt => opt.name === colorKey);
          // If variant has a color, it must match selected color
          if (variantColor && variantColor.value !== selectedColor) {
            return false;
          }
        }
        return true;
      }
    });
  };

  const handleQuantityChange = (delta: number) => {
    setQuantity(prev => Math.max(1, prev + delta));
  };

  // Safe fallback if variants are missing (shouldn't happen with correct API data)
  const displayPrice = currentVariant ? currentVariant.price : selectedProduct?.price || 0;
  const displayImage = currentVariant?.image || selectedProduct?.image || '';

  return (
    <div className="pt-8 pb-20 px-4 md:px-8 max-w-[1920px] mx-auto min-h-screen bg-gradient-to-b from-white via-gray-50 to-white">

      {/* Header & Filter */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-12 gap-6">
        <div>
          <h1 className="text-5xl md:text-7xl font-black uppercase tracking-tighter mb-2">
            <span className="gradient-text">Shop</span> All
          </h1>
          <p className="text-gray-500 text-sm">Discover your next performance essential</p>
        </div>

        <div className="flex flex-wrap gap-3 items-center">
          <span className="flex items-center gap-2 text-xs font-bold uppercase text-gray-400">
            <Filter size={14} /> Filter:
          </span>
          {categories.map(cat => (
            <button
              key={cat}
              onClick={() => setFilterCategory(cat)}
              className={`text-xs font-bold uppercase px-5 py-2.5 rounded-full transition-all duration-300 ${filterCategory === cat
                ? 'bg-gradient-to-r from-primary to-secondary text-white shadow-lg scale-105'
                : 'bg-white border border-gray-200 hover:border-primary hover:scale-105 text-gray-700'
                }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
        {filteredProducts.map((product, index) => (
          <div
            key={product.id}
            className="group cursor-pointer"
            onClick={() => openProduct(product)}
            style={{ animation: `slideUp 0.5s ease-out ${index * 0.05}s both` }}
          >
            <div className="relative aspect-[3/4] overflow-hidden rounded-2xl bg-gradient-to-br from-gray-100 to-gray-200 mb-4">
              <img
                src={product.image}
                alt={product.name}
                onError={(e) => { e.currentTarget.src = 'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?q=80&w=800&auto=format&fit=crop'; }}
                className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-700"
              />

              {/* Gradient Overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

              {/* Quick Add Button */}
              <button className="absolute bottom-4 right-4 w-12 h-12 bg-white text-black rounded-full opacity-0 group-hover:opacity-100 transform translate-y-4 group-hover:translate-y-0 transition-all duration-300 flex items-center justify-center shadow-xl hover:scale-110">
                <Plus size={20} strokeWidth={2.5} />
              </button>

              {/* Category Badge */}
              <div className="absolute top-4 left-4 px-3 py-1.5 rounded-full text-[10px] font-bold uppercase tracking-wider glass-dark text-white backdrop-blur-md">
                {product.category}
              </div>
            </div>

            <div className="space-y-2">
              <h3 className="font-bold text-base uppercase tracking-wide group-hover:gradient-text transition-all">
                {product.name}
              </h3>
              <div className="flex items-center justify-between">
                <p className="text-gray-600 font-mono text-sm font-semibold">EGP {product.price}</p>
                <div className="w-8 h-8 rounded-full bg-gradient-to-br from-primary to-secondary opacity-0 group-hover:opacity-100 flex items-center justify-center transition-all duration-300">
                  <ArrowRight size={14} className="text-white" />
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Product Detail Modal */}
      {selectedProduct && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4" style={{ animation: 'fadeIn 0.3s ease-out' }}>
          <div className="absolute inset-0 bg-black/60 backdrop-blur-md" onClick={closeProduct} />
          <div className="relative bg-white w-full max-w-6xl max-h-[90vh] overflow-hidden flex flex-col md:flex-row shadow-2xl rounded-3xl" style={{ animation: 'scaleIn 0.3s ease-out' }}>

            <button
              onClick={closeProduct}
              className="absolute top-6 right-6 z-10 w-12 h-12 bg-white/90 backdrop-blur-sm rounded-full hover:bg-black hover:text-white transition-all duration-300 flex items-center justify-center shadow-lg hover:rotate-90"
            >
              <X size={20} />
            </button>

            {/* Image Side - Updates based on Variant Selection if variant has an image */}
            <div className="w-full md:w-1/2 h-[50vh] md:h-[700px] relative overflow-hidden">
              <img
                src={displayImage}
                alt={selectedProduct.name}
                onError={(e) => { e.currentTarget.src = 'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?q=80&w=800&auto=format&fit=crop'; }}
                className="w-full h-full object-cover"
                style={{ animation: 'fadeIn 0.5s ease-out' }}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent" />
            </div>

            {/* Info Side */}
            <div className="w-full md:w-1/2 p-8 md:p-12 flex flex-col justify-between overflow-y-auto">
              <div>
                <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gray-50 mb-4">
                  <span className="text-xs font-bold uppercase tracking-widest bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
                    {selectedProduct.category}
                  </span>
                </div>

                <h2 className="text-4xl md:text-5xl font-black uppercase tracking-tighter leading-none mb-6">
                  {selectedProduct.name}
                </h2>

                {/* Dynamic Price */}
                <div className="flex items-baseline gap-3 mb-6">
                  <p className="text-3xl font-black gradient-text">EGP {displayPrice}</p>
                  <span className="text-sm text-gray-400 font-medium">Incl. VAT</span>
                </div>

                <p className="text-sm leading-relaxed text-gray-600 mb-8 pl-4 border-l-4 border-primary">
                  {selectedProduct.description}
                </p>

                {/* Dynamic Option Selectors (Size, Color, etc) */}
                {selectedProduct.options && [...selectedProduct.options].sort((a, b) => {
                  const isColorA = a.name.toLowerCase() === 'color' || a.name.toLowerCase() === 'colour';
                  const isColorB = b.name.toLowerCase() === 'color' || b.name.toLowerCase() === 'colour';
                  if (isColorA && !isColorB) return -1;
                  if (!isColorA && isColorB) return 1;
                  return 0;
                }).map((option) => (
                  <div key={option.name} className="mb-6">
                    <span className="text-xs font-bold uppercase tracking-widest block mb-3 text-gray-700">{option.name}</span>
                    <div className="flex flex-wrap gap-2">
                      {option.values.map(val => {
                        const isSelected = selectedOptions[option.name] === val;
                        const isAvailable = isOptionValueAvailable(option.name, val);

                        // If not available with current selection, hide it (or disable it)
                        // User requested "hide", so we use display: none via 'hidden' class
                        if (!isAvailable && !isSelected) {
                          return null;
                        }

                        const isColor = option.name.toLowerCase() === 'color' || option.name.toLowerCase() === 'colour';

                        if (isColor) {
                          // Find the hex code for this color from the variants
                          const colorVariant = selectedProduct.variants?.find(v =>
                            v.selectedOptions.some(opt => opt.name === option.name && opt.value === val)
                          );
                          const colorHex = colorVariant?.color || val.replace(/\s/g, '');

                          // Color Swatch Button
                          return (
                            <button
                              key={val}
                              onClick={() => handleOptionChange(option.name, val)}
                              title={val}
                              className={`w-12 h-12 rounded-full border-2 flex items-center justify-center transition-all duration-300 ${isSelected
                                ? 'ring-4 ring-primary/30 border-white scale-110 shadow-lg'
                                : 'border-gray-300 hover:border-primary hover:scale-105'
                                }`}
                              style={{ backgroundColor: colorHex }}
                            >
                              {/* Indicator for selected state, contrasting with background */}
                              {isSelected && (
                                <div className={`w-2 h-2 rounded-full ${['white', 'ivory', 'cream', 'yellow', 'beige'].some(c => val.toLowerCase().includes(c))
                                  ? 'bg-black'
                                  : 'bg-white'
                                  } shadow-lg`} />
                              )}
                            </button>
                          );
                        }

                        return (
                          <button
                            key={val}
                            onClick={() => handleOptionChange(option.name, val)}
                            className={`min-w-[56px] px-5 h-12 flex items-center justify-center rounded-lg font-bold text-sm transition-all duration-300 ${isSelected
                              ? 'bg-gradient-to-r from-primary to-secondary text-white shadow-lg scale-105'
                              : 'bg-gray-100 border border-gray-200 hover:border-primary hover:scale-105 text-gray-700'
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
                  <span className="text-xs font-bold uppercase tracking-widest block mb-3 text-gray-700">Quantity</span>
                  <div className="flex items-center border-2 border-gray-200 rounded-lg w-36 overflow-hidden">
                    <button
                      onClick={() => handleQuantityChange(-1)}
                      className="w-12 h-12 flex items-center justify-center hover:bg-gradient-to-r hover:from-primary hover:to-secondary hover:text-white transition-all duration-300"
                    >
                      <Minus size={16} />
                    </button>
                    <div className="flex-1 h-12 flex items-center justify-center font-bold text-base">
                      {quantity}
                    </div>
                    <button
                      onClick={() => handleQuantityChange(1)}
                      className="w-12 h-12 flex items-center justify-center hover:bg-gradient-to-r hover:from-primary hover:to-secondary hover:text-white transition-all duration-300"
                    >
                      <Plus size={16} />
                    </button>
                  </div>
                </div>

                {/* Stock Warning */}
                {currentVariant && quantity > (currentVariant.stock_quantity || 0) && (
                  <div className="flex items-center gap-2 px-4 py-2 bg-red-50 border border-red-200 rounded-lg mb-4">
                    <span className="text-red-600 text-xs font-bold uppercase">⚠️ Only {currentVariant.stock_quantity} left in stock</span>
                  </div>
                )}

                {/* Variant Availability Warning */}
                {currentVariant && currentVariant.availableForSale === false && (
                  <div className="flex items-center gap-2 px-4 py-2 bg-red-50 border border-red-200 rounded-lg mb-4">
                    <span className="text-red-600 text-xs font-bold uppercase">⚠️ Sold Out</span>
                  </div>
                )}

                {/* Fallback if combination doesn't exist */}
                {!currentVariant && selectedProduct.variants && selectedProduct.variants.length > 0 && (
                  <div className="flex items-center gap-2 px-4 py-2 bg-yellow-50 border border-yellow-200 rounded-lg mb-4">
                    <span className="text-yellow-700 text-xs font-bold uppercase">⚠️ Unavailable Combination</span>
                  </div>
                )}
              </div>

              <button
                onClick={() => {
                  const hasStock = currentVariant && (currentVariant.stock_quantity || 0) >= quantity;
                  if (currentVariant && currentVariant.availableForSale !== false && hasStock) {
                    addToCart(selectedProduct, currentVariant, quantity);
                    closeProduct();
                  }
                }}
                disabled={!currentVariant || currentVariant.availableForSale === false || (currentVariant && (currentVariant.stock_quantity || 0) < quantity)}
                className={`group relative w-full min-h-[56px] py-4 font-bold uppercase tracking-widest transition-all duration-300 rounded-xl overflow-hidden ${!currentVariant || currentVariant.availableForSale === false || (currentVariant && (currentVariant.stock_quantity || 0) < quantity)
                  ? 'bg-gray-200 text-gray-400 cursor-not-allowed'
                  : 'bg-gradient-to-r from-primary to-secondary text-white hover:shadow-2xl hover:scale-[1.02]'
                  }`}
              >
                <span className="relative z-10 flex items-center justify-center gap-2 min-w-[280px]">
                  {currentVariant && currentVariant.availableForSale !== false
                    ? (
                      (currentVariant.stock_quantity || 0) < quantity ? (
                        <span className="whitespace-nowrap">Insufficient Stock</span>
                      ) : (
                        <>
                          <Plus size={18} className="flex-shrink-0" />
                          <span className="whitespace-nowrap">Add To Cart - EGP {(displayPrice * quantity).toFixed(2)}</span>
                        </>
                      )
                    )
                    : <span className="whitespace-nowrap">Unavailable</span>}
                </span>
                {currentVariant && currentVariant.availableForSale !== false && (currentVariant.stock_quantity || 0) >= quantity && (
                  <div className="absolute inset-0 bg-white/20 transform -skew-x-12 -translate-x-full group-hover:translate-x-full transition-transform duration-700" />
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Shop;