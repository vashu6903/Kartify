import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { axiosInstance } from '../axiosCalls/axios';
import Navbar from '../components/Navbar.jsx';
import { useCart } from '../context/CartContext.jsx';

export default function ProductDetails() {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);
  const [quantity, setQuantity] = useState(1);
  const { actionIds, addToCart, updateCartQuantity, getCartItem } = useCart();



  useEffect(() => {
    async function fetchProduct() {
      // The URL id decides which product detail document to load.
      setLoading(true);
      setNotFound(false);
      try {
        const response = await axiosInstance.get(`/products/${id}`);
        setProduct(response.data.productData);
      } catch (error) {
        if (error.response && error.response.status === 404) {
          setNotFound(true);
        } else {
          console.log(error);
        }
      } finally {
        setLoading(false);
      }
    }
    fetchProduct();
  }, [id]);

  function handleQuantity(change) {
    // Quantity cannot go below one on the details page.
    setQuantity((q) => {
      const next = q + change;
      if (product?.stock && next > product.stock) return q;
      return Math.max(1, next);
    });
  }

  async function handleAddToCart() {
    if (!product) return;

    const existingCartItem = getCartItem(product._id);
    const currentQuantity = existingCartItem?.quantity || 0;
    const nextQuantity = currentQuantity + quantity;

    try {
      if (currentQuantity === 0) {
        await addToCart(product._id);
        if (nextQuantity > 1) {
          await updateCartQuantity(product._id, nextQuantity);
        }
      } else {
        await updateCartQuantity(product._id, nextQuantity);
      }
    } catch (error) {
      console.error(error);
    }
  }

  return (
    <div className="min-h-screen bg-[#f6f1e7] font-serif text-[#2b2118]">
      <Navbar />

      {/* ── Loading ── */}
      {loading ? (
        <div className="mx-auto grid max-w-6xl grid-cols-1 gap-12 px-6 py-24 md:grid-cols-2">
          <div className="animate-pulse">
            <div className="aspect-[4/5] bg-[#e2d9c6]" />
            <div className="mt-2 grid grid-cols-3 gap-2">
              {[1, 2, 3].map((n) => (
                <div key={n} className="aspect-square bg-[#e2d9c6]" />
              ))}
            </div>
          </div>
          <div className="animate-pulse space-y-6">
            <div className="h-3 w-1/3 bg-[#e2d9c6]" />
            <div className="h-10 w-3/4 bg-[#e2d9c6]" />
            <div className="h-6 w-1/4 bg-[#e2d9c6]" />
            <div className="h-24 w-full bg-[#e2d9c6]" />
            <div className="h-12 w-full bg-[#e2d9c6]" />
          </div>
        </div>
      ) : notFound || !product ? (
        /* ── Not found ── */
        <div className="mx-auto flex max-w-6xl flex-col items-center px-6 py-24 text-center">
          <span className="text-3xl text-[#c9bda6]">❦</span>
          <h1 className="mt-6 text-3xl">Piece not found</h1>
          <p className="mt-3 max-w-sm text-sm italic text-[#8a7c66]">
            This piece may have been sold or retired from the collection.
          </p>
          <Link
            to="/products"
            className="mt-8 border border-[#2b2118] px-8 py-3 text-xs uppercase tracking-[0.25em] text-[#2b2118] transition hover:bg-[#2b2118] hover:text-[#f6f1e7]"
          >
            Back to the Collection
          </Link>
        </div>
      ) : (
        /* ── Product found ── */
        <>
          {/* Breadcrumb */}
          <div className="mx-auto max-w-6xl px-6 py-6 text-xs uppercase tracking-[0.2em] text-[#8a7c66]">
            <Link to="/" className="transition hover:text-[#7a4a2b]">Home</Link>
            <span className="mx-2 text-[#c9bda6]">/</span>
            <Link to="/products" className="transition hover:text-[#7a4a2b]">{product.category}</Link>
            <span className="mx-2 text-[#c9bda6]">/</span>
            <span className="text-[#2b2118]">{product.name}</span>
          </div>

          <main className="mx-auto grid max-w-6xl grid-cols-1 gap-12 px-6 pb-24 md:grid-cols-2">
            {/* Image */}
            <div className="border border-[#d9cfbe]">
              {product.image ? (
                <img
                  src={product.image}
                  alt={product.name}
                  className="aspect-[4/5] w-full object-cover"
                />
              ) : (
                <div className="flex aspect-[4/5] items-center justify-center bg-gradient-to-br from-[#7a4a2b] via-[#5c3520] to-[#3a2315]">
                  <span className="text-8xl text-[#c9a76e]/50">{product.name.charAt(0)}</span>
                </div>
              )}
              <div className="grid grid-cols-3 gap-px border-t border-[#d9cfbe] bg-[#d9cfbe]">
                {['A', 'B', 'C'].map((t) => (
                  <div
                    key={t}
                    className="flex aspect-square cursor-pointer items-center justify-center bg-[#f6f1e7] transition hover:bg-[#efe7d7]"
                  >
                    <span className="text-2xl text-[#7a4a2b]/40">{t}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Info */}
            <div>
              <p className="text-[10px] uppercase tracking-[0.4em] text-[#b08d57]">
                The Collection · {product.category}
              </p>
              <h1 className="mt-4 text-4xl leading-tight">{product.name}</h1>
              <div className="mt-4 flex items-center gap-3">
                <span className="h-px w-10 bg-[#c9bda6]" />
                <span className="text-[10px] text-[#b08d57]">❦</span>
                <span className="h-px w-10 bg-[#c9bda6]" />
              </div>
              <p className="mt-6 text-2xl tracking-[0.1em] text-[#7a4a2b]">{product.price}</p>
              <p className="mt-1 text-xs italic text-[#8a7c66]">
                {product.stock > 5
                  ? 'In stock · ships within 2 days'
                  : `Only ${product.stock} left — order soon`}
              </p>

              <p className="mt-8 text-sm leading-relaxed text-[#6e6250]">
                {product.description}
              </p>

              {/* Quantity + CTA */}
              <div className="mt-10 flex items-stretch gap-4">
                <div className="flex items-center border border-[#c9bda6] bg-[#fbf8f1]">
                  <button
                    type="button"
                    onClick={() => handleQuantity(-1)}
                    className="px-4 py-3 text-lg text-[#8a7c66] transition hover:text-[#2b2118]"
                  >
                    −
                  </button>
                  <span className="w-10 text-center text-sm">{quantity}</span>
                  <button
                    type="button"
                    onClick={() => handleQuantity(1)}
                  disabled={product.stock !== undefined && quantity >= product.stock}
                    className="px-4 py-3 text-lg text-[#8a7c66] transition hover:text-[#2b2118]"
                  >
                    +
                  </button>
                </div>
                <button
                  type="button"
                  onClick={handleAddToCart}
                  disabled={Boolean(actionIds[product._id]) || product.stock === 0}
                  className="flex-1 bg-[#2b2118] py-3.5 text-xs uppercase tracking-[0.25em] text-[#f6f1e7] transition hover:bg-[#7a4a2b]"
                >
                  {actionIds[product._id] ? 'Adding...' : product.stock === 0 ? 'Out of Stock' : 'Add to Cart'}
                </button>
              </div>
              <button
                type="button"
                className="mt-3 w-full border border-[#2b2118] py-3.5 text-xs uppercase tracking-[0.25em] text-[#2b2118] transition hover:bg-[#2b2118] hover:text-[#f6f1e7]"
              >
                Add to Wish List
              </button>
            </div>
          </main>
        </>
      )}

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
