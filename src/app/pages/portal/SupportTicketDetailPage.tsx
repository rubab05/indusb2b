import { useEffect, useRef, useState } from "react";
import { Link, useParams } from "react-router";
import { supportService } from "../../../services/support.service";
import { SupportTicket, TicketMessage, TicketStatus } from "../../../types/support";
import { ArrowLeft, Send, X } from "lucide-react";

const STATUS_STYLES: Record<TicketStatus, string> = {
  OPEN: "bg-green-100 text-green-800",
  IN_PROGRESS: "bg-blue-100 text-blue-800",
  RESOLVED: "bg-gray-100 text-gray-600",
  CLOSED: "bg-gray-100 text-gray-400",
};

const STATUS_LABELS: Record<TicketStatus, string> = {
  OPEN: "Open",
  IN_PROGRESS: "In Progress",
  RESOLVED: "Resolved",
  CLOSED: "Closed",
};

function MessageBubble({ msg }: { msg: TicketMessage }) {
  const isPartner = msg.author === "partner";
  return (
    <div className={`flex flex-col ${isPartner ? "items-end" : "items-start"}`}>
      <div className={`max-w-xl px-5 py-4 text-sm leading-relaxed ${
        isPartner
          ? "bg-gray-900 text-white"
          : "bg-gray-50 border border-gray-200 text-gray-800"
      }`}>
        {msg.body}
      </div>
      <p className="text-xs text-gray-400 mt-1.5">
        {msg.authorName} · {new Date(msg.createdAt).toLocaleString('en-GB')}
      </p>
    </div>
  );
}

export default function SupportTicketDetailPage() {
  const { ticketId } = useParams<{ ticketId: string }>();
  const [ticket, setTicket] = useState<SupportTicket | null>(null);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);
  const [reply, setReply] = useState("");
  const [sending, setSending] = useState(false);
  const [closing, setClosing] = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!ticketId) return;
    supportService.get(ticketId).then((t) => {
      if (!t) setNotFound(true);
      else setTicket(t);
      setLoading(false);
    });
  }, [ticketId]);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [ticket?.messages.length]);

  async function handleReply(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (!reply.trim() || !ticket) return;
    setSending(true);
    const msg = await supportService.reply(ticket.id, reply.trim());
    setTicket((prev) =>
      prev ? { ...prev, messages: [...prev.messages, msg], status: prev.status === "RESOLVED" || prev.status === "CLOSED" ? "OPEN" : prev.status } : prev,
    );
    setReply("");
    setSending(false);
  }

  async function handleClose() {
    if (!ticket) return;
    setClosing(true);
    await supportService.close(ticket.id);
    setTicket((prev) => prev ? { ...prev, status: "CLOSED" as const } : prev);
    setClosing(false);
  }

  if (loading) {
    return (
      <div className="max-w-3xl space-y-4">
        {[...Array(3)].map((_, i) => (
          <div key={i} className="h-20 bg-white border border-gray-200 animate-pulse" />
        ))}
      </div>
    );
  }

  if (notFound || !ticket) {
    return (
      <div className="text-center py-20">
        <p className="text-sm text-gray-500 mb-4">Ticket not found.</p>
        <Link to="/dashboard/support" className="text-sm text-gray-900 underline">Back to support</Link>
      </div>
    );
  }

  const canReply = ticket.status !== "CLOSED";
  const canClose = ticket.status !== "CLOSED";

  return (
    <div className="max-w-3xl space-y-6">
      <Link
        to="/dashboard/support"
        className="inline-flex items-center gap-2 text-sm text-gray-500 hover:text-gray-900 transition-colors"
      >
        <ArrowLeft className="w-4 h-4" strokeWidth={1.5} />
        Back to support
      </Link>

      {/* Header */}
      <div className="bg-white border border-gray-200 p-6">
        <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
          <div className="space-y-1">
            <p className="text-xs tracking-widests text-gray-500">{ticket.ticketNumber}</p>
            <h1 className="text-xl tracking-tight text-gray-900">{ticket.subject}</h1>
            <p className="text-xs text-gray-500">
              {ticket.category}
              {ticket.relatedOrderId && (
                <>
                  {" · "}
                  <Link
                    to={`/dashboard/orders/${ticket.relatedOrderId}`}
                    className="underline hover:text-gray-900 transition-colors"
                  >
                    {ticket.relatedOrderId}
                  </Link>
                </>
              )}
              {" · Created "}{new Date(ticket.createdAt).toLocaleDateString('en-GB')}
            </p>
          </div>
          <div className="flex items-center gap-3 flex-shrink-0">
            <span className={`px-2.5 py-1 text-xs font-medium rounded-sm ${STATUS_STYLES[ticket.status]}`}>
              {STATUS_LABELS[ticket.status]}
            </span>
            <span className={`text-xs ${ticket.priority === "HIGH" || ticket.priority === "URGENT" ? "text-red-600 font-medium" : "text-gray-500"}`}>
              {ticket.priority}
            </span>
          </div>
        </div>
      </div>

      {/* Message thread */}
      <div className="bg-white border border-gray-200 p-6 space-y-6 min-h-[300px]">
        <p className="text-xs tracking-widests text-gray-500">CONVERSATION</p>
        {ticket.messages.map((msg) => (
          <MessageBubble key={msg.id} msg={msg} />
        ))}
        <div ref={bottomRef} />
      </div>

      {/* Reply form */}
      {canReply ? (
        <form onSubmit={handleReply} className="bg-white border border-gray-200 p-6 space-y-4">
          <p className="text-xs tracking-widests text-gray-500">REPLY</p>
          <textarea
            rows={4}
            value={reply}
            onChange={(e) => setReply(e.target.value)}
            placeholder="Type your message..."
            className="w-full px-4 py-3 text-sm border border-gray-200 focus:outline-none focus:border-gray-400 transition-colors resize-none"
          />
          <div className="flex items-center justify-between gap-4">
            {canClose && (
              <button
                type="button"
                onClick={handleClose}
                disabled={closing}
                className="flex items-center gap-2 px-5 py-2.5 border border-gray-300 text-gray-600 hover:border-gray-500 transition-colors text-sm disabled:opacity-50"
              >
                <X className="w-4 h-4" strokeWidth={1.5} />
                {closing ? "Closing..." : "Close Ticket"}
              </button>
            )}
            <button
              type="submit"
              disabled={sending || !reply.trim()}
              className="flex items-center gap-2 px-6 py-2.5 bg-gray-900 text-white hover:bg-gray-800 transition-colors text-sm tracking-wide disabled:opacity-50 ml-auto"
            >
              <Send className="w-4 h-4" strokeWidth={1.5} />
              {sending ? "SENDING..." : "SEND REPLY"}
            </button>
          </div>
        </form>
      ) : (
        <div className="bg-gray-50 border border-gray-200 p-6 text-center">
          <p className="text-sm text-gray-500">This ticket is closed. <Link to="/dashboard/support/new" className="text-gray-900 underline">Open a new request</Link> if you need further help.</p>
        </div>
      )}
    </div>
  );
}
