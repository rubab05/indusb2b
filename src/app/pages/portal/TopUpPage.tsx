import { useEffect, useState } from "react";
import { useNavigate } from "react-router";
import { dropshipService } from "../../../services/dropship.service";
import { DropshipBalance, BalanceThreshold } from "../../../types/commerce";
import { Wallet, Landmark, CreditCard } from "lucide-react";
import { brandConfig } from "../../../config/brand.config";

const PRESET_AMOUNTS = [100, 250, 500, 1000];

export default function TopUpPage() {
  const navigate = useNavigate();
  const [balance, setBalance] = useState<DropshipBalance | null>(null);
  const [threshold, setThreshold] = useState<BalanceThreshold | null>(null);
  const [selectedAmount, setSelectedAmount] = useState<number | null>(null);
  const [customAmount, setCustomAmount] = useState("");
  const [method, setMethod] = useState<"bank" | "card">("bank");
  const [showConfirm, setShowConfirm] = useState(false);

  useEffect(() => {
    Promise.all([
      dropshipService.getBalance(),
      dropshipService.getBalanceThreshold(),
    ]).then(([b, t]) => {
      setBalance(b);
      setThreshold(t);
    });
  }, []);

  const amount = selectedAmount ?? (customAmount ? parseFloat(customAmount) : 0);
  const isValid = amount > 0 && !isNaN(amount);

  function handlePreset(val: number) {
    setSelectedAmount(val);
    setCustomAmount("");
  }

  function handleCustom(val: string) {
    setCustomAmount(val);
    setSelectedAmount(null);
  }

  function handleSubmit() {
    if (!isValid) return;
    if (method === "bank") {
      setShowConfirm(true);
    }
  }

  function handleConfirm() {
    navigate(`/dashboard/dropship/topup/bank-confirm?amount=${amount}`);
  }

  const balanceColor = !balance || !threshold
    ? "text-gray-700"
    : balance.currentBalance < threshold.lockLevel
      ? "text-red-600"
      : balance.currentBalance < threshold.warningLevel
        ? "text-yellow-600"
        : "text-green-600";

  return (
    <div className="space-y-6 max-w-xl">
      <div>
        <h1 className="text-2xl tracking-tight text-gray-900">Top Up Funds</h1>
        <p className="text-sm text-gray-500 mt-1">Add funds to your dropship balance.</p>
      </div>

      {/* Current balance */}
      {balance && (
        <div className="bg-white border border-gray-200 p-6 flex items-center gap-4">
          <Wallet className={`w-6 h-6 ${balanceColor}`} strokeWidth={1.5} />
          <div>
            <p className="text-xs text-gray-500">CURRENT BALANCE</p>
            <p className={`text-2xl font-light ${balanceColor}`}>£{balance.currentBalance.toFixed(2)}</p>
          </div>
        </div>
      )}

      {/* Amount selection */}
      <div className="bg-white border border-gray-200 p-6 space-y-4">
        <p className="text-xs tracking-widest text-gray-700">SELECT AMOUNT</p>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {PRESET_AMOUNTS.map((val) => (
            <button
              key={val}
              onClick={() => handlePreset(val)}
              className={`py-3 text-sm border transition-colors ${
                selectedAmount === val
                  ? "border-yellow-500 bg-yellow-50 text-gray-900 font-medium"
                  : "border-gray-200 text-gray-700 hover:border-gray-400"
              }`}
            >
              £{val}
            </button>
          ))}
        </div>
        <div>
          <label className="block text-xs text-gray-500 mb-1.5">Or enter custom amount</label>
          <div className="relative">
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-sm text-gray-400">£</span>
            <input
              type="number"
              min={1}
              step="0.01"
              value={customAmount}
              onChange={(e) => handleCustom(e.target.value)}
              placeholder="0.00"
              className="w-full pl-7 pr-4 py-2.5 text-sm border border-gray-200 focus:outline-none focus:border-gray-400 transition-colors"
            />
          </div>
        </div>
      </div>

      {/* Payment method */}
      <div className="bg-white border border-gray-200 p-6 space-y-4">
        <p className="text-xs tracking-widest text-gray-700">PAYMENT METHOD</p>
        <div className="flex gap-3">
          <button
            onClick={() => setMethod("bank")}
            className={`flex-1 py-4 px-4 border text-left transition-colors ${
              method === "bank"
                ? "border-yellow-500 bg-yellow-50"
                : "border-gray-200 hover:border-gray-400"
            }`}
          >
            <Landmark className="w-5 h-5 text-gray-600 mb-2" strokeWidth={1.5} />
            <p className="text-sm font-medium text-gray-900">Bank Transfer</p>
            <p className="text-xs text-gray-500 mt-0.5">Manual transfer via bank</p>
          </button>
          <button
            onClick={() => setMethod("card")}
            className={`flex-1 py-4 px-4 border text-left transition-colors ${
              method === "card"
                ? "border-yellow-500 bg-yellow-50"
                : "border-gray-200 hover:border-gray-400"
            }`}
          >
            <CreditCard className="w-5 h-5 text-gray-600 mb-2" strokeWidth={1.5} />
            <p className="text-sm font-medium text-gray-900">Card Payment</p>
            <p className="text-xs text-gray-500 mt-0.5">Instant top-up</p>
          </button>
        </div>

        {method === "bank" && (
          <div className="bg-gray-50 border border-gray-200 p-4 space-y-2">
            <p className="text-xs tracking-widest text-gray-500 mb-2">BANK DETAILS</p>
            <div className="grid grid-cols-2 gap-x-4 gap-y-1 text-sm">
              <span className="text-gray-500">Sort Code</span>
              <span className="text-gray-900 font-mono">12-34-56</span>
              <span className="text-gray-500">Account Number</span>
              <span className="text-gray-900 font-mono">12345678</span>
              <span className="text-gray-500">Account Name</span>
              <span className="text-gray-900">{brandConfig.brandName} Ltd</span>
              <span className="text-gray-500">Reference</span>
              <span className="text-gray-900 font-mono text-xs">{brandConfig.brandName}-DS-{Date.now()}</span>
            </div>
          </div>
        )}

        {method === "card" && (
          <div className="bg-gray-50 border border-dashed border-gray-300 p-6 text-center">
            <p className="text-sm text-gray-500">Card payments coming soon.</p>
            <p className="text-xs text-gray-400 mt-1">Please use bank transfer for now.</p>
          </div>
        )}
      </div>

      {/* Submit */}
      <button
        onClick={handleSubmit}
        disabled={!isValid || method === "card"}
        className="w-full py-4 bg-yellow-500 text-gray-900 hover:bg-yellow-400 transition-colors text-sm tracking-wide disabled:opacity-50"
      >
        {isValid ? `TOP UP £${amount.toFixed(2)}` : "SELECT AN AMOUNT"}
      </button>

      {/* Confirmation dialog */}
      {showConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div className="fixed inset-0 bg-black/40" onClick={() => setShowConfirm(false)} />
          <div className="relative bg-white border border-gray-200 p-8 max-w-sm w-full mx-4 shadow-xl z-10">
            <h2 className="text-lg font-medium text-gray-900 mb-2">Confirm Top-Up</h2>
            <p className="text-sm text-gray-600 mb-6">
              You are about to top up <span className="font-medium">£{amount.toFixed(2)}</span> via bank transfer.
              Please ensure you use the correct reference when making the transfer.
            </p>
            <div className="flex gap-3">
              <button
                onClick={() => setShowConfirm(false)}
                className="flex-1 py-3 border border-gray-200 text-sm text-gray-700 hover:border-gray-400 transition-colors"
              >
                CANCEL
              </button>
              <button
                onClick={handleConfirm}
                className="flex-1 py-3 bg-yellow-500 text-gray-900 hover:bg-yellow-400 transition-colors text-sm tracking-wide"
              >
                CONFIRM
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
