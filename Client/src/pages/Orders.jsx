import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import Navbar from '../components/Navbar';
import { axiosInstance } from '../axiosCalls/axios';

function formatPrice(value) {
  return Number(value || 0).toLocaleString('en-IN');
}

function formatDate(value) {
  return new Date(value).toLocaleDateString('en-IN', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  });
}

export default function Orders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  async function fetchOrders() {
    setLoading(true);
    setError('');
    try {
      const response = await axiosInstance.get('/orders');
      setOrders(response.data.orders || []);
    } catch (err) {
      setError(err.response?.data?.message || 'Unable to load orders.');
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchOrders();
  }, []);

  return (
    <div className="min-h-screen bg-[#f6f1e7] font-serif text-[#2b2118]">
      <Navbar />
      <main className="mx-auto max-w-5xl px-6 py-14">
        <div className="pb-8 text-center">
          <p className="text-[10px] uppercase tracking-[0.4em] text-[#b08d57]">Order History</p>
          <h1 className="mt-3 text-4xl">My Orders</h1>
        </div>

        {loading ? (
          <div className="border-y border-[#d9cfbe] bg-[#fbf8f1] p-10 text-center">Loading orders...</div>
        ) : error ? (
          <div className="border-y border-[#d9cfbe] bg-[#fbf8f1] p-10 text-center">
            <p className="text-[#8f3b1e]">{error}</p>
            <button onClick={fetchOrders} className="mt-6 border border-[#2b2118] px-6 py-3 text-xs uppercase tracking-[0.2em]">
              Try Again
            </button>
          </div>
        ) : orders.length === 0 ? (
          <div className="border-y border-[#d9cfbe] bg-[#fbf8f1] p-10 text-center">
            <h2 className="text-2xl">You have not placed any orders yet.</h2>
            <Link to="/products" className="mt-8 inline-block border border-[#2b2118] px-6 py-3 text-xs uppercase tracking-[0.2em] transition hover:bg-[#2b2118] hover:text-[#f6f1e7]">
              Start Shopping
            </Link>
          </div>
        ) : (
          <div className="space-y-6">
            {orders.map((order) => {
              const stages = ["PLACED", "CONFIRMED", "SHIPPED", "DELIVERED"];
              const currentStageIndex = stages.indexOf(order.status);

              return (
                <article key={order._id} className="border-y border-[#d9cfbe] bg-[#fbf8f1] p-6 shadow-sm">
                  <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                    <div>
                      <h2 className="text-xl">Order #{order._id.slice(-8)}</h2>
                      <p className="mt-1 text-sm italic text-[#8a7c66]">{formatDate(order.createdAt)}</p>
                    </div>
                    <div className="text-left sm:text-right">
                      <p className="text-base font-semibold">Total: ₹{formatPrice(order.totalAmount)}</p>
                      <p className="mt-1 text-xs uppercase tracking-wider font-medium text-[#7a4a2b]">
                        Status: <span className="rounded bg-[#eedfc9] px-2 py-0.5 text-[#2b2118]">{order.status}</span>
                      </p>
                    </div>
                  </div>

                  {/* Status Progression Visual Tracker */}
                  <div className="mt-5 border-t border-[#eedfc9] pt-4">
                    <p className="text-[10px] uppercase tracking-widest text-[#8a7c66] mb-2">Order Progression</p>
                    <div className="flex items-center justify-between gap-1 text-xs">
                      {stages.map((stage, idx) => {
                        const isDone = currentStageIndex >= idx;
                        const isCurrent = currentStageIndex === idx;

                        return (
                          <div key={stage} className="flex-1 flex flex-col items-center text-center">
                            <div
                              className={`h-2.5 w-full rounded-full transition-all ${
                                isDone ? 'bg-[#7a4a2b]' : 'bg-[#d9cfbe]'
                              } ${isCurrent ? 'ring-2 ring-[#b08d57]' : ''}`}
                            />
                            <span
                              className={`mt-1.5 text-[10px] uppercase tracking-wider ${
                                isDone ? 'font-semibold text-[#2b2118]' : 'text-[#a39480]'
                              }`}
                            >
                              {stage}
                            </span>
                          </div>
                        );
                      })}
                    </div>
                  </div>

                  <div className="mt-5 space-y-1 text-sm text-[#6e6250]">
                    {order.items.map((item) => (
                      <p key={`${order._id}-${item.product}`}>
                        {item.name} × {item.quantity}
                      </p>
                    ))}
                  </div>

                  <Link
                    to={`/orders/${order._id}`}
                    className="mt-6 inline-block border border-[#2b2118] px-5 py-2.5 text-xs uppercase tracking-[0.2em] transition hover:bg-[#2b2118] hover:text-[#f6f1e7]"
                  >
                    View Details
                  </Link>
                </article>
              );
            })}
          </div>
        )}
      </main>
    </div>
  );
}
