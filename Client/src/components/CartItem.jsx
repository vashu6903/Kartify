import { useCart } from '../context/CartContext';

function formatPrice(value) {
  return Number(value || 0).toLocaleString('en-IN');
}

export default function CartItem({ item }) {
  const { actionIds, updateCartQuantity, removeFromCart } = useCart();
  const product = item.product;
  const isWorking = Boolean(actionIds[product?._id]);
  const lineTotal = Number(product?.price || 0) * item.quantity;

  if (!product) {
    return null;
  }

  async function handleQuantity(change) {
    const nextQuantity = item.quantity + change;
    if (nextQuantity < 1 || nextQuantity > product.stock) return;
    await updateCartQuantity(product._id, nextQuantity);
  }

  return (
    <div className="grid gap-5 border-b border-[#d9cfbe] py-6 md:grid-cols-[120px_1fr_auto]">
      <div className="flex aspect-square items-center justify-center overflow-hidden border border-[#d9cfbe] bg-[#fbf8f1]">
        {product.image ? (
          <img src={product.image} alt={product.name} className="h-full w-full object-cover" />
        ) : (
          <span className="text-4xl text-[#c9a76e]/60">{product.name.charAt(0)}</span>
        )}
      </div>

      <div>
        <p className="text-[10px] uppercase tracking-[0.3em] text-[#8a7c66]">{product.category}</p>
        <h3 className="mt-2 text-xl text-[#2b2118]">{product.name}</h3>
        <p className="mt-2 text-sm text-[#7a4a2b]">Rs. {formatPrice(product.price)}</p>
        <p className="mt-1 text-xs italic text-[#8a7c66]">{product.stock} available</p>

        <div className="mt-5 flex flex-wrap items-center gap-3">
          <div className="flex items-center border border-[#c9bda6] bg-[#fbf8f1]">
            <button
              type="button"
              onClick={() => handleQuantity(-1)}
              disabled={isWorking || item.quantity <= 1}
              className="px-4 py-2 text-[#6e6250] transition hover:text-[#2b2118] disabled:cursor-not-allowed disabled:opacity-40"
            >
              -
            </button>
            <span className="w-10 text-center text-sm">{item.quantity}</span>
            <button
              type="button"
              onClick={() => handleQuantity(1)}
              disabled={isWorking || item.quantity >= product.stock}
              className="px-4 py-2 text-[#6e6250] transition hover:text-[#2b2118] disabled:cursor-not-allowed disabled:opacity-40"
            >
              +
            </button>
          </div>

          <button
            type="button"
            onClick={() => removeFromCart(product._id)}
            disabled={isWorking}
            className="border border-[#8f3b1e] px-5 py-2 text-[10px] uppercase tracking-[0.2em] text-[#8f3b1e] transition hover:bg-[#8f3b1e] hover:text-[#f6f1e7] disabled:cursor-not-allowed disabled:opacity-50"
          >
            {isWorking ? 'Updating...' : 'Remove'}
          </button>
        </div>
      </div>

      <div className="text-left md:text-right">
        <p className="text-[10px] uppercase tracking-[0.25em] text-[#8a7c66]">Line Total</p>
        <p className="mt-2 text-lg text-[#2b2118]">Rs. {formatPrice(lineTotal)}</p>
      </div>
    </div>
  );
}
