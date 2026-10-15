import { Link, useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import CartItem from '../components/CartItem';
import { useCart } from '../context/CartContext';

function formatPrice(value) {
  return Number(value || 0).toLocaleString('en-IN');
}

export default function Cart() {
  const navigate = useNavigate();
  const { cartItems, loading, error, totalUnits, subtotal, refreshCart } = useCart();

  return (
    <div className="min-h-screen bg-[#f6f1e7] font-serif text-[#2b2118]">
      <Navbar />

      <main className="mx-auto max-w-6xl px-6 py-14">
        <div className="pb-8 text-center">
          <p className="text-[10px] uppercase tracking-[0.4em] text-[#b08d57]">Ready to Order</p>
          <h1 className="mt-3 text-4xl">My Cart</h1>
        </div>

        {loading ? (
          <div className="border-y border-[#d9cfbe] bg-[#fbf8f1] px-6 py-16 text-center">
            <p className="text-sm italic text-[#8a7c66]">Loading your cart...</p>
          </div>
        ) : error ? (
          <div className="border-y border-[#d9cfbe] bg-[#fbf8f1] px-6 py-16 text-center">
            <h2 className="text-2xl">Unable to load your cart.</h2>
            <p className="mt-3 text-sm italic text-[#8a7c66]">{error}</p>
            <button
              type="button"
              onClick={refreshCart}
              className="mt-8 border border-[#2b2118] px-8 py-3 text-xs uppercase tracking-[0.25em] text-[#2b2118] transition hover:bg-[#2b2118] hover:text-[#f6f1e7]"
            >
              Try Again
            </button>
          </div>
        ) : cartItems.length === 0 ? (
          <div className="border-y border-[#d9cfbe] bg-[#fbf8f1] px-6 py-16 text-center">
            <h2 className="text-2xl">Your cart is empty</h2>
            <p className="mt-3 text-sm italic text-[#8a7c66]">
              Looks like you have not added anything yet.
            </p>
            <Link
              to="/products"
              className="mt-8 inline-block border border-[#2b2118] px-8 py-3 text-xs uppercase tracking-[0.25em] text-[#2b2118] transition hover:bg-[#2b2118] hover:text-[#f6f1e7]"
            >
              Browse Products
            </Link>
          </div>
        ) : (
          <div className="grid gap-10 lg:grid-cols-[1fr_320px]">
            <section className="border-y border-[#d9cfbe] bg-[#fbf8f1] px-6">
              {cartItems.map((item) => (
                <CartItem key={item.product?._id} item={item} />
              ))}
            </section>

            <aside className="h-fit border-y border-[#d9cfbe] bg-[#fbf8f1] p-6">
              <h2 className="text-2xl">Order Summary</h2>
              <div className="mt-6 space-y-4 text-sm">
                <div className="flex justify-between border-b border-[#e2d9c6] pb-3">
                  <span className="text-[#6e6250]">Items</span>
                  <span>{totalUnits}</span>
                </div>
                <div className="flex justify-between border-b border-[#e2d9c6] pb-3">
                  <span className="text-[#6e6250]">Subtotal</span>
                  <span>Rs. {formatPrice(subtotal)}</span>
                </div>
              </div>
              <button
                type="button"
                onClick={() => navigate('/checkout')}
                className="mt-8 w-full bg-[#2b2118] py-3 text-xs uppercase tracking-[0.25em] text-[#f6f1e7] transition hover:bg-[#7a4a2b]"
              >
                Proceed to Checkout
              </button>
            </aside>
          </div>
        )}
      </main>
    </div>
  );
}
