import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { axiosInstance } from '../axiosCalls/axios';
import { useCart } from '../context/CartContext';

export default function ProductCard({ _id, name, description, price, category, image, stock, initialWishlisted }) {
  const navigate = useNavigate();
  const [isWishlisted, setIsWishlisted] = useState(initialWishlisted);
  const { actionIds, addToCart, updateCartQuantity, getCartItem } = useCart();
  const cartItem = getCartItem(_id);
  const cartQty = cartItem?.quantity || 0;
  const isCartActionRunning = Boolean(actionIds[_id]);

  const handleToggleWishlist = async () => {
    // Update the UI immediately, then roll back if the API request fails.
    const nextWishlistState = !isWishlisted;
    setIsWishlisted(nextWishlistState); // Optimistic UI update

    try {
      if (nextWishlistState) {
        await axiosInstance.post(`/wishlist/${_id}`);
      } else {
        await axiosInstance.delete(`/wishlist/${_id}`);
      }
    } catch (error) {
      // Revert state if request fails
      setIsWishlisted(!nextWishlistState);
      console.error(error);
    }
  };

  const handleAddToCart = async () => {
    try {
      await addToCart(_id);
    } catch (error) {
      console.error(error);
    }
  };

  const handleQuantity = async (change) => {
    const next = cartQty + change;
    // Clamp: never below 1, never above available stock
    if (next < 1 || (stock !== undefined && next > stock)) return;
    try {
      await updateCartQuantity(_id, next);
    } catch (error) {
      console.error(error);
    }
  };

  // Keep cards compact by showing only the first few words.
  const shortDescription = description
    ? description.split(' ').slice(0, 9).join(' ') + (description.split(' ').length > 9 ? '…' : '')
    : '';

  return (
    <div className="group cursor-pointer border border-[#d9cfbe] bg-[#fbf8f1] transition hover:shadow-[0_16px_40px_-16px_rgba(43,33,24,0.3)]">
      {/* Image */}
      <div className="relative flex aspect-[4/5] items-center justify-center overflow-hidden bg-gradient-to-br from-[#7a4a2b] via-[#5c3520] to-[#3a2315]">
        {image ? (
          <img
            src={image}
            alt={name}
            className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
          />
        ) : (
          <span className="text-6xl text-[#c9a76e]/50 transition group-hover:text-[#c9a76e]/80">
            {name.charAt(0)}
          </span>
        )}
        {/* Low stock ribbon */}
        {stock !== undefined && stock <= 5 && (
          <span className="absolute left-0 top-0 bg-[#8f3b1e] px-3 py-1.5 text-[9px] uppercase tracking-[0.2em] text-[#f6f1e7]">
            Only {stock} left
          </span>
        )}
        {/* Hover ribbon */}
        <span className="absolute bottom-0 left-0 translate-y-full bg-[#2b2118] px-4 py-2 text-[10px] uppercase tracking-[0.25em] text-[#f6f1e7] transition group-hover:translate-y-0">
          View Piece
        </span>
      </div>

      {/* Info */}
      <div className="border-t border-[#e2d9c6] p-5 text-center">
        <p className="text-[9px] uppercase tracking-[0.3em] text-[#8a7c66]">{category}</p>
        <h3 className="mt-2 text-lg leading-snug text-[#2b2118] transition group-hover:text-[#7a4a2b]">
          {name}
        </h3>

        {shortDescription && (
          <p className="mt-2 text-xs italic leading-relaxed text-[#8a7c66]">
            {shortDescription}
          </p>
        )}

        <p className="mt-3 text-xs tracking-[0.15em] text-[#7a4a2b]">{price}</p>

        {stock !== undefined && (
          <p className={`mt-1.5 text-[10px] uppercase tracking-[0.2em] ${stock <= 5 ? 'text-[#8f3b1e]' : 'text-[#6e6250]'}`}>
            {stock > 5 ? `In stock · ${stock} available` : `Only ${stock} left`}
          </p>
        )}

        {/* Wishlist toggle */}
        <button
          type="button"
          onClick={handleToggleWishlist}
          className={`mt-4 w-full border py-2.5 text-[10px] uppercase tracking-[0.25em] transition active:scale-[0.99] ${
            isWishlisted
              ? 'border-[#7a4a2b] bg-[#7a4a2b] text-[#f6f1e7]'
              : 'border-[#c9bda6] bg-transparent text-[#2b2118] hover:border-[#2b2118]'
          }`}
        >
          {isWishlisted ? '♥ Added to Wishlist' : '♡ Add to Wishlist'}
        </button>

        {/* Cart: Add button OR quantity counter */}
        {cartQty === 0 ? (
          <button
            type="button"
            onClick={handleAddToCart}
            disabled={isCartActionRunning || (stock !== undefined && stock === 0)}
            className="mt-2 w-full border border-[#2b2118] bg-[#2b2118] py-2.5 text-[10px] uppercase tracking-[0.25em] text-[#f6f1e7] transition hover:bg-[#7a4a2b] active:scale-[0.99] disabled:cursor-not-allowed disabled:opacity-50"
          >
            {stock === 0 ? 'Out of Stock' : isCartActionRunning ? 'Adding...' : 'Add to Cart'}
          </button>
        ) : (
          <div className="mt-2 flex items-stretch border border-[#2b2118] bg-[#2b2118]">
            <button
              type="button"
              onClick={() => handleQuantity(-1)}
              disabled={isCartActionRunning || cartQty <= 1}
              className="px-4 py-2.5 text-xs text-[#f6f1e7] transition hover:bg-[#7a4a2b] disabled:cursor-not-allowed disabled:opacity-40"
            >
              −
            </button>
            <span className="flex flex-1 items-center justify-center border-x border-[#4a3b2c] py-2.5 text-[10px] uppercase tracking-[0.2em] text-[#f6f1e7]">
              {cartQty} in cart
            </span>
            <button
              type="button"
              onClick={() => handleQuantity(1)}
              disabled={isCartActionRunning || (stock !== undefined && cartQty >= stock)}
              className="px-4 py-2.5 text-xs text-[#f6f1e7] transition hover:bg-[#7a4a2b] disabled:cursor-not-allowed disabled:opacity-40"
            >
              +
            </button>
          </div>
        )}

        <button
          type="button"
          className="mt-2 w-full border border-[#2b2118] py-2.5 text-[10px] uppercase tracking-[0.25em] text-[#2b2118] transition hover:bg-[#2b2118] hover:text-[#f6f1e7]"
          onClick={() => { navigate(`/products/${_id}`); }}
        >
          View Details
        </button>
      </div>
    </div>
  );
}
