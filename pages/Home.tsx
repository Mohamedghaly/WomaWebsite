import React from 'react';
import { Link } from 'react-router-dom';
import { useStore } from '../contexts/StoreContext';
import { ArrowRight } from 'lucide-react';

const Home: React.FC = () => {
  const { products } = useStore();
  const featured = products.slice(0, 4);

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative h-[85vh] w-full bg-gray-100 overflow-hidden flex items-center justify-center">
         {/* Updated Banner Image */}
         {/* REPLACE THE SRC BELOW WITH YOUR IMAGE URL */}
         <img 
            src="https://images.unsplash.com/photo-1534438327276-14e5300c3a48?q=80&w=1920&auto=format&fit=crop" 
            className="absolute inset-0 w-full h-full object-cover grayscale opacity-80"
            alt="Woma Sportswear Hero"
         />
         <div className="absolute inset-0 bg-black/30" />
         
         <div className="relative z-10 text-center text-white space-y-6 px-4">
            <h1 className="text-6xl md:text-9xl font-black tracking-tighter uppercase italic leading-none">
              Push <br/> Limits
            </h1>
            <p className="text-lg md:text-xl font-medium tracking-widest uppercase">
              Performance Collection / Fall-Winter
            </p>
            <div className="pt-8">
              <Link to="/shop" className="bg-white text-black px-8 py-4 text-sm font-bold uppercase tracking-widest hover:bg-black hover:text-white transition-colors duration-300">
                Shop The Drop
              </Link>
            </div>
         </div>
      </section>

      {/* Marquee */}
      <div className="bg-black py-4 overflow-hidden whitespace-nowrap border-y border-white/10">
        <div className="inline-block animate-marquee">
          <span className="text-white text-4xl md:text-6xl font-black uppercase italic tracking-tighter mx-4 opacity-80">
            Woma • Sportswear • High Performance • Worldwide Shipping • Woma • No Limits • 
            Woma • Sportswear • High Performance • Worldwide Shipping • Woma • No Limits •
          </span>
          <span className="text-white text-4xl md:text-6xl font-black uppercase italic tracking-tighter mx-4 opacity-80">
            Woma • Sportswear • High Performance • Worldwide Shipping • Woma • No Limits • 
            Woma • Sportswear • High Performance • Worldwide Shipping • Woma • No Limits •
          </span>
        </div>
      </div>

      {/* Featured Grid */}
      <section className="py-20 px-4 md:px-8 max-w-[1920px] mx-auto">
        <div className="flex justify-between items-end mb-12">
          <h2 className="text-4xl font-black uppercase tracking-tighter">Trending Gear</h2>
          <Link to="/shop" className="group flex items-center gap-2 text-sm font-bold uppercase tracking-widest">
            View All <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-y-12 gap-x-6">
          {featured.map((product) => (
             <Link to={`/shop`} key={product.id} className="group block cursor-pointer">
              <div className="relative aspect-[3/4] overflow-hidden bg-gray-100 mb-4">
                 <img 
                   src={product.image} 
                   alt={product.name}
                   className="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-500"
                 />
                 {product.isNew && (
                   <span className="absolute top-4 left-4 bg-black text-white text-[10px] font-bold px-2 py-1 uppercase tracking-wider">
                     New Arrival
                   </span>
                 )}
              </div>
              <div className="space-y-1">
                <h3 className="font-bold text-sm uppercase tracking-wide group-hover:underline decoration-1 underline-offset-4">
                  {product.name}
                </h3>
                {/* Updated Currency to EGP */}
                <p className="text-gray-500 font-mono text-sm">EGP {product.price}</p>
              </div>
             </Link>
          ))}
        </div>
      </section>

      {/* Visual Break */}
      <section className="grid grid-cols-1 md:grid-cols-2 h-[600px]">
         <div className="bg-black text-white p-12 flex flex-col justify-center items-start">
            <h2 className="text-5xl font-black uppercase tracking-tighter leading-tight mb-6">
              Engineered <br/> for Motion.
            </h2>
            <p className="max-w-md text-gray-400 mb-8 leading-relaxed">
              We design gear that moves with you. From the squat rack to the streets, Woma delivers uncompromising performance and style.
            </p>
            <Link to="/about" className="border border-white px-8 py-3 text-xs font-bold uppercase tracking-widest hover:bg-white hover:text-black transition-colors">
              Our Technology
            </Link>
         </div>
         <div className="relative h-full bg-gray-200">
           <img src="https://images.unsplash.com/photo-1594381898411-846e7d193883?q=80&w=1920&auto=format&fit=crop" className="absolute inset-0 w-full h-full object-cover" alt="Lifestyle" />
         </div>
      </section>
    </div>
  );
};

export default Home;