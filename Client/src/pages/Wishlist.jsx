import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { axiosInstance } from '../axiosCalls/axios';
import Navbar from '../components/Navbar';
import WishlistCard from '../components/WishlistCard';

export default function Wishlist() {
  const [wishlistData, setWishlistData] = useState({ success: false, count: 0, products: [] });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  async function fetchWishlist() {
      setLoading(true);
      setError(null); // clear any previous error on every attempt
      try {
        // Backend returns populated product documents for the logged-in customer.
        const response = await axiosInstance.get('/wishlist');
        if (response.data) {
          setWishlistData(response.data);
        }
      } catch (err) {
        setError('Could not load your wishlist. Please try again.');
        console.log(err);
      } finally {
        setLoading(false);
      }
  }

  useEffect(() => {

    fetchWishlist();
  }, []);

  function handleRemove(_id) {
    // Remove the card locally after WishlistCard deletes it on the server.
    setWishlistData((prev) => ({
      ...prev,
      count: prev.count - 1,
      products: prev.products.filter((p) => p._id !== _id),
    }));
  }

  return (
    <div className="min-h-screen bg-[#f6f1e7] font-serif text-[#2b2118]">
      <Navbar />

      {/* Page heading */}
      <div className="mx-auto max-w-6xl px-6 pb-10 pt-16 text-center">
        <p className="text-[10px] uppercase tracking-[0.4em] text-[#b08d57]">Saved for Later</p>
        <h1 className="mt-3 text-4xl">Your Wishlist</h1>
        <div className="mx-auto mt-4 flex items-center justify-center gap-3">
          <span className="h-px w-10 bg-[#c9bda6]" />
          <span className="text-[10px] text-[#b08d57]">❦</span>
          <span className="h-px w-10 bg-[#c9bda6]" />
        </div>
        {!loading && !error && wishlistData.count > 0 && (
          <p className="mt-4 text-sm italic text-[#8a7c66]">
            {wishlistData.count} {wishlistData.count === 1 ? 'piece' : 'pieces'} kept aside.
          </p>
        )}
      </div>

      {/* Content */}
      <div className="mx-auto max-w-6xl px-6 pb-24">
        {/* ── Loading ── */}
        {loading ? (
          <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="animate-pulse border border-[#d9cfbe] bg-[#fbf8f1]">
                <div className="aspect-[4/5] bg-[#e2d9c6]" />
                <div className="space-y-3 border-t border-[#e2d9c6] p-5 text-center">
                  <div className="mx-auto h-2 w-1/3 bg-[#e2d9c6]" />
                  <div className="mx-auto h-3 w-2/3 bg-[#e2d9c6]" />
                  <div className="mx-auto h-2 w-1/2 bg-[#e2d9c6]" />
                  <div className="mx-auto h-8 w-full bg-[#e2d9c6]" />
                </div>
              </div>
            ))}
          </div>
        ) : error ? (
          /* ── Error + Retry ── */
          <div className="flex flex-col items-center py-20 text-center">
            <span className="text-3xl text-[#c9bda6]">✕</span>
            <h3 className="mt-6 text-2xl">Something went wrong</h3>
            <p className="mt-3 max-w-sm text-sm italic text-[#8a7c66]">
              {error}
            </p>
            <button
              type="button"
              onClick={fetchWishlist}
              className="mt-8 border border-[#2b2118] px-8 py-3 text-xs uppercase tracking-[0.25em] text-[#2b2118] transition hover:bg-[#2b2118] hover:text-[#f6f1e7]"
            >
              ↻ Try Again
            </button>
          </div>
        ) : wishlistData.products.length === 0 ? (
          /* ── Empty wishlist ── */
          <div className="flex flex-col items-center py-20 text-center">
            <span className="text-3xl text-[#c9bda6]">♡</span>
            <h3 className="mt-6 text-2xl">Nothing saved yet</h3>
            <p className="mt-3 max-w-sm text-sm italic text-[#8a7c66]">
              Pieces you add to your wishlist will wait for you here, like a
              well-kept ledger.
            </p>
            <Link
              to="/products"
              className="mt-8 border border-[#2b2118] px-8 py-3 text-xs uppercase tracking-[0.25em] text-[#2b2118] transition hover:bg-[#2b2118] hover:text-[#f6f1e7]"
            >
              Browse the Collection
            </Link>
          </div>
        ) : (
          /* ── Wishlist items ── */
          <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {wishlistData.products.map((p) => (
              <WishlistCard
                key={p._id}
                p={p}
                onRemove={handleRemove}
              />
            ))}
          </div>
        )}
      </div>

      {/* Footer */}
      <footer className="bg-[#2b2118] text-[#c9bda6]">
        <div className="mx-auto max-w-6xl px-6 py-12 text-center">
          <p className="tracking-[0.25em]">
            ASHFORD <span className="text-[#b08d57]">&amp;</span> SONS
          </p>
          <p className="mt-10 text-[10px] tracking-[0.2em] text-[#8a7c66]">
            © 2026 Ashford &amp; Sons Ltd. · Northampton, England
          </p>
        </div>
      </footer>
    </div>
  );
}
