import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import Navbar from '../components/Navbar';
import { axiosInstance } from '../axiosCalls/axios';

function formatPrice(value) {
  return Number(value || 0).toLocaleString('en-IN');
}

export default function OrderSuccess() {
  const { id } = useParams();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchOrder() {
      try {
        const response = await axiosInstance.get(`/orders/${id}`);
        setOrder(response.data.order);
      } catch (error) {
        console.log(error);
      } finally {
        setLoading(false);
      }
    }

    fetchOrder();
  }, [id]);

  return (
    <div className="min-h-screen bg-[#f6f1e7] font-serif text-[#2b2118]">
      <Navbar />
      <main className="mx-auto max-w-3xl px-6 py-20 text-center">
        <div className="border-y border-[#d9cfbe] bg-[#fbf8f1] p-8">
          <div className="mb-2 text-2xl">✅</div>
          <h1 className="text-3xl">Order Placed Successfully</h1>
          {loading ? (
            <p className="mt-6 text-sm italic text-[#8a7c66]">Loading order details...</p>
          ) : order ? (
            <>
              <p className="mt-6 text-sm text-[#6e6250]">Order ID</p>
              <p className="mt-1 break-all text-sm font-mono">{order._id}</p>
              <p className="mt-6 text-sm text-[#6e6250]">Total</p>
              <p className="mt-1 text-2xl">₹{formatPrice(order.totalAmount)}</p>
              <p className="mt-6 text-sm text-[#6e6250]">Status</p>
              <p className="mt-1 text-lg font-semibold">{order.status}</p>
              <p className="mt-6 text-sm text-[#6e6250]">Your order has been saved successfully.</p>
            </>
          ) : (
            <p className="mt-6 text-sm text-[#8f3b1e]">Could not load order details.</p>
          )}
          <div className="mt-8 flex flex-wrap justify-center gap-3">
            <Link to="/orders" className="border border-[#2b2118] px-6 py-3 text-xs uppercase tracking-[0.2em] transition hover:bg-[#2b2118] hover:text-[#f6f1e7]">
              View My Orders
            </Link>
            <Link to="/products" className="border border-[#b08d57] bg-[#b08d57] px-6 py-3 text-xs uppercase tracking-[0.2em] text-[#2b2118] transition hover:bg-[#c9a76e]">
              Continue Shopping
            </Link>
          </div>
        </div>
      </main>
    </div>
  );
}
