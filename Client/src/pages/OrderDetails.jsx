import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import Navbar from '../components/Navbar';
import { axiosInstance } from '../axiosCalls/axios';

function formatPrice(value) {
  return Number(value || 0).toLocaleString('en-IN');
}

export default function OrderDetails() {
  const { id } = useParams();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [updatingStatus, setUpdatingStatus] = useState(false);
  const [selectedStatus, setSelectedStatus] = useState('');

  const stages = ["PLACED", "CONFIRMED", "SHIPPED", "DELIVERED"];

  useEffect(() => {
    async function fetchOrder() {
      setLoading(true);
      setError('');
      try {
        const response = await axiosInstance.get(`/orders/${id}`);
        setOrder(response.data.order);
        setSelectedStatus(response.data.order.status);
      } catch (err) {
        setError(err.response?.data?.message || 'Unable to load order.');
      } finally {
        setLoading(false);
      }
    }

    fetchOrder();
  }, [id]);

  async function handleStatusUpdate(e) {
    e.preventDefault();
    if (!selectedStatus || selectedStatus === order.status) return;

    setUpdatingStatus(true);
    try {
      const response = await axiosInstance.patch(`/orders/${id}/status`, {
        status: selectedStatus,
      });
      setOrder(response.data.order);
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to update order status');
    } finally {
      setUpdatingStatus(false);
    }
  }

  const currentStageIndex = order ? stages.indexOf(order.status) : -1;

  return (
    <div className="min-h-screen bg-[#f6f1e7] font-serif text-[#2b2118]">
      <Navbar />
      <main className="mx-auto max-w-5xl px-6 py-14">
        {loading ? (
          <div className="border-y border-[#d9cfbe] bg-[#fbf8f1] p-10 text-center">Loading order...</div>
        ) : error ? (
          <div className="border-y border-[#d9cfbe] bg-[#fbf8f1] p-10 text-center text-[#8f3b1e]">{error}</div>
        ) : order ? (
          <div className="border-y border-[#d9cfbe] bg-[#fbf8f1] p-6 sm:p-8">
            <Link to="/orders" className="text-xs uppercase tracking-[0.2em] text-[#7a4a2b] hover:underline">
              ← Back to Orders
            </Link>

            <div className="mt-5 flex flex-col justify-between gap-4 sm:flex-row sm:items-baseline">
              <div>
                <h1 className="text-3xl">Order #{order._id.slice(-8)}</h1>
                <p className="mt-1 text-xs text-[#8a7c66] font-mono">Full ID: {order._id}</p>
              </div>
              <div className="text-left sm:text-right">
                <span className="rounded bg-[#eedfc9] px-3 py-1 text-xs uppercase tracking-wider font-semibold text-[#2b2118]">
                  {order.status}
                </span>
              </div>
            </div>

            {/* Visual Status Progression Stepper */}
            <div className="mt-8 rounded border border-[#e2d9c6] bg-[#fdfbf7] p-5">
              <p className="text-[10px] uppercase tracking-widest text-[#8a7c66] mb-3">Order Status Progression</p>
              <div className="grid grid-cols-4 gap-2">
                {stages.map((stage, idx) => {
                  const isDone = currentStageIndex >= idx;
                  const isCurrent = currentStageIndex === idx;

                  return (
                    <div key={stage} className="flex flex-col items-center text-center">
                      <div
                        className={`h-3 w-full rounded-full transition-all ${
                          isDone ? 'bg-[#7a4a2b]' : 'bg-[#d9cfbe]'
                        } ${isCurrent ? 'ring-2 ring-[#b08d57]' : ''}`}
                      />
                      <span
                        className={`mt-2 text-[10px] sm:text-xs uppercase tracking-wider ${
                          isDone ? 'font-bold text-[#2b2118]' : 'text-[#a39480]'
                        }`}
                      >
                        {stage}
                      </span>
                    </div>
                  );
                })}
              </div>

              {/* Bonus Challenge: Quick status progression control */}
              <div className="mt-6 border-t border-[#eedfc9] pt-4 flex flex-wrap items-center justify-between gap-3 text-xs">
                <span className="text-[#8a7c66] italic">🌟 Bonus: Update status progression:</span>
                <form onSubmit={handleStatusUpdate} className="flex items-center gap-2">
                  <select
                    value={selectedStatus}
                    onChange={(e) => setSelectedStatus(e.target.value)}
                    className="border border-[#d9cfbe] bg-[#f6f1e7] px-2.5 py-1 text-xs outline-none"
                  >
                    {stages.map((st) => (
                      <option key={st} value={st}>
                        {st}
                      </option>
                    ))}
                  </select>
                  <button
                    type="submit"
                    disabled={updatingStatus || selectedStatus === order.status}
                    className="border border-[#2b2118] bg-[#2b2118] px-3 py-1 text-[11px] uppercase tracking-wider text-[#f6f1e7] hover:bg-[#7a4a2b] disabled:opacity-50"
                  >
                    {updatingStatus ? 'Updating...' : 'Update Status'}
                  </button>
                </form>
              </div>
            </div>

            {/* Shipping & Payment Grid */}
            <div className="mt-8 grid gap-6 sm:grid-cols-2">
              <div className="rounded border border-[#e2d9c6] bg-[#fdfbf7] p-5">
                <h3 className="text-sm uppercase tracking-widest text-[#7a4a2b]">Shipping Details</h3>
                <div className="mt-3 text-sm space-y-1 text-[#6e6250]">
                  <p className="font-semibold text-[#2b2118]">{order.shippingAddress?.fullName}</p>
                  <p>{order.shippingAddress?.phone}</p>
                  <p>{order.shippingAddress?.addressLine1}</p>
                  <p>
                    {order.shippingAddress?.city}, {order.shippingAddress?.state} - {order.shippingAddress?.pincode}
                  </p>
                </div>
              </div>

              <div className="rounded border border-[#e2d9c6] bg-[#fdfbf7] p-5">
                <h3 className="text-sm uppercase tracking-widest text-[#7a4a2b]">Payment Details</h3>
                <div className="mt-3 text-sm space-y-1 text-[#6e6250]">
                  <p>
                    Payment Status:{' '}
                    <span className="font-semibold text-[#2b2118]">{order.paymentStatus}</span>
                  </p>
                  {order.razorpayOrderId && (
                    <p className="font-mono text-xs text-[#8a7c66]">
                      Razorpay Order: {order.razorpayOrderId}
                    </p>
                  )}
                  {order.razorpayPaymentId && (
                    <p className="font-mono text-xs text-[#8a7c66]">
                      Razorpay Payment: {order.razorpayPaymentId}
                    </p>
                  )}
                </div>
              </div>
            </div>

            {/* Order Items */}
            <div className="mt-8">
              <h3 className="text-sm uppercase tracking-widest text-[#7a4a2b] mb-4">Purchased Items Snapshot</h3>
              <div className="space-y-4">
                {order.items.map((item) => (
                  <div key={`${order._id}-${item.product}`} className="flex gap-4 border-b border-[#e2d9c6] pb-4">
                    <div className="h-16 w-16 shrink-0 overflow-hidden border border-[#d9cfbe] bg-[#f6f1e7]">
                      {item.image ? (
                        <img src={item.image} alt={item.name} className="h-full w-full object-cover" />
                      ) : (
                        <div className="h-full w-full flex items-center justify-center text-xs text-[#8a7c66]">No img</div>
                      )}
                    </div>
                    <div className="flex-1 flex justify-between items-center">
                      <div>
                        <h4 className="text-base font-semibold">{item.name}</h4>
                        <p className="text-xs text-[#6e6250]">Qty: {item.quantity}</p>
                        <p className="text-xs text-[#8a7c66]">Price: ₹{formatPrice(item.price)}</p>
                      </div>
                      <div className="text-right font-medium">
                        ₹{formatPrice(item.price * item.quantity)}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="mt-8 flex justify-between items-baseline border-t border-[#d9cfbe] pt-4 text-xl">
              <span className="font-semibold">Total Amount</span>
              <span className="text-2xl font-bold">₹{formatPrice(order.totalAmount)}</span>
            </div>
          </div>
        ) : null}
      </main>
    </div>
  );
}
