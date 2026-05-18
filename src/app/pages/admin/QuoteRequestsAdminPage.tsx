import { useEffect, useState } from "react";
import { AdminQuoteRequest } from "../../../types/commerce";
import { quotesAdminService } from "../../../services/quotes-admin.service";
import { MessageSquare, Clock, CheckCircle2, X, Send, ChevronDown, ChevronUp } from "lucide-react";

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
      Pending
    </span>
  );
}

function RespondModal({
  quote,
  onClose,
  onSent,
}: {
  quote: AdminQuoteRequest;
  onClose: () => void;
  onSent: (updated: AdminQuoteRequest) => void;
}) {
  const [response, setResponse] = useState(quote.adminResponse ?? "");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!response.trim()) { setError("Response cannot be empty."); return; }
    setSubmitting(true);
    try {
      const updated = await quotesAdminService.respondToQuote(quote.id, response.trim());
      onSent(updated);
    } catch {
      setError("Failed to send response. Please try again.");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/40" onClick={onClose} />
      <div className="relative bg-white w-full max-w-lg shadow-xl">
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200">
          <div>
            <h2 className="text-base font-medium text-gray-900">Respond to Quote</h2>
            <p className="text-xs text-gray-500 mt-0.5">{quote.referenceNumber} · {quote.partner?.companyName ?? quote.partner?.email}</p>
          </div>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-700 transition-colors">
            <X className="w-5 h-5" strokeWidth={1.5} />
          </button>
        </div>

        {/* Quote lines summary */}
        <div className="px-6 py-4 bg-gray-50 border-b border-gray-200 space-y-2">
          <p className="text-xs tracking-widest text-gray-500">REQUESTED PRODUCTS</p>
          <div className="space-y-1">
            {quote.lines.map((line, i) => (
              <div key={i} className="flex justify-between text-sm">
                <span className="text-gray-700">{line.productName ?? line.sku}</span>
                <span className="text-gray-500 font-mono text-xs">
                  {line.sku} · qty {line.quantity ?? line.qty ?? "—"}
                </span>
              </div>
            ))}
          </div>
          {quote.specialRequirements && (
            <p className="text-xs text-gray-500 italic mt-2">"{quote.specialRequirements}"</p>
          )}
        </div>

        <form onSubmit={handleSubmit} className="px-6 py-4 space-y-4">
          <div>
            <label className="block text-xs tracking-widests text-gray-700 mb-2">YOUR RESPONSE</label>
            <textarea
              rows={6}
              value={response}
              onChange={(e) => { setResponse(e.target.value); setError(""); }}
              placeholder="Include pricing, lead times, availability, or any other information the partner needs..."
              className="w-full px-4 py-3 text-sm border border-gray-200 focus:outline-none focus:border-gray-400 resize-none transition-colors"
            />
            {error && <p className="text-xs text-red-500 mt-1">{error}</p>}
          </div>

          <div className="flex gap-3 justify-end">
            <button
              type="button"
              onClick={onClose}
              className="px-5 py-2.5 text-sm border border-gray-200 text-gray-700 hover:bg-gray-50 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={submitting}
              className="px-5 py-2.5 text-sm bg-gray-900 text-white hover:bg-gray-800 transition-colors flex items-center gap-2 disabled:opacity-50"
            >
              <Send className="w-3.5 h-3.5" strokeWidth={1.5} />
              {submitting ? "Sending..." : "Send Response"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

function QuoteRow({ quote, onRespond }: { quote: AdminQuoteRequest; onRespond: () => void }) {
  const [expanded, setExpanded] = useState(false);

  return (
    <div className="border border-gray-200 bg-white">
      <div
        className="flex items-center gap-4 px-5 py-4 cursor-pointer hover:bg-gray-50 transition-colors"
        onClick={() => setExpanded(!expanded)}
      >
        <div className="flex-1 min-w-0 grid grid-cols-[1fr_1fr_1fr_auto] gap-4 items-center">
          <div>
            <p className="text-sm font-medium text-gray-900 font-mono">{quote.referenceNumber}</p>
            <p className="text-xs text-gray-500 mt-0.5">
              {new Date(quote.createdAt).toLocaleDateString("en-GB", { day: "2-digit", month: "short", year: "numeric" })}
            </p>
          </div>
          <div>
            <p className="text-sm text-gray-900 truncate">{quote.partner?.companyName ?? "—"}</p>
            <p className="text-xs text-gray-500 truncate">{quote.partner?.email}</p>
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
          {/* Lines */}
          <div>
            <p className="text-xs tracking-widests text-gray-500 mb-2">REQUESTED PRODUCTS</p>
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
              <p className="text-xs tracking-widests text-gray-500 mb-1">SPECIAL REQUIREMENTS</p>
              <p className="text-sm text-gray-700 italic">"{quote.specialRequirements}"</p>
            </div>
          )}

          {/* Existing response */}
          {quote.adminResponse && (
            <div className="bg-white border border-green-200 p-4">
              <p className="text-xs tracking-widests text-green-700 mb-1">
                RESPONSE SENT{quote.respondedBy ? ` BY ${quote.respondedBy.toUpperCase()}` : ""}
                {quote.respondedAt ? ` · ${new Date(quote.respondedAt).toLocaleDateString("en-GB")}` : ""}
              </p>
              <p className="text-sm text-gray-700 whitespace-pre-wrap">{quote.adminResponse}</p>
            </div>
          )}

          <div className="flex justify-end">
            <button
              onClick={(e) => { e.stopPropagation(); onRespond(); }}
              className="px-4 py-2 text-sm bg-gray-900 text-white hover:bg-gray-800 transition-colors flex items-center gap-2"
            >
              <MessageSquare className="w-3.5 h-3.5" strokeWidth={1.5} />
              {quote.status === "responded" ? "Update Response" : "Send Response"}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default function QuoteRequestsAdminPage() {
  const [quotes, setQuotes] = useState<AdminQuoteRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<"all" | "pending" | "responded">("all");
  const [respondingTo, setRespondingTo] = useState<AdminQuoteRequest | null>(null);

  useEffect(() => {
    quotesAdminService.getAllQuotes().then(setQuotes).finally(() => setLoading(false));
  }, []);

  function handleSent(updated: AdminQuoteRequest) {
    setQuotes((prev) => prev.map((q) => (q.id === updated.id ? updated : q)));
    setRespondingTo(null);
  }

  const visible = quotes.filter((q) => filter === "all" || q.status === filter);
  const pendingCount = quotes.filter((q) => q.status === "pending").length;

  return (
    <div className="space-y-6">
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-2xl tracking-tight text-gray-900">Quote Requests</h1>
          <p className="text-sm text-gray-500 mt-1">
            {pendingCount > 0 ? (
              <span className="text-yellow-700 font-medium">{pendingCount} awaiting response</span>
            ) : (
              "All quotes have been responded to"
            )}
          </p>
        </div>

        {/* Filter tabs */}
        <div className="flex border border-gray-200 bg-white">
          {(["all", "pending", "responded"] as const).map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={[
                "px-4 py-2 text-xs tracking-wide transition-colors capitalize",
                filter === f
                  ? "bg-gray-900 text-white"
                  : "text-gray-600 hover:bg-gray-50",
              ].join(" ")}
            >
              {f === "all" ? `All (${quotes.length})` : f === "pending" ? `Pending (${quotes.filter((q) => q.status === "pending").length})` : `Responded (${quotes.filter((q) => q.status === "responded").length})`}
            </button>
          ))}
        </div>
      </div>

      {loading && (
        <div className="py-16 text-center text-sm text-gray-400">Loading quote requests...</div>
      )}

      {!loading && visible.length === 0 && (
        <div className="py-16 text-center border border-dashed border-gray-200">
          <MessageSquare className="w-8 h-8 text-gray-300 mx-auto mb-3" strokeWidth={1.5} />
          <p className="text-sm text-gray-400">No quote requests{filter !== "all" ? ` with status "${filter}"` : ""}</p>
        </div>
      )}

      {!loading && visible.length > 0 && (
        <div className="space-y-2">
          {/* Column headers */}
          <div className="grid grid-cols-[1fr_1fr_1fr_auto_1.5rem] gap-4 px-5 py-2">
            <span className="text-xs tracking-widests text-gray-400">REFERENCE</span>
            <span className="text-xs tracking-widests text-gray-400">PARTNER</span>
            <span className="text-xs tracking-widests text-gray-400">ITEMS</span>
            <span className="text-xs tracking-widests text-gray-400">STATUS</span>
            <span />
          </div>
          {visible.map((q) => (
            <QuoteRow key={q.id} quote={q} onRespond={() => setRespondingTo(q)} />
          ))}
        </div>
      )}

      {respondingTo && (
        <RespondModal
          quote={respondingTo}
          onClose={() => setRespondingTo(null)}
          onSent={handleSent}
        />
      )}
    </div>
  );
}
