import { useEffect, useState } from "react";
import { Link } from "react-router";
import { dropshipService } from "../../../services/dropship.service";
import { DropshipBalance, BalanceThreshold, Transaction, BalanceHistoryPoint, TopUpRequestRecord } from "../../../types/commerce";
import { Wallet, ArrowUpRight, ArrowDownRight, TrendingUp, PlusCircle, AlertTriangle, Clock } from "lucide-react";
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts";

function balanceColor(balance: number, threshold: BalanceThreshold) {
  if (balance < threshold.lockLevel) return { bg: "bg-red-50 border-red-200", text: "text-red-700", label: "LOCKED" };
  if (balance < threshold.warningLevel) return { bg: "bg-yellow-50 border-yellow-200", text: "text-yellow-700", label: "LOW" };
  return { bg: "bg-green-50 border-green-200", text: "text-green-700", label: "HEALTHY" };
}

function typeBadge(type: Transaction["type"]) {
  const map: Record<string, string> = {
    "top-up": "bg-green-100 text-green-700",
    order: "bg-gray-100 text-gray-700",
    refund: "bg-blue-100 text-blue-700",
    adjustment: "bg-purple-100 text-purple-700",
  };
  return map[type] ?? "bg-gray-100 text-gray-600";
}

export default function DropshipDashboardPage() {
  const [balance, setBalance] = useState<DropshipBalance | null>(null);
  const [threshold, setThreshold] = useState<BalanceThreshold | null>(null);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [history, setHistory] = useState<BalanceHistoryPoint[]>([]);
  const [topUpRequests, setTopUpRequests] = useState<TopUpRequestRecord[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      dropshipService.getBalance(),
      dropshipService.getBalanceThreshold(),
      dropshipService.getRecentTransactions(10),
      dropshipService.getBalanceHistory(30),
      dropshipService.getTopUpRequests(),
    ]).then(([b, t, tx, h, reqs]) => {
      setBalance(b);
      setThreshold(t);
      setTransactions(tx);
      setHistory(h);
      setTopUpRequests(reqs);
      setLoading(false);
    });
  }, []);

  const pendingTopUps = topUpRequests.filter((r) => r.status === "pending");

  if (loading || !balance || !threshold) {
    return (
      <div className="space-y-6 max-w-4xl">
        <div className="h-8 w-48 bg-gray-100 animate-pulse rounded" />
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {[1, 2, 3].map((i) => <div key={i} className="h-32 bg-gray-100 animate-pulse rounded" />)}
        </div>
      </div>
    );
  }

  const colors = balanceColor(balance.currentBalance, threshold);

  return (
    <div className="space-y-6 max-w-4xl">
      <div>
        <h1 className="text-2xl tracking-tight text-gray-900">Dropship Dashboard</h1>
        <p className="text-sm text-gray-500 mt-1">Manage your balance, view transactions, and top up funds.</p>
      </div>

      {/* Balance + lock/warning banners */}
      {balance.isLocked && (
        <div className="bg-red-50 border border-red-200 p-4 flex items-start gap-3">
          <AlertTriangle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" strokeWidth={1.5} />
          <div>
            <p className="text-sm font-medium text-red-800">Orders are blocked</p>
            <p className="text-sm text-red-600 mt-0.5">Your balance is below the minimum threshold. Orders are blocked until you top up.</p>
          </div>
          <Link to="/dashboard/dropship/topup" className="ml-auto px-4 py-2 bg-red-600 text-white text-xs tracking-wide hover:bg-red-700 transition-colors flex-shrink-0">
            TOP UP NOW
          </Link>
        </div>
      )}
      {!balance.isLocked && balance.currentBalance < threshold.warningLevel && (
        <div className="bg-yellow-50 border border-yellow-200 p-4 flex items-start gap-3">
          <AlertTriangle className="w-5 h-5 text-yellow-600 flex-shrink-0 mt-0.5" strokeWidth={1.5} />
          <div>
            <p className="text-sm font-medium text-yellow-800">Low balance warning</p>
            <p className="text-sm text-yellow-600 mt-0.5">Your balance is running low. Top up to avoid service interruption.</p>
          </div>
          <Link to="/dashboard/dropship/topup" className="ml-auto px-4 py-2 bg-yellow-500 text-gray-900 text-xs tracking-wide hover:bg-yellow-400 transition-colors flex-shrink-0">
            TOP UP NOW
          </Link>
        </div>
      )}

      {/* Balance card + quick actions */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className={`border p-6 ${colors.bg}`}>
          <div className="flex items-center justify-between mb-2">
            <Wallet className={`w-5 h-5 ${colors.text}`} strokeWidth={1.5} />
            <span className={`text-xs font-medium px-2 py-0.5 rounded-sm ${colors.text} ${colors.bg}`}>{colors.label}</span>
          </div>
          <p className="text-xs text-gray-500 mb-1">CURRENT BALANCE</p>
          <p className={`text-3xl font-light ${colors.text}`}>£{balance.currentBalance.toFixed(2)}</p>
          <p className="text-xs text-gray-400 mt-2">Last updated: {balance.lastUpdated}</p>
        </div>

        <Link to="/dashboard/dropship/topup" className="border border-gray-200 bg-white p-6 hover:border-gray-400 transition-colors group">
          <PlusCircle className="w-5 h-5 text-gray-400 group-hover:text-gray-900 mb-3 transition-colors" strokeWidth={1.5} />
          <p className="text-sm font-medium text-gray-900">Top Up Funds</p>
          <p className="text-xs text-gray-500 mt-1">Add funds via bank transfer</p>
        </Link>

        <Link to="/dashboard/dropship/ledger" className="border border-gray-200 bg-white p-6 hover:border-gray-400 transition-colors group">
          <TrendingUp className="w-5 h-5 text-gray-400 group-hover:text-gray-900 mb-3 transition-colors" strokeWidth={1.5} />
          <p className="text-sm font-medium text-gray-900">Full Ledger</p>
          <p className="text-xs text-gray-500 mt-1">View all transactions</p>
        </Link>
      </div>

      {/* Balance trend chart */}
      {history.length > 0 && (
        <div className="bg-white border border-gray-200 p-6">
          <p className="text-xs tracking-widest text-gray-500 mb-4">BALANCE TREND (30 DAYS)</p>
          <div className="h-48">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={history}>
                <XAxis
                  dataKey="date"
                  tick={{ fontSize: 10 }}
                  tickFormatter={(v: string) => v.slice(5)}
                  interval="preserveStartEnd"
                />
                <YAxis
                  tick={{ fontSize: 10 }}
                  tickFormatter={(v: number) => `£${v}`}
                  width={60}
                />
                <Tooltip
                  formatter={(value: number) => [`£${value.toFixed(2)}`, "Balance"]}
                  labelFormatter={(label: string) => label}
                />
                <Line type="monotone" dataKey="balance" stroke="#eab308" strokeWidth={2} dot={false} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
      )}

      {/* Pending top-up requests */}
      {pendingTopUps.length > 0 && (
        <div className="bg-white border border-yellow-200 overflow-hidden">
          <div className="px-6 py-4 border-b border-yellow-100 bg-yellow-50 flex items-center gap-2">
            <Clock className="w-4 h-4 text-yellow-600" strokeWidth={1.5} />
            <p className="text-xs tracking-widest text-yellow-700">PENDING TOP-UP REQUESTS</p>
          </div>
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-100">
                {["Date", "Reference", "Amount", "Method", "Status"].map((h) => (
                  <th key={h} className="px-4 py-3 text-left text-xs tracking-widest text-gray-500 font-normal">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {pendingTopUps.map((req) => (
                <tr key={req.id}>
                  <td className="px-4 py-3 text-gray-600 text-xs">
                    {new Date(req.createdAt).toLocaleDateString("en-GB")}
                  </td>
                  <td className="px-4 py-3 text-gray-600 font-mono text-xs">{req.referenceNumber ?? "—"}</td>
                  <td className="px-4 py-3 font-medium text-green-600">+£{req.amount.toFixed(2)}</td>
                  <td className="px-4 py-3 text-gray-600 text-xs capitalize">{req.method.replace("-", " ")}</td>
                  <td className="px-4 py-3">
                    <span className="text-xs px-2 py-0.5 font-medium bg-yellow-100 text-yellow-700">PENDING</span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          <div className="px-6 py-3 border-t border-yellow-100 bg-yellow-50">
            <p className="text-xs text-yellow-700">
              Pending requests are awaiting admin verification. Balance will be updated once confirmed.
            </p>
          </div>
        </div>
      )}

      {/* Recent transactions */}
      <div className="bg-white border border-gray-200 overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-100 bg-gray-50 flex items-center justify-between">
          <p className="text-xs tracking-widest text-gray-500">RECENT TRANSACTIONS</p>
          <Link to="/dashboard/dropship/ledger" className="text-xs text-gray-500 underline hover:text-gray-900 transition-colors">
            View all
          </Link>
        </div>
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-gray-100">
              {["Date", "Type", "Reference", "Amount", "Balance"].map((h) => (
                <th key={h} className="px-4 py-3 text-left text-xs tracking-widest text-gray-500 font-normal">{h}</th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-50">
            {transactions.map((tx) => (
              <tr key={tx.id} className="hover:bg-gray-50">
                <td className="px-4 py-3 text-gray-600 text-xs">{tx.date}</td>
                <td className="px-4 py-3">
                  <span className={`text-xs px-2 py-0.5 font-medium ${typeBadge(tx.type)}`}>
                    {tx.type}
                  </span>
                </td>
                <td className="px-4 py-3 text-gray-600 font-mono text-xs">{tx.reference}</td>
                <td className="px-4 py-3 font-medium">
                  <span className={`flex items-center gap-1 ${tx.amount > 0 ? "text-green-600" : "text-red-600"}`}>
                    {tx.amount > 0 ? <ArrowUpRight className="w-3 h-3" /> : <ArrowDownRight className="w-3 h-3" />}
                    £{Math.abs(tx.amount).toFixed(2)}
                  </span>
                </td>
                <td className="px-4 py-3 text-gray-700">£{tx.runningBalance.toFixed(2)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
