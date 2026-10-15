import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import { axiosInstance } from '../axiosCalls/axios';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/authContext';

const initialAddress = {
  fullName: '',
  phone: '',
  addressLine1: '',
  city: '',
  state: '',
  pincode: '',
};

function formatPrice(value) {
  return Number(value || 0).toLocaleString('en-IN');
}

function loadRazorpayScript() {
  return new Promise((resolve) => {
    if (window.Razorpay) {
      resolve(true);
      return;
    }

    const script = document.createElement('script');
    script.src = 'https://checkout.razorpay.com/v1/checkout.js';
    script.onload = () => resolve(true);
    script.onerror = () => resolve(false);
    document.body.appendChild(script);
  });
}

function validateAddress(address) {
  const errors = {};

  Object.entries(address).forEach(([key, value]) => {
    if (!value.trim()) {
      errors[key] = 'This field is required.';
    }
  });

  if (address.phone.trim() && !/^[0-9]{10}$/.test(address.phone.trim())) {
    errors.phone = 'Phone must contain 10 digits.';
  }

  if (address.pincode.trim() && !/^[0-9]{6}$/.test(address.pincode.trim())) {
    errors.pincode = 'Pincode must contain 6 digits.';
  }

  return errors;
}

export default function Checkout() {
  const navigate = useNavigate();
  const { customer } = useAuth();
  const { cartItems, subtotal, loading, clearCart } = useCart();
  const [shippingAddress, setShippingAddress] = useState(initialAddress);
  const [errors, setErrors] = useState({});
  const [formError, setFormError] = useState('');
  const [placingOrder, setPlacingOrder] = useState(false);

  useEffect(() => {
    if (customer) {
      setShippingAddress((prev) => ({
        ...prev,
        fullName: prev.fullName || customer.fullName || '',
        phone: prev.phone || customer.contactNo || '',
      }));
    }
  }, [customer]);

  function handleChange(e) {
    const { name, value } = e.target;
    setShippingAddress((prev) => ({ ...prev, [name]: value }));
  }

  async function handlePlaceOrder(e) {
    e.preventDefault();
    const nextErrors = validateAddress(shippingAddress);
    setErrors(nextErrors);
    setFormError('');

    if (Object.keys(nextErrors).length > 0) {
      return;
    }

    if (cartItems.length === 0) {
      setFormError('Your cart is empty.');
      return;
    }

    setPlacingOrder(true);
    try {
      const scriptLoaded = await loadRazorpayScript();

      if (!scriptLoaded) {
        setFormError('Unable to load Razorpay Checkout. Please check your internet connection.');
        setPlacingOrder(false);
        return;
      }

      const createResponse = await axiosInstance.post('/orders/create-payment-order', {
        shippingAddress,
      });

      const paymentData = createResponse.data;

      const options = {
        key: paymentData.key,
        amount: paymentData.amount,
        currency: paymentData.currency,
        name: 'ShopKart',
        description: 'ShopKart Order Payment',
        order_id: paymentData.razorpayOrderId,
        prefill: {
          name: shippingAddress.fullName,
          contact: shippingAddress.phone,
        },
        handler: async function (response) {
          try {
            setPlacingOrder(true);
            const verifyResponse = await axiosInstance.post('/orders/verify-payment', {
              shopKartOrderId: paymentData.shopKartOrderId,
              razorpay_order_id: response.razorpay_order_id,
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_signature: response.razorpay_signature,
            });

            clearCart();
            navigate(`/order-success/${verifyResponse.data.order._id}`);
          } catch (err) {
            setFormError(err.response?.data?.message || 'Payment verification failed. Your cart was not cleared.');
          } finally {
            setPlacingOrder(false);
          }
        },
        modal: {
          ondismiss: function () {
            setPlacingOrder(false);
          },
        },
        theme: {
          color: '#2b2118',
        },
      };

      const paymentObject = new window.Razorpay(options);

      paymentObject.on('payment.failed', function (response) {
        setFormError(response.error?.description || 'Payment failed. Your cart has not been cleared. Please try again.');
        setPlacingOrder(false);
      });

      paymentObject.open();
    } catch (err) {
      setFormError(err.response?.data?.message || 'Unable to place order.');
      setPlacingOrder(false);
    }
  }

  return (
    <div className="min-h-screen bg-[#f6f1e7] font-serif text-[#2b2118]">
      <Navbar />

      <main className="mx-auto max-w-6xl px-6 py-14">
        <div className="pb-8 text-center">
          <p className="text-[10px] uppercase tracking-[0.4em] text-[#b08d57]">Secure Payment</p>
          <h1 className="mt-3 text-4xl">Checkout</h1>
        </div>

        {loading ? (
          <div className="border-y border-[#d9cfbe] bg-[#fbf8f1] px-6 py-16 text-center">
            <p className="text-sm italic text-[#8a7c66]">Loading your cart...</p>
          </div>
        ) : cartItems.length === 0 ? (
          <div className="border-y border-[#d9cfbe] bg-[#fbf8f1] px-6 py-16 text-center">
            <h2 className="text-2xl">Your cart is empty</h2>
            <Link
              to="/products"
              className="mt-8 inline-block border border-[#2b2118] px-8 py-3 text-xs uppercase tracking-[0.25em] text-[#2b2118] transition hover:bg-[#2b2118] hover:text-[#f6f1e7]"
            >
              Browse Products
            </Link>
          </div>
        ) : (
          <form onSubmit={handlePlaceOrder} className="grid gap-10 lg:grid-cols-[1fr_360px]">
            <section className="border-y border-[#d9cfbe] bg-[#fbf8f1] p-6">
              <h2 className="text-2xl">Shipping Details</h2>
              <div className="mt-6 grid gap-5 sm:grid-cols-2">
                {[
                  ['fullName', 'Full Name'],
                  ['phone', 'Phone'],
                  ['addressLine1', 'Address'],
                  ['city', 'City'],
                  ['state', 'State'],
                  ['pincode', 'Pincode'],
                ].map(([name, label]) => (
                  <label key={name} className={name === 'addressLine1' ? 'sm:col-span-2' : ''}>
                    <span className="mb-1.5 block text-[11px] uppercase tracking-[0.2em] text-[#6e6250]">
                      {label}
                    </span>
                    <input
                      name={name}
                      value={shippingAddress[name]}
                      onChange={handleChange}
                      className="w-full border border-[#d9cfbe] bg-[#f6f1e7] px-3.5 py-2.5 text-sm outline-none transition focus:border-[#7a4a2b]"
                    />
                    {errors[name] && (
                      <span className="mt-1 block text-xs text-[#8f3b1e]">{errors[name]}</span>
                    )}
                  </label>
                ))}
              </div>

              {formError && (
                <p className="mt-6 border border-[#8f3b1e] px-4 py-3 text-sm text-[#8f3b1e]">{formError}</p>
              )}
            </section>

            <aside className="h-fit border-y border-[#d9cfbe] bg-[#fbf8f1] p-6">
              <h2 className="text-2xl">Order Summary</h2>
              <div className="mt-6 space-y-4">
                {cartItems.map((item) => (
                  <div key={item.product?._id} className="flex justify-between gap-4 border-b border-[#e2d9c6] pb-3 text-sm">
                    <span>{item.product?.name} x {item.quantity}</span>
                    <span>₹{formatPrice(Number(item.product?.price || 0) * item.quantity)}</span>
                  </div>
                ))}
                <div className="flex justify-between pt-2 text-lg">
                  <span>Total</span>
                  <span>₹{formatPrice(subtotal)}</span>
                </div>
              </div>

              <button
                type="submit"
                disabled={placingOrder}
                className="mt-8 w-full bg-[#2b2118] py-3 text-xs uppercase tracking-[0.25em] text-[#f6f1e7] transition hover:bg-[#7a4a2b] disabled:cursor-not-allowed disabled:opacity-60"
              >
                {placingOrder ? 'Opening Payment...' : 'Place Order'}
              </button>
            </aside>
          </form>
        )}
      </main>
    </div>
  );
}
