/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  ShoppingBag, 
  Menu, 
  X, 
  ArrowRight, 
  Plus, 
  Minus, 
  ChevronRight, 
  Instagram, 
  MessageCircle,
  Truck,
  ShieldCheck,
  RefreshCcw,
  ArrowLeft
} from 'lucide-react';
import { Product, CartItem, View } from './types';
import { PRODUCTS, BRAND_NAME, BRAND_TAGLINE, SHIPPING_FAQ, PAYMENTS_FAQ } from './constants';

// --- Components ---

const CurrencyFormatter = ({ value }: { value: number }) => {
  return (
    <span>
      {new Intl.NumberFormat('id-ID', {
        style: 'currency',
        currency: 'IDR',
        minimumFractionDigits: 0,
      }).format(value)}
    </span>
  );
};

export default function App() {
  const [view, setView] = useState<View>('home');
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [cart, setCart] = useState<CartItem[]>([]);
  const [isBagOpen, setIsBagOpen] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [checkoutStep, setCheckoutStep] = useState(1);
  const [isLoading, setIsLoading] = useState(true);

  // Preloader effect
  useEffect(() => {
    const timer = setTimeout(() => setIsLoading(false), 2000);
    return () => clearTimeout(timer);
  }, []);

  const totalItems = useMemo(() => cart.reduce((acc, item) => acc + item.quantity, 0), [cart]);
  const subtotal = useMemo(() => cart.reduce((acc, item) => acc + (item.price * item.quantity), 0), [cart]);

  const addToCart = (product: Product, size: string) => {
    setCart(prev => {
      const existing = prev.find(item => item.id === product.id && item.selectedSize === size);
      if (existing) {
        return prev.map(item => 
          item.id === product.id && item.selectedSize === size 
            ? { ...item, quantity: item.quantity + 1 } 
            : item
        );
      }
      return [...prev, { ...product, selectedSize: size, quantity: 1 }];
    });
    setIsBagOpen(true);
  };

  const removeFromCart = (id: string, size: string) => {
    setCart(prev => prev.filter(item => !(item.id === id && item.selectedSize === size)));
  };

  const updateQuantity = (id: string, size: string, delta: number) => {
    setCart(prev => prev.map(item => {
      if (item.id === id && item.selectedSize === size) {
        const newQty = Math.max(1, item.quantity + delta);
        return { ...item, quantity: newQty };
      }
      return item;
    }));
  };

  const navigateToProduct = (product: Product) => {
    setSelectedProduct(product);
    setView('product');
    window.scrollTo(0, 0);
  };

  const handleCheckout = () => {
    setView('checkout');
    setIsBagOpen(false);
    window.scrollTo(0, 0);
  };

  // --- Views ---

  // Loading Screen
  if (isLoading) {
    return (
      <div className="fixed inset-0 bg-brand-charcoal flex items-center justify-center z-50">
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-brand-bone font-mono text-xl tracking-widest"
        >
          <motion.span
            animate={{ opacity: [0, 1, 0] }}
            transition={{ duration: 1, repeat: Infinity, ease: "easeInOut" }}
          >
            00
          </motion.span>
          <span className="mx-2">/</span>
          <motion.span
            animate={{ opacity: [0, 1, 0] }}
            transition={{ duration: 1, repeat: Infinity, ease: "easeInOut", delay: 0.5 }}
          >
            STUDIO RITUAL
          </motion.span>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col font-sans selection:bg-brand-accent selection:text-white">
      {/* --- Global Overlay Elements --- */}
      
      {/* Bag Drawer */}
      <AnimatePresence>
        {isBagOpen && (
          <>
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsBagOpen(false)}
              className="fixed inset-0 bg-brand-charcoal/40 backdrop-blur-sm z-[60]"
            />
            <motion.div 
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              className="fixed top-0 right-0 h-full w-full max-w-md bg-brand-bone z-[70] flex flex-col shadow-2xl"
            >
              <div className="p-8 border-b border-brand-charcoal/10 flex justify-between items-center bg-brand-bone sticky top-0 z-10">
                <span className="font-mono text-xs uppercase tracking-widest text-brand-charcoal/60">Shopping Bag ({totalItems})</span>
                <button onClick={() => setIsBagOpen(false)} className="p-2 -mr-2 hover:opacity-50 transition-opacity">
                  <X size={24} />
                </button>
              </div>
              
              <div className="flex-1 overflow-y-auto px-8 py-6 space-y-8">
                {cart.length === 0 ? (
                  <div className="h-full flex flex-col items-center justify-center text-center space-y-4">
                    <p className="font-mono text-sm uppercase tracking-widest text-brand-charcoal/40">Your bag is empty</p>
                    <button 
                      onClick={() => setIsBagOpen(false)}
                      className="text-brand-charcoal border-b border-brand-charcoal pb-1 hover:opacity-50 transition-opacity"
                    >
                      Start Shopping
                    </button>
                  </div>
                ) : (
                  cart.map((item) => (
                    <div key={`${item.id}-${item.selectedSize}`} className="grid grid-cols-[80px_1fr] gap-6 group">
                      <div className="aspect-[3/4] bg-neutral-200 overflow-hidden">
                        <img 
                          src={item.images[0]} 
                          alt={item.name} 
                          referrerPolicy="no-referrer"
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                        />
                      </div>
                      <div className="flex flex-col justify-between py-1">
                        <div className="space-y-1">
                          <div className="flex justify-between items-start">
                            <h4 className="font-medium text-lg tracking-tight">{item.name}</h4>
                            <button 
                              onClick={() => removeFromCart(item.id, item.selectedSize)}
                              className="text-brand-charcoal/40 hover:text-brand-charcoal transition-colors"
                            >
                              <X size={16} />
                            </button>
                          </div>
                          <div className="flex gap-3 font-mono text-[10px] uppercase tracking-wider text-brand-charcoal/60">
                            <span>Size: {item.selectedSize}</span>
                            <span>/</span>
                            <CurrencyFormatter value={item.price} />
                          </div>
                        </div>
                        <div className="flex items-center gap-4">
                          <div className="flex items-center border border-brand-charcoal/10 rounded-full px-3 py-1">
                            <button onClick={() => updateQuantity(item.id, item.selectedSize, -1)} className="hover:opacity-100 opacity-40 transition-opacity">
                              <Minus size={14} />
                            </button>
                            <span className="w-8 text-center font-mono text-xs">{item.quantity}</span>
                            <button onClick={() => updateQuantity(item.id, item.selectedSize, 1)} className="hover:opacity-100 opacity-40 transition-opacity">
                              <Plus size={14} />
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </div>

              {cart.length > 0 && (
                <div className="p-8 space-y-6 border-t border-brand-charcoal/10 bg-brand-bone">
                  <div className="flex justify-between items-end">
                    <span className="font-mono text-xs uppercase tracking-widest text-brand-charcoal/60">Subtotal</span>
                    <span className="text-2xl font-medium"><CurrencyFormatter value={subtotal} /></span>
                  </div>
                  <button 
                    onClick={handleCheckout}
                    className="w-full bg-brand-accent text-brand-bone py-5 group relative overflow-hidden flex items-center justify-center gap-3 transition-transform active:scale-[0.98]"
                  >
                    <span className="relative z-10 uppercase tracking-widest font-mono text-sm">Proceed to Checkout</span>
                    <ArrowRight size={18} className="relative z-10 group-hover:translate-x-1 transition-transform" />
                    <motion.div 
                      className="absolute inset-0 bg-brand-charcoal"
                      initial={{ scaleX: 0 }}
                      whileHover={{ scaleX: 1 }}
                      transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
                      style={{ originX: 0 }}
                    />
                  </button>
                  <p className="text-center font-mono text-[9px] uppercase tracking-widest text-brand-charcoal/40">
                    Shipping & taxes calculated at checkout
                  </p>
                </div>
              )}
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* Menu Overlay */}
      <AnimatePresence>
        {isMenuOpen && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-brand-charcoal text-brand-bone z-[100] flex flex-col p-8 md:p-20 overflow-y-auto"
          >
            <div className="flex justify-between items-center mb-16 md:mb-24">
              <span className="font-mono text-xs uppercase tracking-[0.3em] opacity-60">Studio Ritual / Menu</span>
              <button 
                onClick={() => setIsMenuOpen(false)}
                className="p-4 -mr-4 group flex items-center gap-2"
              >
                <span className="font-mono text-xs uppercase tracking-widest opacity-0 group-hover:opacity-100 transition-opacity">Close</span>
                <X size={32} strokeWidth={1.5} />
              </button>
            </div>

            <nav className="flex-1 space-y-8 md:space-y-12">
              {[
                { label: 'Shop All', action: () => { setView('home'); setIsMenuOpen(false); } },
                { label: 'New Arrivals', action: () => { setView('home'); setIsMenuOpen(false); } },
                { label: 'Shipping & Returns', action: () => { setView('shipping-returns'); setIsMenuOpen(false); } },
                { label: 'About', action: () => { setView('shipping-returns'); setIsMenuOpen(false); } },
                { label: 'Contact', action: () => { setView('shipping-returns'); setIsMenuOpen(false); } },
              ].map((link, idx) => (
                <motion.div 
                  key={link.label}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: idx * 0.1 }}
                >
                  <button 
                    onClick={link.action}
                    className="text-5xl md:text-8xl font-bold tracking-tighter hover:italic transition-all flex items-center group text-left"
                  >
                    <span>{link.label}</span>
                    <ArrowRight className="ml-4 opacity-0 -translate-x-4 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-300" size={60} strokeWidth={1} />
                  </button>
                </motion.div>
              ))}
            </nav>

            <div className="mt-20 pt-12 border-t border-brand-bone/10 grid grid-cols-1 md:grid-cols-2 gap-12">
              <div className="space-y-6">
                <span className="font-mono text-xs uppercase tracking-widest opacity-40">Social</span>
                <div className="flex gap-8">
                  <a href="#" className="hover:opacity-50 transition-opacity">Instagram</a>
                  <a href="#" className="hover:opacity-50 transition-opacity">WhatsApp</a>
                  <a href="#" className="hover:opacity-50 transition-opacity">TikTok</a>
                </div>
              </div>
              <div className="space-y-6">
                <span className="font-mono text-xs uppercase tracking-widest opacity-40">Location</span>
                <p className="font-mono text-xs leading-relaxed opacity-60">
                  SOUTH JAKARTA, INDONESIA<br />
                  CURATED FOR DAILY RITUAL
                </p>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* --- Header --- */}
      <header className="sticky top-0 bg-brand-bone/90 backdrop-blur-md z-50 border-b border-brand-charcoal/10 transition-all duration-500">
        <div className="max-w-[1440px] mx-auto px-6 md:px-12 h-24 flex items-end justify-between pb-6">
          <div className="flex items-end gap-16">
            <button 
              onClick={() => { setView('home'); window.scrollTo(0,0); }}
              className="text-2xl font-black tracking-tighter leading-none group text-left"
            >
              STUDIO<br/>
              <span className="group-hover:text-brand-accent transition-colors">RITUAL</span>
            </button>
            <nav className="hidden lg:flex gap-12 text-sm font-medium uppercase tracking-widest">
              <button 
                onClick={() => setView('home')} 
                className={`hover:text-brand-accent transition-all pb-1 border-b-2 ${view === 'home' ? 'border-brand-accent text-brand-accent' : 'border-transparent opacity-60'}`}
              >
                Shop
              </button>
              <button 
                onClick={() => setView('shipping-returns')} 
                className={`hover:text-brand-accent transition-all pb-1 border-b-2 ${view === 'shipping-returns' ? 'border-brand-accent text-brand-accent' : 'border-transparent opacity-60'}`}
              >
                Archives
              </button>
            </nav>
          </div>

          <div className="flex items-center gap-8 md:gap-12">
            <button 
              onClick={() => setIsBagOpen(true)}
              className="flex items-center gap-2 group font-bold font-mono text-[11px] uppercase tracking-wider transition-colors hover:text-brand-accent"
            >
              <span>Bag</span>
              <div className="bg-brand-accent text-white px-2 py-0.5 rounded-full text-[10px] group-hover:scale-110 transition-transform">
                {totalItems}
              </div>
            </button>
            <button 
              onClick={() => setIsMenuOpen(true)}
              className="group flex flex-col items-end gap-1.5 p-2 h-10 w-10 justify-center"
            >
              <div className="w-8 h-0.5 bg-brand-charcoal group-hover:w-10 transition-all"></div>
              <div className="w-6 h-0.5 bg-brand-charcoal group-hover:w-10 transition-all"></div>
            </button>
          </div>
        </div>
      </header>

      {/* --- Main Content --- */}
      <main className="flex-1">
        <AnimatePresence mode="wait">
          {view === 'home' && (
            <motion.div 
              key="home"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="max-w-[1440px] mx-auto flex flex-col"
            >
              {/* Layout Container */}
              <div className="flex flex-col lg:flex-row min-h-[calc(100vh-6rem)] overflow-hidden">
                {/* Left Rail: Philosophy */}
                <div className="hidden lg:flex w-72 border-r border-brand-charcoal/10 flex-col justify-between p-12">
                  <div className="space-y-6">
                    <p className="text-[10px] uppercase font-mono text-brand-charcoal/40 tracking-widest">Volume 01 / Summer 24</p>
                    <h2 className="text-4xl font-light leading-tight tracking-tight">
                      Objects for movement, mood, and daily ritual.
                    </h2>
                  </div>
                  <div className="text-[10px] font-mono rotate-180 [writing-mode:vertical-rl] opacity-30 mt-auto items-center py-8">
                    ESTABLISHED IN JAKARTA 2024 © STUDIO RITUAL
                  </div>
                </div>

                {/* Hero Product - Central Section */}
                <div className="flex-1 relative group bg-brand-muted/10 overflow-hidden min-h-[600px] lg:min-h-0 flex items-center justify-center p-12">
                  <div className="absolute top-12 left-12 text-[14vw] font-black leading-none tracking-tighter text-brand-charcoal/5 select-none pointer-events-none uppercase">
                    RITUAL<br/>STUDIO
                  </div>

                  <motion.div 
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.8 }}
                    className="relative z-10 w-full max-w-[500px] aspect-[1/1.1] bg-brand-muted shadow-2xl flex items-center justify-center p-8 group overflow-visible"
                  >
                    <img 
                      src={PRODUCTS[0].images[0]} 
                      alt={PRODUCTS[0].name}
                      referrerPolicy="no-referrer"
                      className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" 
                    />
                    
                    {/* Floating Metadata Overlay */}
                    <div className="absolute -bottom-10 -right-10 bg-brand-charcoal text-brand-bone p-8 w-72 shadow-2xl z-20">
                      <p className="text-[10px] uppercase font-mono opacity-50 mb-3 tracking-widest">Featured Item</p>
                      <h3 className="text-2xl font-bold mb-2 tracking-tight">{PRODUCTS[0].name}</h3>
                      <p className="text-lg mb-6 font-mono font-medium"><CurrencyFormatter value={PRODUCTS[0].price} /></p>
                      <button 
                        onClick={() => addToCart(PRODUCTS[0], PRODUCTS[0].sizes[0])}
                        className="w-full py-4 bg-brand-accent hover:bg-brand-accent/90 transition-all text-[11px] uppercase font-bold tracking-widest"
                      >
                        Add to Bag
                      </button>
                    </div>
                  </motion.div>

                  {/* Side Dots Control Visual Only */}
                  <div className="absolute right-12 top-1/2 -translate-y-1/2 flex flex-col space-y-6">
                    <div className="w-2.5 h-2.5 rounded-full bg-brand-accent"></div>
                    <div className="w-2.5 h-2.5 rounded-full border border-brand-charcoal opacity-20"></div>
                    <div className="w-2.5 h-2.5 rounded-full border border-brand-charcoal opacity-20"></div>
                  </div>
                </div>

                {/* Right Rail: Context */}
                <div className="w-full lg:w-80 border-l border-brand-charcoal/10 p-12 flex flex-col space-y-20 bg-brand-bone/50">
                  <div className="space-y-8">
                    <p className="text-[10px] uppercase font-mono text-brand-charcoal/40 mb-8 tracking-widest">Next In Collection</p>
                    <div className="space-y-12">
                      {PRODUCTS.slice(1, 4).map((p) => (
                        <div 
                          key={p.id} 
                          className="flex space-x-6 items-center group cursor-none"
                          onClick={() => navigateToProduct(p)}
                        >
                          <div className="w-20 h-20 bg-brand-muted flex-shrink-0 overflow-hidden relative">
                             <img src={p.images[0]} referrerPolicy="no-referrer" className="w-full h-full object-cover group-hover:scale-110 transition-transform" />
                             <div className="absolute inset-0 bg-brand-accent opacity-0 group-hover:opacity-20 transition-opacity"></div>
                          </div>
                          <div className="space-y-1">
                            <p className="text-[11px] font-bold uppercase tracking-tight group-hover:text-brand-accent transition-colors">{p.name}</p>
                            <p className="text-[10px] font-mono opacity-60"><CurrencyFormatter value={p.price} /></p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="pt-12 border-t border-brand-charcoal/10 mt-auto">
                    <p className="text-[11px] leading-relaxed uppercase tracking-tighter font-bold opacity-80">
                      Built for daily rotation.<br/>Designed with restraint.<br/>Worn with intention.
                    </p>
                  </div>
                </div>
              </div>

              {/* Full Product Grid (Editorial Refinement) */}
              <div className="px-6 md:px-12 py-24 md:py-40 border-t border-brand-charcoal/10 bg-brand-bone">
                <div className="mb-24 flex justify-between items-end">
                  <h2 className="text-6xl md:text-8xl font-black tracking-tighter leading-none">THE FULL INDEX</h2>
                  <span className="font-mono text-[11px] uppercase tracking-[0.4em] text-brand-charcoal/40 pb-4">Browse Selection</span>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-y-32 gap-x-12">
                  {PRODUCTS.map((product, idx) => (
                    <motion.div 
                      key={product.id}
                      initial={{ opacity: 0, y: 20 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true }}
                      transition={{ delay: (idx % 3) * 0.1 }}
                      className="group cursor-none"
                      onClick={() => navigateToProduct(product)}
                    >
                      <div className="relative aspect-[4/5] bg-brand-muted overflow-hidden mb-8 border border-transparent group-hover:border-brand-accent transition-colors">
                        <img 
                          src={product.images[0]} 
                          alt={product.name} 
                          referrerPolicy="no-referrer"
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-[1.2s] ease-out brightness-[0.98] group-hover:brightness-100"
                        />
                        <div className="absolute top-8 left-8 flex flex-col gap-2">
                          {product.isNew && (
                            <span className="bg-brand-accent text-brand-bone font-mono text-[10px] uppercase tracking-widest px-4 py-1.5 shadow-xl">Volume 01</span>
                          )}
                        </div>
                      </div>
                      
                      <div className="flex justify-between items-start pt-2">
                        <div className="space-y-2">
                          <h3 className="text-2xl font-bold tracking-tight uppercase">{product.name}</h3>
                          <div className="flex gap-4 items-center">
                            <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-brand-charcoal/40 bg-brand-charcoal/5 px-2 py-1">{product.category}</p>
                            <span className="w-1 h-1 bg-brand-accent rounded-full"></span>
                            <span className="font-mono text-[10px] uppercase tracking-widest font-bold">In Stock</span>
                          </div>
                        </div>
                        <div className="text-right">
                          <span className="font-mono text-lg font-bold text-brand-accent underline decoration-brand-accent/20 underline-offset-8 transition-all group-hover:underline-offset-4">
                            <CurrencyFormatter value={product.price} />
                          </span>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </div>

              {/* Philosophy Block */}
              <div className="px-6 md:px-12 py-40 border-t border-brand-charcoal/10 bg-brand-bone">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-24 items-center max-w-[1440px] mx-auto">
                  <div className="order-2 lg:order-1 relative h-[600px] overflow-hidden grayscale hover:grayscale-0 transition-all duration-[2s]">
                    <img 
                      src="https://images.unsplash.com/photo-1490481651871-ab68de25d43d?auto=format&fit=crop&q=80&w=1200" 
                      alt="Brand Philosophy" 
                      referrerPolicy="no-referrer"
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-brand-charcoal/20 to-transparent" />
                  </div>
                  <div className="order-1 lg:order-2 space-y-12 pr-0 lg:pr-12">
                    <span className="font-mono text-xs uppercase tracking-[0.4em] opacity-40">Our Philosophy</span>
                    <h2 className="text-5xl md:text-7xl font-bold tracking-tighter leading-[0.9]">
                      DESIGNED WITH<br />
                      RESTRAINT. WORN<br />
                      WITH INTENTION.
                    </h2>
                    <p className="text-xl text-brand-charcoal/60 leading-relaxed font-medium">
                      Studio Ritual was born in Jakarta with a simple goal: to create objects that facilitate the small rituals of daily life. We believe in high-quality materials, minimal silhouettes, and the power of a well-considered detail.
                    </p>
                    <div className="pt-8 grid grid-cols-1 sm:grid-cols-2 gap-12">
                      <div className="space-y-4">
                        <span className="font-mono text-[10px] uppercase tracking-widest opacity-40 italic">01 / Materiality</span>
                        <p className="text-sm leading-snug">We source ethically, favoring recycled and long-lasting components.</p>
                      </div>
                      <div className="space-y-4">
                        <span className="font-mono text-[10px] uppercase tracking-widest opacity-40 italic">02 / Local Craft</span>
                        <p className="text-sm leading-snug">Collaborating with skilled Indonesian artisans to ensure excellence.</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          )}

          {view === 'product' && selectedProduct && (
            <motion.div 
              key="product"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="max-w-[1440px] mx-auto min-h-screen"
            >
              <div className="grid grid-cols-1 lg:grid-cols-2">
                {/* Image Gallery */}
                <div className="space-y-2 md:p-6 lg:border-r border-brand-charcoal/5">
                  <div className="sticky top-32 space-y-4">
                    {selectedProduct.images.map((img, idx) => (
                      <motion.div 
                        key={idx}
                        initial={{ opacity: 0, scale: 1.05 }}
                        whileInView={{ opacity: 1, scale: 1 }}
                        viewport={{ once: true }}
                        transition={{ duration: 1.2, ease: [0.22, 1, 0.36, 1] }}
                        className="aspect-[4/5] bg-neutral-200 overflow-hidden"
                      >
                        <img src={img} alt={`${selectedProduct.name} ${idx + 1}`} referrerPolicy="no-referrer" className="w-full h-full object-cover" />
                      </motion.div>
                    ))}
                  </div>
                </div>

                {/* Product Info */}
                <div className="p-8 lg:p-24 space-y-16">
                  <div className="sticky top-32 space-y-12">
                    <div className="space-y-6">
                      <div className="flex justify-between items-start">
                        <div className="space-y-2">
                          <span className="font-mono text-[10px] uppercase tracking-[0.4em] text-brand-accent">{selectedProduct.category}</span>
                          <h1 className="text-5xl md:text-7xl font-bold tracking-tighter leading-none">{selectedProduct.name}</h1>
                        </div>
                        <span className="text-2xl font-medium pt-2"><CurrencyFormatter value={selectedProduct.price} /></span>
                      </div>
                      <p className="text-xl text-brand-charcoal/70 leading-relaxed font-medium pb-8 border-b border-brand-charcoal/10">
                        {selectedProduct.longDescription}
                      </p>
                    </div>

                    {/* Controls */}
                    <div className="space-y-12">
                      <div className="space-y-6">
                        <span className="font-mono text-[11px] uppercase tracking-widest text-brand-charcoal/40">Select Size</span>
                        <div className="flex flex-wrap gap-3">
                          {selectedProduct.sizes.map((size) => (
                            <button 
                              key={size}
                              className={`h-16 w-16 md:h-20 md:w-20 border font-mono text-sm transition-all flex items-center justify-center hover:border-brand-accent active:scale-95
                                ${selectedProduct.sizes[0] === size ? 'border-brand-accent bg-brand-accent text-brand-bone' : 'border-brand-charcoal/10 text-brand-charcoal'}`}
                            >
                              {size}
                            </button>
                          ))}
                        </div>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-[1fr_2fr] gap-6">
                        <div className="flex items-center justify-between border border-brand-charcoal/10 px-8 py-6 h-20">
                          <button className="opacity-40 hover:opacity-100 transition-opacity"><Minus size={20} /></button>
                          <span className="font-mono text-lg">1</span>
                          <button className="opacity-40 hover:opacity-100 transition-opacity"><Plus size={20} /></button>
                        </div>
                        <button 
                          onClick={() => addToCart(selectedProduct, selectedProduct.sizes[0])}
                          className="h-20 bg-brand-charcoal text-brand-bone font-mono text-xs uppercase tracking-[0.3em] flex items-center justify-center group relative overflow-hidden active:scale-[0.98]"
                        >
                          <span className="relative z-10">Add to Bag</span>
                          <motion.div 
                            className="absolute inset-0 bg-brand-accent"
                            initial={{ scaleY: 0 }}
                            whileHover={{ scaleY: 1 }}
                            transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
                            style={{ originY: 1 }}
                          />
                        </button>
                      </div>

                      {/* Trust Badges */}
                      <div className="grid grid-cols-3 gap-6 pt-12 border-t border-brand-charcoal/10">
                        <div className="flex flex-col items-center text-center space-y-4">
                          <Truck size={20} strokeWidth={1} className="text-brand-accent" />
                          <span className="font-mono text-[9px] uppercase tracking-widest opacity-40">Fast Logistics</span>
                        </div>
                        <div className="flex flex-col items-center text-center space-y-4 text-brand-accent font-bold">
                          <ShieldCheck size={20} strokeWidth={1} />
                          <span className="font-mono text-[9px] uppercase tracking-widest opacity-40">Verified Vendor</span>
                        </div>
                        <div className="flex flex-col items-center text-center space-y-4">
                          <RefreshCcw size={20} strokeWidth={1} className="text-brand-accent" />
                          <span className="font-mono text-[9px] uppercase tracking-widest opacity-40">7-Day Return</span>
                        </div>
                      </div>

                      {/* Details Accordion */}
                      <div className="space-y-8 pt-12">
                        {[
                          { title: 'Material & Construction', content: selectedProduct.materials.join(', ') },
                          { title: 'Care Instructions', content: selectedProduct.care.join(' ') },
                          { title: 'Shipping Policy', content: 'Standard shipping 2-4 business days. Tracking provided via WhatsApp.' },
                        ].map((item, idx) => (
                          <div key={idx} className="group border-b border-brand-charcoal/5 pb-8">
                            <button className="flex justify-between items-center w-full text-left group-hover:text-brand-accent transition-colors">
                              <span className="font-mono text-xs uppercase tracking-widest font-bold">{item.title}</span>
                              <Plus size={16} className="group-hover:rotate-90 transition-transform" />
                            </button>
                            <p className="mt-4 text-sm text-brand-charcoal/60 leading-relaxed max-w-md">
                              {item.content}
                            </p>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Related Products teaser */}
              <div className="p-12 md:p-24 border-t border-brand-charcoal/10">
                <div className="flex justify-between items-end mb-16">
                  <h2 className="text-4xl md:text-6xl font-bold tracking-tighter">YOU MAY ALSO<br />CONSIDER</h2>
                  <button onClick={() => setView('home')} className="font-mono text-xs uppercase tracking-[0.3em] opacity-40 hover:opacity-100 pb-2 border-b-2 border-brand-accent transition-all">Back to Catalog</button>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
                  {PRODUCTS.slice(0, 4).map((p) => (
                    <div 
                      key={p.id} 
                      className="group cursor-pointer"
                      onClick={() => navigateToProduct(p)}
                    >
                      <div className="aspect-[3/4] bg-neutral-200 overflow-hidden mb-4">
                        <img src={p.images[0]} alt={p.name} referrerPolicy="no-referrer" className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-700" />
                      </div>
                      <h4 className="text-lg font-bold tracking-tight">{p.name}</h4>
                      <p className="font-mono text-[10px] uppercase opacity-40"><CurrencyFormatter value={p.price} /></p>
                    </div>
                  ))}
                </div>
              </div>
            </motion.div>
          )}

          {view === 'checkout' && (
            <motion.div 
              key="checkout"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="max-w-[1440px] mx-auto py-12 md:py-24 px-6 md:px-12 grid grid-cols-1 lg:grid-cols-[1.5fr_1fr] gap-24"
            >
              {/* Form Side */}
              <div className="space-y-20">
                <div className="flex items-center gap-4 text-brand-charcoal/40 font-mono text-xs uppercase tracking-[0.3em]">
                  <span className={checkoutStep >= 1 ? 'text-brand-accent' : ''}>Details</span>
                  <ChevronRight size={14} />
                  <span className={checkoutStep >= 2 ? 'text-brand-accent' : ''}>Shipping</span>
                  <ChevronRight size={14} />
                  <span className={checkoutStep >= 3 ? 'text-brand-accent' : ''}>Payment</span>
                </div>

                <div className="space-y-12">
                  {checkoutStep === 1 && (
                    <motion.div initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} className="space-y-12">
                      <h2 className="text-5xl font-bold tracking-tighter">CUSTOMER DETAILS</h2>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        <div className="space-y-3">
                          <label className="font-mono text-[11px] uppercase tracking-widest text-brand-charcoal/40 focus-within:text-brand-accent transition-colors">Full Name</label>
                          <input type="text" placeholder="John Doe" className="w-full h-16 bg-transparent border-b border-brand-charcoal/20 focus:border-brand-accent outline-none px-0 text-lg font-medium transition-colors" />
                        </div>
                        <div className="space-y-3">
                          <label className="font-mono text-[11px] uppercase tracking-widest text-brand-charcoal/40">WhatsApp Number</label>
                          <input type="tel" placeholder="+62 812 3456 789" className="w-full h-16 bg-transparent border-b border-brand-charcoal/20 focus:border-brand-accent outline-none px-0 text-lg font-medium transition-colors" />
                        </div>
                        <div className="space-y-3 md:col-span-2">
                          <label className="font-mono text-[11px] uppercase tracking-widest text-brand-charcoal/40">Email Address</label>
                          <input type="email" placeholder="john@ritual.studio" className="w-full h-16 bg-transparent border-b border-brand-charcoal/20 focus:border-brand-accent outline-none px-0 text-lg font-medium transition-colors" />
                        </div>
                        <div className="space-y-3 md:col-span-2">
                          <label className="font-mono text-[11px] uppercase tracking-widest text-brand-charcoal/40">Shipping Address</label>
                          <textarea placeholder="Street name, building, apartment..." className="w-full h-32 bg-transparent border-b border-brand-charcoal/20 focus:border-brand-accent outline-none px-0 text-lg font-medium transition-colors resize-none py-4" />
                        </div>
                      </div>
                      <button 
                        onClick={() => setCheckoutStep(2)}
                        className="h-16 px-12 bg-brand-charcoal text-brand-bone font-mono text-xs uppercase tracking-widest flex items-center gap-3 group ml-auto transition-transform active:scale-95"
                      >
                        Continue to Shipping
                        <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
                      </button>
                    </motion.div>
                  )}

                  {checkoutStep === 2 && (
                    <motion.div initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} className="space-y-12">
                      <h2 className="text-5xl font-bold tracking-tighter">SHIPPING METHOD</h2>
                      <div className="space-y-4">
                        {[
                          { id: 'standard', name: 'Standard Logistics', time: '2-4 Business Days', price: 25000 },
                          { id: 'express', name: 'Express Drop', time: 'Next Day', price: 55000 },
                        ].map((method) => (
                          <label 
                            key={method.id}
                            className={`flex items-center justify-between p-8 border cursor-pointer transition-all hover:border-brand-accent
                              ${method.id === 'standard' ? 'border-brand-accent bg-brand-charcoal/5' : 'border-brand-charcoal/10'}`}
                          >
                            <div className="flex items-center gap-6">
                              <div className={`w-6 h-6 rounded-full border flex items-center justify-center
                                ${method.id === 'standard' ? 'border-brand-accent' : 'border-brand-charcoal/20'}`}>
                                {method.id === 'standard' && <div className="w-3 h-3 bg-brand-accent rounded-full" />}
                              </div>
                              <div className="space-y-1">
                                <h4 className="font-bold tracking-tight">{method.name}</h4>
                                <p className="font-mono text-[10px] uppercase opacity-40">{method.time}</p>
                              </div>
                            </div>
                            <span className="font-mono text-sm"><CurrencyFormatter value={method.price} /></span>
                            <input type="radio" name="shipping" className="hidden" defaultChecked={method.id === 'standard'} />
                          </label>
                        ))}
                      </div>
                      <div className="flex justify-between items-center">
                        <button onClick={() => setCheckoutStep(1)} className="font-mono text-xs uppercase tracking-widest opacity-40 hover:opacity-100 flex items-center gap-2">
                          <ArrowLeft size={16} /> Back
                        </button>
                        <button 
                          onClick={() => setCheckoutStep(3)}
                          className="h-16 px-12 bg-brand-charcoal text-brand-bone font-mono text-xs uppercase tracking-widest flex items-center gap-3 group transition-transform active:scale-95"
                        >
                          Continue to Payment
                          <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
                        </button>
                      </div>
                    </motion.div>
                  )}

                  {checkoutStep === 3 && (
                    <motion.div initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} className="space-y-12">
                      <h2 className="text-5xl font-bold tracking-tighter">PAYMENT VERIFICATION</h2>
                      <div className="p-8 bg-brand-accent/5 border border-brand-accent border-dashed rounded-lg space-y-4">
                        <p className="text-sm font-medium">For security and authentic ritual experience, we use manual verification for all orders.</p>
                      </div>
                      
                      <div className="space-y-6">
                        <span className="font-mono text-[11px] uppercase tracking-widest text-brand-charcoal/40">Select Method</span>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          {[
                            { id: 'bank', label: 'Bank Transfer', sub: 'BCA / Mandiri' },
                            { id: 'qris', label: 'QRIS Overlay', sub: 'All E-wallets' },
                            { id: 'wa', label: 'WhatsApp Order', sub: 'Direct Admin Pay' },
                          ].map((m) => (
                            <button 
                              key={m.id}
                              className={`p-8 border text-left space-y-2 group transition-all hover:border-brand-accent
                                ${m.id === 'bank' ? 'border-brand-accent bg-brand-bone' : 'border-brand-charcoal/10'}`}
                            >
                              <h4 className="font-bold tracking-tight">{m.label}</h4>
                              <p className="font-mono text-[10px] uppercase opacity-40 group-hover:text-brand-accent transition-colors">{m.sub}</p>
                            </button>
                          ))}
                        </div>
                      </div>

                      <div className="pt-12 border-t border-brand-charcoal/10 space-y-8">
                        <div className="flex items-start gap-4">
                          <div className="w-10 h-10 bg-brand-accent/10 flex items-center justify-center shrink-0">
                            <span className="font-mono text-brand-accent">!</span>
                          </div>
                          <p className="text-xs text-brand-charcoal/50 leading-relaxed font-mono uppercase tracking-wider">
                            By clicking PLACE ORDER, you agree to our terms of service. You will receive an order summary via WhatsApp and Email for manual payment verification.
                          </p>
                        </div>
                        <button 
                          onClick={() => setView('success')}
                          className="w-full h-20 bg-brand-accent text-brand-bone font-mono text-xs uppercase tracking-[0.3em] transition-transform active:scale-95 group relative overflow-hidden"
                        >
                          <span className="relative z-10">Confirm & Place Order</span>
                          <motion.div 
                            className="absolute inset-0 bg-brand-charcoal"
                            initial={{ scaleY: 0 }}
                            whileHover={{ scaleY: 1 }}
                            transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
                            style={{ originY: 1 }}
                          />
                        </button>
                      </div>
                    </motion.div>
                  )}
                </div>
              </div>

              {/* Summary Side */}
              <div className="lg:border-l border-brand-charcoal/10 lg:pl-16 space-y-12">
                <h3 className="font-mono text-xs uppercase tracking-[0.4em] text-brand-charcoal/40">Order Summary</h3>
                
                <div className="space-y-8 max-h-[500px] overflow-y-auto pr-4 scrollbar-hide">
                  {cart.map((item) => (
                    <div key={`${item.id}-${item.selectedSize}`} className="flex gap-6 items-center">
                      <div className="w-20 aspect-[3/4] bg-neutral-200 shrink-0">
                        <img src={item.images[0]} alt={item.name} referrerPolicy="no-referrer" className="w-full h-full object-cover" />
                      </div>
                      <div className="flex-1 space-y-1">
                        <h4 className="font-bold tracking-tight text-sm uppercase">{item.name}</h4>
                        <div className="flex justify-between font-mono text-[9px] uppercase tracking-widest text-brand-charcoal/40">
                          <span>Size: {item.selectedSize} / Qty: {item.quantity}</span>
                          <CurrencyFormatter value={item.price * item.quantity} />
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="space-y-6 pt-12 border-t border-brand-charcoal/20">
                  <div className="flex justify-between font-mono text-[10px] uppercase tracking-widest opacity-40">
                    <span>Subtotal</span>
                    <CurrencyFormatter value={subtotal} />
                  </div>
                  <div className="flex justify-between font-mono text-[10px] uppercase tracking-widest opacity-40">
                    <span>Shipping</span>
                    <span>Rp25.000</span>
                  </div>
                  <div className="flex justify-between items-end pt-4 border-t border-brand-charcoal/10 font-bold">
                    <span className="text-xl tracking-tighter">TOTAL AMOUNT</span>
                    <span className="text-2xl tracking-tight"><CurrencyFormatter value={subtotal + 25000} /></span>
                  </div>
                </div>

                {/* Trust Seal */}
                <div className="p-8 border border-brand-charcoal/5 bg-neutral-100/50 space-y-4">
                  <div className="flex items-center gap-3">
                    <ShieldCheck size={18} className="text-brand-accent" />
                    <span className="font-mono text-[9px] uppercase tracking-[0.2em] font-bold">Ritual Secure Checkout</span>
                  </div>
                  <p className="font-mono text-[9px] uppercase tracking-widest leading-loose opacity-40">
                    Each transaction is manually verified by our team in Jakarta to ensure the highest standard of service.
                  </p>
                </div>
              </div>
            </motion.div>
          )}

          {view === 'success' && (
            <motion.div 
              key="success"
              initial={{ opacity: 0, scale: 0.98 }}
              animate={{ opacity: 1, scale: 1 }}
              className="max-w-[800px] mx-auto py-24 md:py-40 px-6 text-center space-y-12"
            >
              <div className="w-24 h-24 bg-brand-accent text-brand-bone rounded-full flex items-center justify-center mx-auto mb-12">
                <motion.div 
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ type: 'spring', delay: 0.5 }}
                >
                  <ShieldCheck size={48} strokeWidth={1.5} />
                </motion.div>
              </div>
              <div className="space-y-4">
                <span className="font-mono text-xs uppercase tracking-[0.4em] text-brand-accent">Order Confirmed</span>
                <h1 className="text-6xl md:text-8xl font-bold tracking-tighter">WAITING FOR<br />VERIFICATION.</h1>
                <p className="text-xl text-brand-charcoal/60 max-w-lg mx-auto font-medium">
                  Your order #SR-9921 is currently in queue. Please send your payment proof via WhatsApp to accelerate process.
                </p>
              </div>

              <div className="pt-12 flex flex-col md:flex-row gap-6 justify-center">
                <button 
                  onClick={() => window.open('https://wa.me/1234567890', '_blank')}
                  className="h-20 px-12 bg-brand-accent text-brand-bone font-mono text-xs uppercase tracking-widest flex items-center justify-center gap-4 transition-transform active:scale-95 group"
                >
                  <MessageCircle size={24} />
                  Confirm via WhatsApp
                </button>
                <button 
                  onClick={() => { setView('home'); setCheckoutStep(1); setCart([]); }}
                  className="h-20 px-12 border border-brand-charcoal text-brand-charcoal font-mono text-xs uppercase tracking-widest flex items-center justify-center transition-all hover:bg-brand-charcoal hover:text-brand-bone"
                >
                  Back to Catalog
                </button>
              </div>

              <div className="pt-24 grid grid-cols-1 md:grid-cols-3 gap-12 border-t border-brand-charcoal/10">
                <div className="space-y-2">
                  <span className="font-mono text-[10px] uppercase opacity-40">Method</span>
                  <p className="font-bold">Bank Transfer</p>
                </div>
                <div className="space-y-2">
                  <span className="font-mono text-[10px] uppercase opacity-40">Amount</span>
                  <p className="font-bold"><CurrencyFormatter value={subtotal + 25000} /></p>
                </div>
                <div className="space-y-2">
                  <span className="font-mono text-[10px] uppercase opacity-40">Status</span>
                  <p className="font-bold text-brand-accent">Awaiting Payment</p>
                </div>
              </div>
            </motion.div>
          )}

          {view === 'shipping-returns' && (
            <motion.div 
              key="shipping-returns"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="max-w-[1000px] mx-auto py-24 md:py-40 px-6 md:px-12 space-y-32"
            >
              <div className="space-y-12">
                <span className="font-mono text-xs uppercase tracking-[0.4em] text-brand-accent">Information</span>
                <h1 className="text-6xl md:text-[120px] font-bold tracking-tighter leading-[0.85]">SHIPPING &<br />RETURNS.</h1>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-24">
                <div className="space-y-16">
                  <div className="space-y-8">
                    <h2 className="text-2xl font-bold tracking-tight uppercase">Logistics</h2>
                    <div className="space-y-12">
                      {SHIPPING_FAQ.map((faq, i) => (
                        <div key={i} className="space-y-4">
                          <h4 className="font-mono text-xs uppercase font-bold tracking-wider">{faq.q}</h4>
                          <p className="text-brand-charcoal/60 leading-relaxed">{faq.a}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="space-y-16">
                  <div className="space-y-8">
                    <h2 className="text-2xl font-bold tracking-tight uppercase">Payments</h2>
                    <div className="space-y-12">
                      {PAYMENTS_FAQ.map((faq, i) => (
                        <div key={i} className="space-y-4">
                          <h4 className="font-mono text-xs uppercase font-bold tracking-wider">{faq.q}</h4>
                          <p className="text-brand-charcoal/60 leading-relaxed">{faq.a}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              <div className="py-24 border-t border-brand-charcoal/10 flex flex-col md:flex-row justify-between items-start gap-12">
                <div className="space-y-4 max-w-sm">
                  <h3 className="text-xl font-bold uppercase">Need Assistance?</h3>
                  <p className="text-brand-charcoal/60 text-sm leading-relaxed">Our team is available for real-time sizing consultation and order tracking via WhatsApp. Every ritual is personal.</p>
                </div>
                <button 
                  onClick={() => window.open('https://wa.me/1234567890', '_blank')}
                  className="h-16 px-12 bg-brand-accent text-brand-bone font-mono text-xs uppercase tracking-widest flex items-center justify-center gap-4 hover:bg-brand-charcoal transition-colors focus:outline-none"
                >
                  <MessageCircle size={20} />
                  Chat with Curator
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </main>

      {/* --- Footer --- */}
      <footer className="w-full px-8 py-8 border-t border-brand-charcoal/10 bg-white/50 backdrop-blur-sm z-40">
        <div className="max-w-[1440px] mx-auto flex flex-col md:flex-row justify-between items-center gap-8">
          <div className="flex flex-wrap justify-center md:justify-start gap-12 text-[10px] uppercase font-mono tracking-widest opacity-60">
            <span className="flex items-center gap-2"><Truck size={14} strokeWidth={1.5} /> Shipping Worldwide</span>
            <span className="flex items-center gap-2"><ShieldCheck size={14} strokeWidth={1.5} /> Manual Verification Available</span>
            <span className="flex items-center gap-2 text-brand-accent animate-pulse">● Secure Checkout</span>
          </div>
          <div 
            onClick={() => window.open('https://wa.me/1234567890', '_blank')}
            className="flex items-center text-[11px] font-bold tracking-[0.2em] text-brand-accent cursor-pointer group whitespace-nowrap"
          >
            <span className="mr-3">CONFIRM VIA WHATSAPP</span>
            <ArrowRight size={18} className="transform group-hover:translate-x-2 transition-transform duration-500" strokeWidth={3} />
          </div>
        </div>
      </footer>
    </div>
  );
}
