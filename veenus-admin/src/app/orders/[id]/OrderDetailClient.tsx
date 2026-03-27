'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { orders } from '@/data';
import { OrderStatus } from '@/types';

export default function OrderDetailClient({ params }: { params: { id: string } }) {
  const router = useRouter();
  const order = orders.find((o) => o.id === params.id);
  const [currentStatus, setCurrentStatus] = useState<OrderStatus>(order?.status || 'pending');
  const [saved, setSaved] = useState(false);

  if (!order) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <p className="text-[#555] text-lg mb-4">Order not found</p>
          <button onClick={() => router.push('/orders')} className="btn-gold">Back to Orders</button>
        </div>
      </div>
    );
  }

  const statusColors: Record<OrderStatus, string> = {
    pending: 'badge-warning',
    confirmed: 'badge-info',
    processing: 'badge-info',
    shipped: 'badge-gold',
    delivered: 'badge-success',
    cancelled: 'badge-danger',
    returned: 'badge-danger',
  };

  const statusTimeline: OrderStatus[] = ['pending', 'confirmed', 'processing', 'shipped', 'delivered'];
  const currentStepIndex = statusTimeline.indexOf(currentStatus);

  const handleStatusUpdate = () => {
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  return (
    <div className="max-w-5xl space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-semibold text-[#e5e5e5]">Order {order.orderNumber}</h2>
          <p className="text-sm text-[#666] mt-0.5">
            Placed on {new Date(order.createdAt).toLocaleDateString('en-GB', {
              day: '2-digit', month: 'long', year: 'numeric',
            })}
          </p>
        </div>
        <button onClick={() => router.push('/orders')} className="btn-outline">← Back to Orders</button>
      </div>

      {saved && (
        <div className="bg-green-500/10 border border-green-500/20 rounded-lg px-4 py-3 text-green-400 text-sm">
          ✓ Order status updated successfully!
        </div>
      )}

      {/* Status Timeline */}
      {currentStatus !== 'cancelled' && currentStatus !== 'returned' && (
        <div className="admin-card p-6">
          <h3 className="text-base font-semibold text-[#e5e5e5] mb-6">Order Progress</h3>
          <div className="flex items-center justify-between">
            {statusTimeline.map((status, index) => {
              const isCompleted = index <= currentStepIndex;
              const isCurrent = index === currentStepIndex;
              return (
                <div key={status} className="flex flex-col items-center flex-1">
                  <div className="flex items-center w-full">
                    {index > 0 && (
                      <div className={`flex-1 h-0.5 ${index <= currentStepIndex ? 'bg-gold-500' : 'bg-[#222]'}`} />
                    )}
                    <div
                      className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0 ${
                        isCurrent ? 'bg-gold-500 text-white ring-4 ring-gold-500/20' :
                        isCompleted ? 'bg-gold-700 text-gold-100' : 'bg-[#1a1a1a] text-[#555]'
                      }`}
                    >
                      {isCompleted && index < currentStepIndex ? '✓' : index + 1}
                    </div>
                    {index < statusTimeline.length - 1 && (
                      <div className={`flex-1 h-0.5 ${index < currentStepIndex ? 'bg-gold-500' : 'bg-[#222]'}`} />
                    )}
                  </div>
                  <span className={`text-xs mt-2 capitalize ${isCurrent ? 'text-gold-400 font-medium' : 'text-[#555]'}`}>
                    {status}
                  </span>
                </div>
              );
            })}
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Order Details */}
        <div className="lg:col-span-2 space-y-6">
          {/* Order Items */}
          <div className="admin-card p-6">
            <h3 className="text-base font-semibold text-[#e5e5e5] mb-4">Order Items</h3>
            <div className="space-y-4">
              {order.items.map((item) => (
                <div key={item.id} className="flex items-center gap-4 py-3 border-b border-[#1a1a1a] last:border-0">
                  <div className="w-16 h-16 rounded-lg bg-[#1a1a1a] overflow-hidden flex-shrink-0">
                    <img src={item.product.images[0]} alt={item.product.name} className="w-full h-full object-cover" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-[#e5e5e5]">{item.product.name}</p>
                    <div className="flex items-center gap-3 mt-1">
                      <span className="text-xs text-[#666]">Size: {item.size}</span>
                      <span className="text-xs text-[#666] flex items-center gap-1">
                        Color: <span className="w-3 h-3 rounded-full inline-block border border-[#333]" style={{ backgroundColor: item.color.hex }} /> {item.color.name}
                      </span>
                      <span className="text-xs text-[#666]">Qty: {item.quantity}</span>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-medium text-[#e5e5e5]">€{item.price.toLocaleString()}</p>
                    <p className="text-xs text-[#555]">€{(item.price / item.quantity).toLocaleString()} each</p>
                  </div>
                </div>
              ))}
            </div>

            {/* Totals */}
            <div className="mt-4 pt-4 border-t border-[#222] space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-[#999]">Subtotal</span>
                <span className="text-[#e5e5e5]">€{order.subtotal.toLocaleString()}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-[#999]">Shipping</span>
                <span className="text-[#e5e5e5]">{order.shipping === 0 ? 'Free' : `€${order.shipping}`}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-[#999]">Tax</span>
                <span className="text-[#e5e5e5]">€{order.tax.toLocaleString()}</span>
              </div>
              <div className="flex justify-between text-base font-semibold pt-2 border-t border-[#1a1a1a]">
                <span className="text-[#e5e5e5]">Total</span>
                <span className="text-gradient-gold">€{order.total.toLocaleString()}</span>
              </div>
            </div>
          </div>

          {/* Notes */}
          {order.notes && (
            <div className="admin-card p-6">
              <h3 className="text-base font-semibold text-[#e5e5e5] mb-2">Order Notes</h3>
              <p className="text-sm text-[#999]">{order.notes}</p>
            </div>
          )}
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Status Management */}
          <div className="admin-card p-6">
            <h3 className="text-base font-semibold text-[#e5e5e5] mb-4">Update Status</h3>
            <select
              value={currentStatus}
              onChange={(e) => setCurrentStatus(e.target.value as OrderStatus)}
              className="admin-select mb-3"
            >
              <option value="pending">Pending</option>
              <option value="confirmed">Confirmed</option>
              <option value="processing">Processing</option>
              <option value="shipped">Shipped</option>
              <option value="delivered">Delivered</option>
              <option value="cancelled">Cancelled</option>
              <option value="returned">Returned</option>
            </select>
            <button onClick={handleStatusUpdate} className="btn-gold w-full">
              Update Status
            </button>

            <div className="mt-4 pt-4 border-t border-[#1a1a1a]">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs text-[#666]">Current Status</span>
                <span className={`badge ${statusColors[currentStatus]}`}>{currentStatus}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-xs text-[#666]">Payment</span>
                <span className={`badge ${order.paymentStatus === 'paid' ? 'badge-success' : order.paymentStatus === 'refunded' ? 'badge-neutral' : 'badge-warning'}`}>
                  {order.paymentStatus}
                </span>
              </div>
            </div>
          </div>

          {/* Customer Info */}
          <div className="admin-card p-6">
            <h3 className="text-base font-semibold text-[#e5e5e5] mb-4">Customer</h3>
            <div className="space-y-3">
              <div>
                <p className="text-sm font-medium text-[#e5e5e5]">{order.customer.name}</p>
                <p className="text-xs text-[#555]">
                  {order.customer.totalOrders} orders · €{order.customer.totalSpent.toLocaleString()} total
                </p>
              </div>
              <div className="pt-3 border-t border-[#1a1a1a] space-y-2">
                <div className="flex items-start gap-2">
                  <span className="text-xs text-[#555] w-12 flex-shrink-0 mt-0.5">Email</span>
                  <span className="text-sm text-[#ccc]">{order.customer.email}</span>
                </div>
                <div className="flex items-start gap-2">
                  <span className="text-xs text-[#555] w-12 flex-shrink-0 mt-0.5">Phone</span>
                  <span className="text-sm text-[#ccc]">{order.customer.phone}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Shipping Address */}
          <div className="admin-card p-6">
            <h3 className="text-base font-semibold text-[#e5e5e5] mb-4">Shipping Address</h3>
            <div className="text-sm text-[#999] space-y-1">
              <p>{order.customer.name}</p>
              <p>{order.customer.address}</p>
              <p>{order.customer.city}, {order.customer.postalCode}</p>
              <p>{order.customer.country}</p>
            </div>
          </div>

          {/* Timestamps */}
          <div className="admin-card p-6">
            <h3 className="text-base font-semibold text-[#e5e5e5] mb-4">Timeline</h3>
            <div className="space-y-2">
              <div className="flex items-center justify-between text-sm">
                <span className="text-[#666]">Created</span>
                <span className="text-[#999]">{new Date(order.createdAt).toLocaleDateString('en-GB')}</span>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span className="text-[#666]">Updated</span>
                <span className="text-[#999]">{new Date(order.updatedAt).toLocaleDateString('en-GB')}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
