import { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router";
import { CheckCircle2, Loader2 } from "lucide-react";
import { dropshipService } from "../../../services/dropship.service";
import { ApiError } from "../../../lib/api-client";

export default function BankTransferConfirmPage() {
  const [params] = useSearchParams();
  const navigate = useNavigate();
  const amount = parseFloat(params.get("amount") ?? "0");

  const [reference, setReference] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const date = new Date().toLocaleDateString("en-GB", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });

  useEffect(() => {
    if (!amount || isNaN(amount) || amount <= 0) {
      navigate("/dashboard/dropship/topup");
      return;
    }
    dropshipService
      .submitTopUp({ amount, method: "bank-transfer" })
      .then((result) => setReference(result.referenceNumber))
      .catch((err) => {
        if (err instanceof ApiError) {
          setError(err.message);
        } else {
          setError("Failed to create top-up request. Please try again.");
        }
      })
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-24 gap-4">
        <Loader2 className="w-8 h-8 text-gray-400 animate-spin" strokeWidth={1.5} />
        <p className="text-sm text-gray-500">Creating top-up request…</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-lg mx-auto py-16 text-center space-y-4">
        <p className="text-sm text-red-600">{error}</p>
        <button
          onClick={() => navigate("/dashboard/dropship/topup")}
          className="px-6 py-2.5 border border-gray-200 text-sm text-gray-700 hover:border-gray-400 transition-colors"
        >
          Back to Top-Up
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-6 max-w-lg mx-auto py-8">
      <div className="text-center">
        <CheckCircle2 className="w-14 h-14 text-green-500 mx-auto mb-4" strokeWidth={1.5} />
        <h1 className="text-2xl tracking-tight text-gray-900">Top-Up Request Created</h1>
        <p className="text-sm text-gray-500 mt-2">
          Please complete the bank transfer using the details below.
        </p>
      </div>

      {/* Request summary */}
      <div className="bg-gray-50 border border-gray-200 p-6 space-y-3">
        <p className="text-xs tracking-widest text-gray-500">REQUEST DETAILS</p>
        <div className="grid grid-cols-2 gap-x-4 gap-y-2 text-sm">
          <span className="text-gray-500">Reference</span>
          <span className="text-gray-900 font-mono">{reference}</span>
          <span className="text-gray-500">Amount</span>
          <span className="text-gray-900 font-medium">£{amount.toFixed(2)}</span>
          <span className="text-gray-500">Date</span>
          <span className="text-gray-900">{date}</span>
        </div>
      </div>

      {/* Bank details */}
      <div className="bg-yellow-50 border border-yellow-200 p-6 space-y-3">
        <p className="text-xs tracking-widests text-yellow-700">TRANSFER TO THESE BANK DETAILS</p>
        <div className="grid grid-cols-2 gap-x-4 gap-y-2 text-sm">
          <span className="text-gray-600">Sort Code</span>
          <span className="text-gray-900 font-mono font-medium">12-34-56</span>
          <span className="text-gray-600">Account Number</span>
          <span className="text-gray-900 font-mono font-medium">12345678</span>
          <span className="text-gray-600">Account Name</span>
          <span className="text-gray-900 font-medium">HOMATZ Ltd</span>
          <span className="text-gray-600">Payment Reference</span>
          <span className="text-gray-900 font-mono font-medium">{reference}</span>
        </div>
        <p className="text-xs text-yellow-700 mt-2">
          Important: Use the reference above in your bank transfer so we can match your payment.
        </p>
      </div>

      {/* What happens next */}
      <div className="bg-white border border-gray-200 p-6">
        <p className="text-xs tracking-widest text-gray-700 mb-3">WHAT HAPPENS NEXT</p>
        <ol className="space-y-2 text-sm text-gray-600">
          <li className="flex gap-3">
            <span className="w-5 h-5 bg-gray-100 text-gray-600 text-xs flex items-center justify-center flex-shrink-0 font-medium">1</span>
            Make the bank transfer using the details above
          </li>
          <li className="flex gap-3">
            <span className="w-5 h-5 bg-gray-100 text-gray-600 text-xs flex items-center justify-center flex-shrink-0 font-medium">2</span>
            We verify your payment against the reference
          </li>
          <li className="flex gap-3">
            <span className="w-5 h-5 bg-gray-100 text-gray-600 text-xs flex items-center justify-center flex-shrink-0 font-medium">3</span>
            Balance updated within 24 hours
          </li>
        </ol>
      </div>

      <button
        onClick={() => navigate("/dashboard/dropship")}
        className="w-full py-4 bg-yellow-500 text-gray-900 hover:bg-yellow-400 transition-colors text-sm tracking-wide"
      >
        BACK TO DROPSHIP DASHBOARD
      </button>
    </div>
  );
}
