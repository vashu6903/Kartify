import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { axiosInstance } from '../axiosCalls/axios';

export default function WishlistCard( {p, onRemove }) {
  const {_id, name, description, price, category, image, stock} = p
  const navigate = useNavigate();
  const [isRemoving, setIsRemoving] = useState(false);

  // Keep wishlist cards visually consistent with product cards.
  const shortDescription = description
    ? description.split(' ').slice(0, 9).join(' ') + (description.split(' ').length > 9 ? '…' : '')
    : '';

  async function handleRemove() {
    setIsRemoving(true);
    try {
      // Delete on the server first, then tell the parent page to remove the card.
      await axiosInstance.delete(`/wishlist/${_id}`);
      // Let the page drop this card from its list
      if (onRemove) onRemove(_id);
    } catch (error) {
      console.error(error);
      setIsRemoving(false);
    }
  }


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

        {/* Wishlisted status (static on this page) */}
        <button
          type="button"
          disabled
          className="mt-4 w-full cursor-default border border-[#7a4a2b] bg-[#7a4a2b]/10 py-2.5 text-[10px] uppercase tracking-[0.25em] text-[#7a4a2b]"
        >
          ♥ Added to Wishlist
        </button>

        {/* Remove from wishlist */}
        <button
          type="button"
          onClick={handleRemove}
          disabled={isRemoving}
          className="mt-2 w-full border border-[#8f3b1e] py-2.5 text-[10px] uppercase tracking-[0.25em] text-[#8f3b1e] transition hover:bg-[#8f3b1e] hover:text-[#f6f1e7] disabled:cursor-not-allowed disabled:opacity-60"
        >
          {isRemoving ? 'Removing…' : '✕ Remove from Wishlist'}
        </button>

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
