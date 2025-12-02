import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useStore } from '../contexts/StoreContext';
import { ArrowRight, Sparkles, Zap, TrendingUp } from 'lucide-react';

const Home: React.FC = () => {
  const { products } = useStore();
  const featured = products.slice(0, 4);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setMousePosition({ x: e.clientX, y: e.clientY });
    };
    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  return (
    <div className="min-h-screen bg-white relative overflow-hidden">
      {/* Animated Background Elements */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
        <div
          className="absolute w-96 h-96 rounded-full opacity-20 blur-3xl"
          style={{
            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
            left: `${mousePosition.x / 20}px`,
            top: `${mousePosition.y / 20}px`,
            transition: 'all 0.3s ease-out',
          }}
        />
        <div
          className="absolute w-96 h-96 rounded-full opacity-20 blur-3xl"
          style={{
            background: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)',
            right: `${mousePosition.x / 30}px`,
            bottom: `${mousePosition.y / 30}px`,
            transition: 'all 0.5s ease-out',
          }}
        />
      </div>

      {/* Hero Section */}
      <section className="relative h-[90vh] w-full overflow-hidden flex items-center justify-center">
        {/* Animated Gradient Overlay */}
        <div className="absolute inset-0 animated-gradient opacity-30" />

        {/* Hero Image */}
        <img
          src="https://images.unsplash.com/photo-1534438327276-14e5300c3a48?q=80&w=1920&auto=format&fit=crop"
          className="absolute inset-0 w-full h-full object-cover"
          alt="Woma Sportswear Hero"
          style={{ animation: 'fadeIn 1s ease-out' }}
        />
        <div className="absolute inset-0 bg-gradient-to-b from-black/50 via-black/30 to-black/60" />

        {/* Floating Elements */}
        <div className="absolute top-20 left-10 md:left-20" style={{ animation: 'float 6s ease-in-out infinite' }}>
          <Sparkles className="text-white/30" size={40} />
        </div>
        <div className="absolute bottom-20 right-10 md:right-20" style={{ animation: 'float 8s ease-in-out infinite 2s' }}>
          <Zap className="text-white/30" size={50} />
        </div>

        {/* Hero Content */}
        <div className="relative z-10 text-center text-white space-y-8 px-4 max-w-5xl" style={{ animation: 'slideUp 1s ease-out' }}>
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass-dark mb-4">
            <TrendingUp size={16} />
            <span className="text-xs font-bold uppercase tracking-widest">Fall-Winter 2024</span>
          </div>

          <h1 className="text-6xl md:text-9xl font-black tracking-tighter uppercase leading-none">
            <span className="inline-block" style={{ animation: 'slideDown 1s ease-out 0.2s both' }}>
              Push
            </span>
            <br />
            <span className="inline-block gradient-text-cyber" style={{ animation: 'slideDown 1s ease-out 0.4s both' }}>
              Your Limits
            </span>
          </h1>

          <p className="text-lg md:text-2xl font-medium tracking-wide max-w-2xl mx-auto" style={{ animation: 'slideUp 1s ease-out 0.6s both' }}>
            Performance meets style. Engineered for the relentless.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center pt-8" style={{ animation: 'slideUp 1s ease-out 0.8s both' }}>
            <Link
              to="/shop"
              className="group relative px-8 py-4 text-sm font-bold uppercase tracking-widest overflow-hidden rounded-lg transition-all duration-300 hover:scale-105"
              style={{ background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)' }}
            >
              <span className="relative z-10">Shop The Drop</span>
              <div className="absolute inset-0 bg-white/20 transform -skew-x-12 -translate-x-full group-hover:translate-x-full transition-transform duration-700" />
            </Link>

            <Link
              to="/about"
              className="group px-8 py-4 text-sm font-bold uppercase tracking-widest border-2 border-white rounded-lg hover:bg-white hover:text-black transition-all duration-300"
            >
              Discover More
            </Link>
          </div>
        </div>

        {/* Scroll Indicator */}
        <div className="absolute bottom-10 left-1/2 transform -translate-x-1/2" style={{ animation: 'bounce 2s infinite' }}>
          <div className="w-6 h-10 border-2 border-white/50 rounded-full flex justify-center pt-2">
            <div className="w-1 h-2 bg-white/50 rounded-full" style={{ animation: 'pulse 2s infinite' }} />
          </div>
        </div>
      </section>

      {/* Animated Marquee */}
      <div className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-black via-gray-900 to-black" />
        <div className="relative py-6 overflow-hidden whitespace-nowrap border-y border-white/10">
          <div className="inline-block animate-marquee">
            <span className="text-white text-3xl md:text-5xl font-black uppercase italic tracking-tighter mx-6">
              🔥 Woma • Sportswear • High Performance • Worldwide Shipping • No Limits •
              🔥 Woma • Sportswear • High Performance • Worldwide Shipping • No Limits •
            </span>
            <span className="text-white text-3xl md:text-5xl font-black uppercase italic tracking-tighter mx-6">
              🔥 Woma • Sportswear • High Performance • Worldwide Shipping • No Limits •
              🔥 Woma • Sportswear • High Performance • Worldwide Shipping • No Limits •
            </span>
          </div>
        </div>
      </div>

      {/* Featured Grid */}
      <section className="relative py-24 px-4 md:px-8 max-w-[1920px] mx-auto">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-16 gap-4">
          <div>
            <h2 className="text-5xl md:text-6xl font-black uppercase tracking-tighter mb-3">
              <span className="gradient-text">Trending</span> Gear
            </h2>
            <p className="text-gray-500 text-sm md:text-base">Curated picks for peak performance</p>
          </div>
          <Link
            to="/shop"
            className="group flex items-center gap-2 px-6 py-3 bg-black text-white rounded-full text-sm font-bold uppercase tracking-widest hover:bg-gradient-to-r hover:from-purple-600 hover:to-pink-600 transition-all duration-300"
          >
            View All
            <ArrowRight size={16} className="group-hover:translate-x-2 transition-transform duration-300" />
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {featured.map((product, index) => (
            <Link
              to={`/shop`}
              key={product.id}
              className="group block cursor-pointer"
              style={{ animation: `slideUp 0.6s ease-out ${index * 0.1}s both` }}
            >
              <div className="relative aspect-[3/4] overflow-hidden rounded-2xl mb-4 bg-gradient-to-br from-gray-100 to-gray-200">
                <img
                  src={product.image}
                  alt={product.name}
                  className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-700"
                />

                {/* Gradient Overlay on Hover */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

                {/* New Badge */}
                {product.isNew && (
                  <div className="absolute top-4 left-4 px-3 py-1.5 rounded-full text-[10px] font-bold uppercase tracking-wider glass-dark text-white backdrop-blur-md">
                    <span className="flex items-center gap-1">
                      <Sparkles size={12} />
                      New
                    </span>
                  </div>
                )}

                {/* Quick View Button */}
                <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 translate-y-8 group-hover:translate-y-0 opacity-0 group-hover:opacity-100 transition-all duration-300">
                  <div className="px-6 py-2 bg-white text-black rounded-full text-xs font-bold uppercase tracking-wider shadow-xl hover:scale-105 transition-transform">
                    Quick View
                  </div>
                </div>
              </div>

              <div className="space-y-2">
                <h3 className="font-bold text-base uppercase tracking-wide group-hover:gradient-text transition-all">
                  {product.name}
                </h3>
                <div className="flex items-center justify-between">
                  <p className="text-gray-600 font-mono text-sm font-semibold">EGP {product.price}</p>
                  <div className="w-8 h-8 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-all duration-300">
                    <ArrowRight size={14} className="text-white" />
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* Visual Break - Enhanced */}
      <section className="grid grid-cols-1 md:grid-cols-2 min-h-[600px] relative overflow-hidden">
        {/* Left Side - Content */}
        <div className="relative p-12 md:p-16 flex flex-col justify-center items-start bg-gradient-to-br from-gray-900 via-black to-gray-900 text-white">
          <div className="absolute inset-0 opacity-10">
            <div className="absolute top-0 left-0 w-full h-full" style={{ backgroundImage: 'radial-gradient(circle, #ffffff 1px, transparent 1px)', backgroundSize: '50px 50px' }} />
          </div>

          <div className="relative z-10 max-w-xl">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass-effect mb-6">
              <Zap size={16} className="text-yellow-400" />
              <span className="text-xs font-bold uppercase tracking-widest">Innovation</span>
            </div>

            <h2 className="text-5xl md:text-6xl font-black uppercase tracking-tighter leading-tight mb-6">
              Engineered <br />
              <span className="gradient-text-cyber">for Motion.</span>
            </h2>

            <p className="text-gray-300 mb-8 leading-relaxed text-lg">
              We design gear that moves with you. From the squat rack to the streets, Woma delivers uncompromising performance and style.
            </p>

            <div className="flex flex-col sm:flex-row gap-4">
              <Link
                to="/about"
                className="group px-8 py-4 border-2 border-white rounded-lg text-sm font-bold uppercase tracking-widest hover:bg-white hover:text-black transition-all duration-300 text-center"
              >
                Our Technology
              </Link>
              <Link
                to="/shop"
                className="px-8 py-4 bg-gradient-to-r from-purple-600 to-pink-600 rounded-lg text-sm font-bold uppercase tracking-widest hover:scale-105 transition-all duration-300 text-center"
              >
                Shop Now
              </Link>
            </div>
          </div>
        </div>

        {/* Right Side - Image */}
        <div className="relative h-full min-h-[400px] md:min-h-0">
          <img
            src="https://images.unsplash.com/photo-1594381898411-846e7d193883?q=80&w=1920&auto=format&fit=crop"
            className="absolute inset-0 w-full h-full object-cover"
            alt="Lifestyle"
          />
          <div className="absolute inset-0 bg-gradient-to-l from-transparent to-black/20" />

          {/* Floating Stats */}
          <div className="absolute top-8 right-8 glass-dark p-6 rounded-2xl backdrop-blur-md" style={{ animation: 'float 4s ease-in-out infinite' }}>
            <div className="text-4xl font-black gradient-text-sunset mb-1">10K+</div>
            <div className="text-xs uppercase tracking-wider text-white/80">Happy Athletes</div>
          </div>

          <div className="absolute bottom-8 left-8 glass-dark p-6 rounded-2xl backdrop-blur-md" style={{ animation: 'float 5s ease-in-out infinite 1s' }}>
            <div className="text-4xl font-black gradient-text-cyber mb-1">100%</div>
            <div className="text-xs uppercase tracking-wider text-white/80">Performance</div>
          </div>
        </div>
      </section>

      {/* Trust Indicators */}
      <section className="py-16 px-4 bg-gray-50">
        <div className="max-w-6xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
          {[
            { icon: '🚚', title: 'Free Shipping', desc: 'On orders over EGP 500' },
            { icon: '🔄', title: 'Easy Returns', desc: '30-day return policy' },
            { icon: '⚡', title: 'Fast Delivery', desc: '2-5 business days' },
            { icon: '🛡️', title: 'Secure Payment', desc: '100% protected' },
          ].map((item, index) => (
            <div
              key={index}
              className="p-6 rounded-2xl hover:bg-white hover:shadow-xl transition-all duration-300 cursor-pointer group"
              style={{ animation: `slideUp 0.6s ease-out ${index * 0.1}s both` }}
            >
              <div className="text-4xl mb-3 group-hover:scale-110 transition-transform duration-300">{item.icon}</div>
              <h3 className="font-bold text-sm uppercase mb-1">{item.title}</h3>
              <p className="text-xs text-gray-500">{item.desc}</p>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
};

export default Home;