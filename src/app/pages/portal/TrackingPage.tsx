import { useEffect, useState } from "react";
import { Link } from "react-router";
import { trackingService, Shipment, ShipmentStatus } from "../../../services/tracking.service";
import { Package, ChevronDown, ChevronUp, ExternalLink } from "lucide-react";

const STEPS: ShipmentStatus[] = ["Dispatched", "In Transit", "Out for Delivery", "Delivered"];

const STATUS_STYLES: Record<ShipmentStatus, string> = {
  Dispatched: "bg-blue-100 text-blue-800",
  "In Transit": "bg-purple-100 text-purple-800",
  "Out for Delivery": "bg-yellow-100 text-yellow-800",
  Delivered: "bg-green-100 text-green-800",
};

function ProgressBar({ status }: { status: ShipmentStatus }) {
  const currentIdx = STEPS.indexOf(status);
  return (
    <div className="mt-4">
      <div className="flex items-center gap-0">
        {STEPS.map((step, i) => {
          const done = i <= currentIdx;
          const isLast = i === STEPS.length - 1;
          return (
            <div key={step} className="flex items-center flex-1">
              <div className="flex flex-col items-center flex-1">
                <div
                  className={`w-3 h-3 rounded-full flex-shrink-0 ${
                    done ? "bg-gray-900" : "bg-gray-200"
                  }`}
                />
                <p className={`text-xs mt-1.5 text-center leading-tight ${done ? "text-gray-900" : "text-gray-400"}`}>
                  {step}
                </p>
              </div>
              {!isLast && (
                <div className={`h-0.5 flex-1 mx-1 mb-5 ${i < currentIdx ? "bg-gray-900" : "bg-gray-200"}`} />
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}

function ShipmentCard({ shipment }: { shipment: Shipment }) {
  const [expanded, setExpanded] = useState(false);

  return (
    <div className="bg-white border border-gray-200">
      {/* Header row */}
      <div className="px-6 py-4 flex flex-col sm:flex-row sm:items-center gap-3 justify-between">
        <div className="space-y-0.5">
          <div className="flex items-center gap-3">
            <Link
              to={`/dashboard/orders/${shipment.orderId}`}
              className="text-sm font-medium text-gray-900 hover:underline"
            >
              {shipment.orderNumber}
            </Link>
            <span className={`px-2 py-0.5 text-xs font-medium rounded-sm ${STATUS_STYLES[shipment.status]}`}>
              {shipment.status}
            </span>
          </div>
          <p className="text-xs text-gray-500">
            {shipment.carrier} · {shipment.trackingNumber} · ETA {shipment.eta}
          </p>
        </div>
        <div className="flex items-center gap-3 flex-shrink-0">
          <a
            href={shipment.trackingUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1 text-xs text-gray-500 hover:text-gray-900 transition-colors"
          >
            Track on {shipment.carrier} <ExternalLink className="w-3 h-3" strokeWidth={1.5} />
          </a>
          <button
            onClick={() => setExpanded((e) => !e)}
            className="flex items-center gap-1 text-xs text-gray-500 hover:text-gray-900 transition-colors"
          >
            {expanded ? "Hide" : "Details"}
            {expanded
              ? <ChevronUp className="w-3.5 h-3.5" strokeWidth={1.5} />
              : <ChevronDown className="w-3.5 h-3.5" strokeWidth={1.5} />}
          </button>
        </div>
      </div>

      {/* Progress bar always visible */}
      <div className="px-6 pb-4">
        <ProgressBar status={shipment.status} />
      </div>

      {/* Expanded timeline */}
      {expanded && (
        <div className="border-t border-gray-100 px-6 py-4">
          <p className="text-xs tracking-widests text-gray-500 mb-4">TRACKING HISTORY</p>
          <ol className="relative border-l border-gray-200 space-y-4 ml-2">
            {shipment.events.map((event, i) => {
              const isLatest = i === shipment.events.length - 1;
              return (
                <li key={i} className="ml-5">
                  <span
                    className={`absolute -left-2 w-4 h-4 rounded-full flex items-center justify-center ${
                      isLatest ? "bg-gray-900" : "bg-white border border-gray-300"
                    }`}
                  >
                    <span className={`w-1.5 h-1.5 rounded-full ${isLatest ? "bg-white" : "bg-gray-400"}`} />
                  </span>
                  <p className="text-sm font-medium text-gray-900">{event.label}</p>
                  <p className="text-xs text-gray-500">{event.date}</p>
                  {event.location && (
                    <p className="text-xs text-gray-400">{event.location}</p>
                  )}
                </li>
              );
            })}
          </ol>
        </div>
      )}
    </div>
  );
}

export default function TrackingPage() {
  const [shipments, setShipments] = useState<Shipment[]>([]);
  const [loading, setLoading] = useState(true);
  const [showAll, setShowAll] = useState(false);

  useEffect(() => {
    (showAll ? trackingService.getAll() : trackingService.listActive()).then((data) => {
      setShipments(data);
      setLoading(false);
    });
  }, [showAll]);

  return (
    <div className="space-y-6 max-w-4xl">
      <div className="flex items-end justify-between">
        <div>
          <h1 className="text-2xl tracking-tight text-gray-900">Tracking</h1>
          <p className="text-sm text-gray-500 mt-1">Monitor your active shipments.</p>
        </div>
        <button
          onClick={() => { setLoading(true); setShowAll((v) => !v); }}
          className="text-xs text-gray-500 underline hover:text-gray-900 transition-colors"
        >
          {showAll ? "Show active only" : "Show all shipments"}
        </button>
      </div>

      {loading ? (
        <div className="space-y-4">
          {[...Array(2)].map((_, i) => (
            <div key={i} className="h-32 bg-white border border-gray-200 animate-pulse" />
          ))}
        </div>
      ) : shipments.length === 0 ? (
        <div className="bg-white border border-gray-200 py-20 text-center">
          <Package className="w-10 h-10 text-gray-300 mx-auto mb-4" strokeWidth={1.5} />
          <p className="text-sm text-gray-500">No active shipments at the moment.</p>
          <button
            onClick={() => { setLoading(true); setShowAll(true); }}
            className="mt-3 text-sm text-gray-900 underline"
          >
            View all past shipments
          </button>
        </div>
      ) : (
        <div className="space-y-4">
          {shipments.map((s) => (
            <ShipmentCard key={s.id} shipment={s} />
          ))}
        </div>
      )}
    </div>
  );
}
