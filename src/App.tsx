import React, { useState, useEffect } from 'react';
import { Product, CartItem, Coupon, Order } from './types';
import { PRODUCTS } from './data/products';
import { Header } from './components/Header';
import { Hero } from './components/Hero';
import { Catalog } from './components/Catalog';
import { ProductModal } from './components/ProductModal';
import { CartDrawer } from './components/CartDrawer';
import { Checkout } from './components/Checkout';
import { OrderSuccessModal } from './components/OrderSuccessModal';
import { OrderHistoryModal } from './components/OrderHistoryModal';
import { BrandStory } from './components/BrandStory';
import { Footer } from './components/Footer';

export default function App() {
  // Cart state persisted in localStorage
  const [cartItems, setCartItems] = useState<CartItem[]>(() => {
    try {
      const saved = localStorage.getItem('aura_cart');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  // Past orders persisted in localStorage
  const [orders, setOrders] = useState<Order[]>(() => {
    try {
      const saved = localStorage.getItem('aura_orders');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  // Navigation & Category state
  const [selectedCategory, setSelectedCategory] = useState<string>('todos');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [isCheckoutView, setIsCheckoutView] = useState<boolean>(false);

  // Modals & Drawers
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [isCartOpen, setIsCartOpen] = useState<boolean>(false);
  const [isOrdersOpen, setIsOrdersOpen] = useState<boolean>(false);
  const [currentSuccessOrder, setCurrentSuccessOrder] = useState<Order | null>(null);

  // Coupons
  const [appliedCoupon, setAppliedCoupon] = useState<Coupon | null>(null);

  // Persist cart
  useEffect(() => {
    try {
      localStorage.setItem('aura_cart', JSON.stringify(cartItems));
    } catch (e) {
      console.error('Failed to save cart:', e);
    }
  }, [cartItems]);

  // Persist orders
  useEffect(() => {
    try {
      localStorage.setItem('aura_orders', JSON.stringify(orders));
    } catch (e) {
      console.error('Failed to save orders:', e);
    }
  }, [orders]);

  // Cart Handlers
  const handleAddToCart = (
    product: Product,
    selectedSize: string,
    selectedColor: { name: string; hex: string },
    quantity = 1
  ) => {
    const itemId = `${product.id}-${selectedSize}-${selectedColor.name}`;

    setCartItems((prev) => {
      const existing = prev.find((item) => item.id === itemId);
      if (existing) {
        return prev.map((item) =>
          item.id === itemId ? { ...item, quantity: item.quantity + quantity } : item
        );
      }
      return [
        ...prev,
        {
          id: itemId,
          product,
          selectedSize,
          selectedColor,
          quantity,
        },
      ];
    });

    setIsCartOpen(true);
  };

  const handleUpdateQuantity = (itemId: string, newQuantity: number) => {
    if (newQuantity <= 0) {
      handleRemoveItem(itemId);
      return;
    }
    setCartItems((prev) =>
      prev.map((item) => (item.id === itemId ? { ...item, quantity: newQuantity } : item))
    );
  };

  const handleRemoveItem = (itemId: string) => {
    setCartItems((prev) => prev.filter((item) => item.id !== itemId));
  };

  // Checkout Handlers
  const handleProceedToCheckout = () => {
    setIsCartOpen(false);
    setIsCheckoutView(true);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleBackToCart = () => {
    setIsCheckoutView(false);
    setIsCartOpen(true);
  };

  const handleOrderCompleted = (newOrder: Order) => {
    setOrders((prev) => [newOrder, ...prev]);
    setCartItems([]);
    setAppliedCoupon(null);
    setIsCheckoutView(false);
    setCurrentSuccessOrder(newOrder);
  };

  const handleCategorySelect = (category: string) => {
    setSelectedCategory(category);
    setIsCheckoutView(false);
    const catEl = document.getElementById('catalogo');
    if (catEl) {
      catEl.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const handleOpenSearch = () => {
    setIsCheckoutView(false);
    const catEl = document.getElementById('catalogo');
    if (catEl) {
      catEl.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const totalCartCount = cartItems.reduce((acc, curr) => acc + curr.quantity, 0);

  return (
    <div className="min-h-screen flex flex-col bg-stone-50 text-stone-900 selection:bg-stone-900 selection:text-stone-50">
      {/* Top Header */}
      <Header
        cartCount={totalCartCount}
        wishlistCount={0}
        onOpenCart={() => setIsCartOpen(true)}
        onOpenOrders={() => setIsOrdersOpen(true)}
        onSelectCategory={handleCategorySelect}
        activeCategory={selectedCategory}
        onOpenSearch={handleOpenSearch}
      />

      {/* Main Content Area */}
      <main className="flex-1">
        {isCheckoutView ? (
          <Checkout
            items={cartItems}
            appliedCoupon={appliedCoupon}
            onBackToCart={handleBackToCart}
            onOrderCompleted={handleOrderCompleted}
          />
        ) : (
          <>
            {/* Storefront Hero with campaign visuals */}
            <Hero
              onExplore={() => {
                const el = document.getElementById('catalogo');
                el?.scrollIntoView({ behavior: 'smooth' });
              }}
              onSelectCategory={handleCategorySelect}
            />

            {/* Product Catalog with Categories, Filters & Grid */}
            <Catalog
              products={PRODUCTS}
              selectedCategory={selectedCategory}
              onSelectCategory={setSelectedCategory}
              onSelectProduct={(p) => setSelectedProduct(p)}
              onQuickAdd={(prod, size, color) => handleAddToCart(prod, size, color, 1)}
              searchQuery={searchQuery}
              onSearchChange={setSearchQuery}
            />

            {/* Atelier Craftsmanship & Story */}
            <BrandStory />
          </>
        )}
      </main>

      {/* Footer */}
      <Footer
        onSelectCategory={handleCategorySelect}
        onOpenOrders={() => setIsOrdersOpen(true)}
      />

      {/* Cart Drawer */}
      <CartDrawer
        isOpen={isCartOpen}
        onClose={() => setIsCartOpen(false)}
        items={cartItems}
        onUpdateQuantity={handleUpdateQuantity}
        onRemoveItem={handleRemoveItem}
        appliedCoupon={appliedCoupon}
        onApplyCoupon={setAppliedCoupon}
        onProceedToCheckout={handleProceedToCheckout}
      />

      {/* Product Detail Modal */}
      <ProductModal
        product={selectedProduct}
        onClose={() => setSelectedProduct(null)}
        onAddToCart={(prod, sz, clr, qty) => handleAddToCart(prod, sz, clr, qty)}
      />

      {/* Order Success & Tracking Modal */}
      <OrderSuccessModal
        order={currentSuccessOrder}
        onClose={() => setCurrentSuccessOrder(null)}
        onContinueShopping={() => {
          setCurrentSuccessOrder(null);
          setIsCheckoutView(false);
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }}
      />

      {/* Order History Modal */}
      <OrderHistoryModal
        isOpen={isOrdersOpen}
        onClose={() => setIsOrdersOpen(false)}
        orders={orders}
        onSelectOrder={(ord) => setCurrentSuccessOrder(ord)}
        onExplore={() => {
          setIsOrdersOpen(false);
          setIsCheckoutView(false);
          const el = document.getElementById('catalogo');
          el?.scrollIntoView({ behavior: 'smooth' });
        }}
      />
    </div>
  );
}
