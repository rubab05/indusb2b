import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router";
import { ordersService } from "../../../services/orders.service";
import { Order, OrderStatus } from "../../../types/orders";
import { ArrowLeft, Download, RotateCcw, X, CheckCircle2, Package, Truck, Clock } from "lucide-react";

const STATUS_STYLES: Record<OrderStatus, string> = {
  Pending: "bg-yellow-100 text-yellow-800",
  Processing: "bg-blue-100 text-blue-800",
  Shipped: "bg-purple-100 text-purple-800",
  Delivered: "bg-green-100 text-green-800",
  Cancelled: "bg-gray-100 text-gray-600",
};

const TIMELINE_ICONS: Record<string, React.ElementType> = {
  "Order Placed": Clock,
  "Payment Confirmed": CheckCircle2,
  Processing: Package,
  Shipped: Truck,
  Delivered: CheckCircle2,
  Cancelled: X,
};

export default function OrderDetailPage() {
  const { orderId } = useParams<{ orderId: string }>();
  const navigate = useNavigate();
  const [order, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);

  useEffect(() => {
    if (!orderId) return;
    ordersService.get(orderId).then((o) => {
      if (!o) setNotFound(true);
      else setOrder(o);
      setLoading(false);
    });
  }, [orderId]);

  if (loading) {
    return (
      <div className="max-w-4xl space-y-6">
        {[...Array(4)].map((_, i) => (
          <div key={i} className="h-24 bg-white border border-gray-200 animate-pulse" />
        ))}
      </div>
    );
  }

  if (notFound || !order) {
    return (
      <div className="text-center py-20">
        <p className="text-sm text-gray-500 mb-4">Order not found.</p>
        <Link to="/dashboard/orders" className="text-sm text-gray-900 underline">
          Back to orders
        </Link>
      </div>
    );
  }

  const canCancel = order.status === "Pending" || order.status === "Processing";

  return (
    <div className="max-w-4xl space-y-6">
      {/* Back */}
      <Link
        to="/dashboard/orders"
        className="inline-flex items-center gap-2 text-sm text-gray-500 hover:text-gray-900 transition-colors"
      >
        <ArrowLeft className="w-4 h-4" strokeWidth={1.5} />
        Back to orders
      </Link>

      {/* Header */}
      <div className="bg-white border border-gray-200 p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <p className="text-xs tracking-widest text-gray-500 mb-1">ORDER</p>
          <h1 className="text-2xl tracking-tight text-gray-900">{order.orderNumber}</h1>
          <p className="text-sm text-gray-500 mt-1">Placed {order.date}</p>
        </div>
        <div className="flex items-center gap-3">
          <span className={`px-3 py-1 text-sm font-medium rounded-sm ${STATUS_STYLES[order.status]}`}>
            {order.status}
          </span>
        </div>
      </div>

      {/* Items table */}
      <div className="bg-white border border-gray-200 overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-100">
          <p className="text-xs tracking-widest text-gray-500">ORDER ITEMS</p>
        </div>
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-gray-50 bg-gray-50">
              {["Product", "SKU", "Qty", "Unit Price", "Line Total"].map((h) => (
                <th key={h} className="px-4 py-3 text-left text-xs tracking-widests text-gray-500 font-normal">
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-50">
            {order.items.map((item) => (
              <tr key={item.id}>
                <td className="px-4 py-3 text-gray-900">{item.productName}</td>
                <td className="px-4 py-3 text-gray-500 font-mono text-xs">{item.sku}</td>
                <td className="px-4 py-3 text-gray-700">{item.qty}</td>
                <td className="px-4 py-3 text-gray-700">£{item.unitPrice.toFixed(2)}</td>
                <td className="px-4 py-3 text-gray-900 font-medium">£{item.lineTotal.toFixed(2)}</td>
              </tr>
            ))}
          </tbody>
        </table>

        {/* Order summary */}
        <div className="border-t border-gray-100 px-6 py-4 flex justify-end">
          <div className="w-64 space-y-2 text-sm">
            <div className="flex justify-between text-gray-600">
              <span>Subtotal</span>
              <span>£{order.subtotal.toFixed(2)}</span>
            </div>
            <div className="flex justify-between text-gray-600">
              <span>Shipping</span>
              <span>{order.shippingCost === 0 ? "Free" : `£${order.shippingCost.toFixed(2)}`}</span>
            </div>
            <div className="flex justify-between font-medium text-gray-900 border-t border-gray-100 pt-2">
              <span>Total</span>
              <span>£{order.total.toFixed(2)}</span>
            </div>
          </div>
        </div>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        {/* Shipping address */}
        <div className="bg-white border border-gray-200 p-6">
          <p className="text-xs tracking-widest text-gray-500 mb-4">SHIPPING ADDRESS</p>
          <div className="text-sm text-gray-700 space-y-0.5">
            <p className="font-medium text-gray-900">{order.shippingAddress.name}</p>
            <p>{order.shippingAddress.company}</p>
            <p>{order.shippingAddress.line1}</p>
            <p>{order.shippingAddress.city}</p>
            <p>{order.shippingAddress.postcode}</p>
            <p>{order.shippingAddress.country}</p>
          </div>
        </div>

        {/* Tracking */}
        <div className="bg-white border border-gray-200 p-6">
          <p className="text-xs tracking-widest text-gray-500 mb-4">TRACKING</p>
          {order.tracking ? (
            <div className="text-sm space-y-2">
              <div className="flex justify-between">
                <span className="text-gray-500">Carrier</span>
                <span className="text-gray-900 font-medium">{order.tracking.carrier}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">Tracking #</span>
                <span className="text-gray-900 font-mono text-xs">{order.tracking.trackingNumber}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">Est. Delivery</span>
                <span className="text-gray-900">{order.tracking.estimatedDelivery}</span>
              </div>
              <div className="flex flex-col gap-1 mt-2">
                <Link
                  to="/dashboard/tracking"
                  className="text-xs text-gray-500 underline hover:text-gray-900 transition-colors"
                >
                  View in Tracking →
                </Link>
                <a
                  href={order.tracking.trackingUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-xs text-gray-400 underline hover:text-gray-700 transition-colors"
                >
                  Track on {order.tracking.carrier} website →
                </a>
              </div>
            </div>
          ) : (
            <p className="text-sm text-gray-400">Tracking not yet available.</p>
          )}
        </div>
      </div>

      {/* Timeline */}
      <div className="bg-white border border-gray-200 p-6">
        <p className="text-xs tracking-widest text-gray-500 mb-6">ORDER TIMELINE</p>
        <ol className="relative border-l border-gray-200 space-y-6 ml-2">
          {order.timeline.map((event, i) => {
            const Icon = TIMELINE_ICONS[event.status] ?? CheckCircle2;
            const isLast = i === order.timeline.length - 1;
            return (
              <li key={i} className="ml-6">
                <span className={`absolute -left-3 flex items-center justify-center w-6 h-6 rounded-full ${isLast ? "bg-gray-900" : "bg-white border border-gray-300"}`}>
                  <Icon className={`w-3 h-3 ${isLast ? "text-white" : "text-gray-500"}`} strokeWidth={2} />
                </span>
                <p className="text-sm font-medium text-gray-900">{event.status}</p>
                <p className="text-xs text-gray-500 mt-0.5">{event.date}</p>
                {event.note && <p className="text-xs text-gray-400 mt-0.5">{event.note}</p>}
              </li>
            );
          })}
        </ol>
      </div>

      {/* Actions */}
      <div className="flex flex-wrap gap-3">
        <button
          onClick={() => navigate("/dashboard/invoices")}
          className="flex items-center gap-2 px-6 py-3 border border-gray-900 text-gray-900 hover:bg-gray-50 transition-colors text-sm tracking-wide"
        >
          <Download className="w-4 h-4" strokeWidth={1.5} />
          DOWNLOAD INVOICE
        </button>
        <button className="flex items-center gap-2 px-6 py-3 border border-gray-200 text-gray-700 hover:border-gray-400 transition-colors text-sm tracking-wide">
          <RotateCcw className="w-4 h-4" strokeWidth={1.5} />
          RE-ORDER
        </button>
        {canCancel && (
          <button className="flex items-center gap-2 px-6 py-3 border border-red-200 text-red-600 hover:border-red-400 transition-colors text-sm tracking-wide">
            <X className="w-4 h-4" strokeWidth={1.5} />
            CANCEL ORDER
          </button>
        )}
      </div>
    </div>
  );
}
