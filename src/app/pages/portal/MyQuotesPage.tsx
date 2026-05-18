import { useEffect, useState } from "react";
import { Link } from "react-router";
import { QuoteRequest } from "../../../types/commerce";
import { orderingService } from "../../../services/ordering.service";
import { MessageSquarePlus, Clock, CheckCircle2, ChevronDown, ChevronUp } from "lucide-react";

function StatusBadge({ status }: { status: string }) {
  if (status === "responded") {
    return (
      <span className="inline-flex items-center gap-1 px-2 py-0.5 text-xs font-medium bg-green-50 text-green-700 border border-green-200">
        <CheckCircle2 className="w-3 h-3" strokeWidth={2} />
        Responded
      </span>
    );
  }
  return (
    <span className="inline-flex items-center gap-1 px-2 py-0.5 text-xs font-medium bg-yellow-50 text-yellow-700 border border-yellow-200">
      <Clock className="w-3 h-3" strokeWidth={2} />
      Awaiting Response
    </span>
  );
}

function QuoteRow({ quote }: { quote: QuoteRequest }) {
  const [expanded, setExpanded] = useState(quote.status === "responded" && !quote.adminResponse ? false : quote.status === "responded");

  return (
    <div className="border border-gray-200 bg-white">
      {/* Header row */}
      <div
        className="flex items-center gap-4 px-5 py-4 cursor-pointer hover:bg-gray-50 transition-colors"
        onClick={() => setExpanded(!expanded)}
      >
        <div className="flex-1 min-w-0 grid grid-cols-[1fr_1fr_auto] gap-4 items-center">
          <div>
            <p className="text-sm font-medium text-gray-900 font-mono">{quote.referenceNumber}</p>
            <p className="text-xs text-gray-500 mt-0.5">
              {new Date(quote.createdAt).toLocaleDateString("en-GB", { day: "2-digit", month: "short", year: "numeric" })}
            </p>
          </div>
          <div>
            <p className="text-xs text-gray-500">{quote.lines.length} product{quote.lines.length !== 1 ? "s" : ""}</p>
          </div>
          <StatusBadge status={quote.status} />
        </div>
        {expanded ? (
          <ChevronUp className="w-4 h-4 text-gray-400 flex-shrink-0" strokeWidth={1.5} />
        ) : (
          <ChevronDown className="w-4 h-4 text-gray-400 flex-shrink-0" strokeWidth={1.5} />
        )}
      </div>

      {expanded && (
        <div className="border-t border-gray-100 px-5 py-4 space-y-4 bg-gray-50">
          {/* Products requested */}
          <div>
            <p className="text-xs tracking-widests text-gray-500 mb-2">PRODUCTS REQUESTED</p>
            <div className="space-y-1.5">
              {quote.lines.map((line, i) => (
                <div key={i} className="flex gap-4 text-sm">
                  <span className="text-gray-900 flex-1">{line.productName ?? line.sku}</span>
                  <span className="text-gray-500 font-mono text-xs">{line.sku}</span>
                  <span className="text-gray-500 text-xs">qty {line.quantity ?? line.qty ?? "—"}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Special requirements */}
          {quote.specialRequirements && (
            <div>
              <p className="text-xs tracking-widests text-gray-500 mb-1">YOUR REQUIREMENTS</p>
              <p className="text-sm text-gray-700 italic">"{quote.specialRequirements}"</p>
            </div>
          )}

          {/* Admin response */}
          {quote.status === "responded" && quote.adminResponse ? (
            <div className="bg-white border border-green-200 p-4">
              <p className="text-xs tracking-widests text-green-700 mb-2">
                RESPONSE FROM TRADE TEAM
                {quote.respondedAt
                  ? ` · ${new Date(quote.respondedAt).toLocaleDateString("en-GB", { day: "2-digit", month: "short", year: "numeric" })}`
                  : ""}
              </p>
              <p className="text-sm text-gray-800 whitespace-pre-wrap leading-relaxed">{quote.adminResponse}</p>
              <div className="mt-4 pt-4 border-t border-green-100">
                <Link
                  to="/dashboard/orders/new"
                  className="inline-block px-5 py-2.5 bg-yellow-500 text-gray-900 text-xs tracking-wide hover:bg-yellow-400 transition-colors"
                >
                  PLACE AN ORDER
                </Link>
              </div>
            </div>
          ) : (
            <div className="bg-white border border-gray-200 px-4 py-3 text-sm text-gray-500">
              Your request is being reviewed. We typically respond within 1–2 working days.
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export default function MyQuotesPage() {
  const [quotes, setQuotes] = useState<QuoteRequest[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    orderingService.getMyQuotes().then(setQuotes).finally(() => setLoading(false));
  }, []);

  return (
    <div className="space-y-6 max-w-3xl">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl tracking-tight text-gray-900">My Quotes</h1>
          <p className="text-sm text-gray-500 mt-1">Track your quote requests and view responses from our trade team.</p>
        </div>
        <Link
          to="/dashboard/quote-request"
          className="px-4 py-2.5 bg-yellow-500 text-gray-900 text-xs tracking-wide hover:bg-yellow-400 transition-colors flex items-center gap-2"
        >
          <MessageSquarePlus className="w-3.5 h-3.5" strokeWidth={1.5} />
          NEW QUOTE REQUEST
        </Link>
      </div>

      {loading && (
        <div className="py-16 text-center text-sm text-gray-400">Loading your quotes...</div>
      )}

      {!loading && quotes.length === 0 && (
        <div className="py-16 text-center border border-dashed border-gray-200">
          <MessageSquarePlus className="w-8 h-8 text-gray-300 mx-auto mb-3" strokeWidth={1.5} />
          <p className="text-sm text-gray-500 mb-4">You haven't submitted any quote requests yet.</p>
          <Link
            to="/dashboard/quote-request"
            className="px-6 py-3 bg-yellow-500 text-gray-900 text-sm tracking-wide hover:bg-yellow-400 transition-colors inline-block"
          >
            REQUEST A QUOTE
          </Link>
        </div>
      )}

      {!loading && quotes.length > 0 && (
        <div className="space-y-2">
          {/* Column headers */}
          <div className="grid grid-cols-[1fr_1fr_auto_1.5rem] gap-4 px-5 py-2">
            <span className="text-xs tracking-widests text-gray-400">REFERENCE</span>
            <span className="text-xs tracking-widests text-gray-400">ITEMS</span>
            <span className="text-xs tracking-widests text-gray-400">STATUS</span>
            <span />
          </div>
          {quotes.map((q) => (
            <QuoteRow key={q.id} quote={q} />
          ))}
        </div>
      )}
    </div>
  );
}
