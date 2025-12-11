// src/components/DetailModal.jsx
import React, { useState, useEffect, useRef } from "react";
import { createPortal } from "react-dom";
import { useCart } from "../state/CartContext";

export default function DetailModal({ menu, isVisible, onClose }) {
  const [isAnimating, setIsAnimating] = useState(false);
  const [isClosing, setIsClosing] = useState(false);
  const { inc } = useCart();
  const popstateHandlerRef = useRef(null);

  useEffect(() => {
    if (isVisible) {
      setIsAnimating(true);
      setIsClosing(false);
      
      // Push a state so back button has something to pop
      window.history.pushState({ modal: true }, '');
      
      // Handle back button/swipe
      const handlePopState = () => {
        // Just close the modal with animation
        handleClose();
      };
      
      window.addEventListener('popstate', handlePopState);
      
      return () => {
        window.removeEventListener('popstate', handlePopState);
      };
    } else {
      setIsClosing(true);
      setTimeout(() => {
        setIsAnimating(false);
      }, 300);
    }
  }, [isVisible]);

  const handleOverlayClick = (e) => {
    if (e.target === e.currentTarget) {
      handleClose();
    }
  };

  const handleClose = () => {
    setIsClosing(true);
    setTimeout(() => {
      onClose();
    }, 280);
  };

  const handleAddOrder = () => {
    inc(menu, 1);
    handleClose();
    // Remove history entry when closing manually
    if (window.history.state?.modal) {
      window.history.back();
    }
  };

  if (!isAnimating && !isVisible) return null;

  const modalContent = (
    <div 
      className={`
        fixed inset-0 bg-black/55 z-[90]
        transition-opacity duration-[250ms] ease-in-out
        ${isAnimating && !isClosing ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'}
      `}
      onClick={handleOverlayClick}
    >
      <div className={`
        fixed bottom-0 left-0 right-0 w-full h-[75%] 
        bg-white rounded-t-[30px] z-[100] overflow-hidden flex flex-col
        shadow-[0_-8px_32px_rgba(0,0,0,0.15)]
        transition-transform duration-[280ms] cubic-bezier(0.4,0,0.2,1)
        ${isAnimating && !isClosing ? 'translate-y-0' : 'translate-y-full'}
      `}
      onClick={(e) => e.stopPropagation()}
      >
        {/* TOP HEADER IMAGE */}
        <div className="relative w-full h-[220px] flex-shrink-0 bg-gray-100 overflow-hidden">
          <img 
            src={menu.photo_full_url || "https://via.placeholder.com/800x600?text=Menu"} 
            alt={menu.name}
            className="w-full h-full object-contain object-center bg-gray-50"
          />
        </div>

        {/* WHITE ROUNDED DETAIL CARD */}
        <div className="flex-1 overflow-y-auto px-6 py-6 pb-24 bg-white">
          <h3 className="text-2xl font-extrabold text-gray-900 mb-3 leading-tight">{menu.name}</h3>
          <div className="text-xl font-bold text-maroon mb-4">
            Rp {Number(menu.price).toLocaleString()}
          </div>
          <div className="w-full h-px bg-gray-200 my-4"></div>
          
          {/* Description if exists */}
          {menu.description && (
            <p className="text-[15px] leading-relaxed text-gray-600">{menu.description}</p>
          )}
        </div>

        {/* BOTTOM FLOATING ORDER AREA */}
        <div className="absolute bottom-0 left-0 right-0 px-5 py-4 pb-6 bg-white border-t border-gray-100 z-[25]">
          <button
            className="flex items-center justify-between w-full px-6 py-4 bg-gradient-to-r from-orange to-orange-dark text-white rounded-full font-bold shadow-[0_6px_20px_rgba(255,107,53,0.4)] hover:shadow-[0_8px_24px_rgba(255,107,53,0.5)] hover:-translate-y-0.5 active:translate-y-0 transition-all"
            onClick={handleAddOrder}
          >
            <span>Tambah Pesanan</span>
            <span className="bg-white/25 px-3.5 py-1.5 rounded-[20px] text-[15px]">
              Rp {Number(menu.price).toLocaleString()}
            </span>
          </button>
        </div>
      </div>
    </div>
  );

  // Portal to render outside PhoneShell
  const phoneElement = document.querySelector('.phone');
  return phoneElement ? createPortal(modalContent, phoneElement) : null;
}
