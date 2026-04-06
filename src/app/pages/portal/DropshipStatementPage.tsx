import { useState } from "react";
import { dropshipService } from "../../../services/dropship.service";
import { Download, FileText } from "lucide-react";
import { toast } from "sonner";

export default function DropshipStatementPage() {
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [summary, setSummary] = useState<{
    transactionCount: number;
    totalCredits: number;
    totalDebits: number;
    netChange: number;
  } | null>(null);
  const [loading, setLoading] = useState(false);
  const [generated, setGenerated] = useState(false);

  async function handleGenerate() {
    if (!startDate || !endDate) return;
    setLoading(true);
    setGenerated(false);
    const data = await dropshipService.getStatementSummary(startDate, endDate);
    setSummary(data);
    setLoading(false);
    setGenerated(true);
    toast.success("Statement generated");
  }

  function handleDownload() {
    toast.success("Statement download started");
  }

  return (
    <div className="space-y-6 max-w-lg">
      <div>
        <h1 className="text-2xl tracking-tight text-gray-900">Balance Statement</h1>
        <p className="text-sm text-gray-500 mt-1">Generate and download a statement for a date range.</p>
      </div>

      {/* Date range */}
      <div className="bg-white border border-gray-200 p-6 space-y-4">
        <p className="text-xs tracking-widest text-gray-700">SELECT DATE RANGE</p>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-xs text-gray-500 mb-1.5">Start Date</label>
            <input
              type="date"
              value={startDate}
              onChange={(e) => { setStartDate(e.target.value); setGenerated(false); }}
              className="w-full px-3 py-2.5 text-sm border border-gray-200 focus:outline-none focus:border-gray-400 transition-colors"
            />
          </div>
          <div>
            <label className="block text-xs text-gray-500 mb-1.5">End Date</label>
            <input
              type="date"
              value={endDate}
              onChange={(e) => { setEndDate(e.target.value); setGenerated(false); }}
              className="w-full px-3 py-2.5 text-sm border border-gray-200 focus:outline-none focus:border-gray-400 transition-colors"
            />
          </div>
        </div>
        <button
          onClick={handleGenerate}
          disabled={!startDate || !endDate || loading}
          className="w-full py-3 border border-gray-900 text-gray-900 hover:bg-gray-50 transition-colors text-sm tracking-wide disabled:opacity-50"
        >
          {loading ? "GENERATING..." : "GENERATE STATEMENT"}
        </button>
      </div>

      {/* Summary preview */}
      {summary && (
        <div className="bg-white border border-gray-200 p-6 space-y-4">
          <div className="flex items-center gap-2">
            <FileText className="w-4 h-4 text-gray-500" strokeWidth={1.5} />
            <p className="text-xs tracking-widest text-gray-700">STATEMENT SUMMARY</p>
          </div>
          <p className="text-xs text-gray-500">
            {startDate} to {endDate}
          </p>

          <div className="grid grid-cols-2 gap-4">
            <div className="bg-gray-50 border border-gray-100 p-4">
              <p className="text-xs text-gray-500 mb-1">Transactions</p>
              <p className="text-xl font-light text-gray-900">{summary.transactionCount}</p>
            </div>
            <div className="bg-green-50 border border-green-100 p-4">
              <p className="text-xs text-gray-500 mb-1">Total Credits</p>
              <p className="text-xl font-light text-green-700">£{summary.totalCredits.toFixed(2)}</p>
            </div>
            <div className="bg-red-50 border border-red-100 p-4">
              <p className="text-xs text-gray-500 mb-1">Total Debits</p>
              <p className="text-xl font-light text-red-700">£{summary.totalDebits.toFixed(2)}</p>
            </div>
            <div className={`border p-4 ${summary.netChange >= 0 ? "bg-green-50 border-green-100" : "bg-red-50 border-red-100"}`}>
              <p className="text-xs text-gray-500 mb-1">Net Change</p>
              <p className={`text-xl font-light ${summary.netChange >= 0 ? "text-green-700" : "text-red-700"}`}>
                {summary.netChange >= 0 ? "+" : ""}£{summary.netChange.toFixed(2)}
              </p>
            </div>
          </div>

          {generated && (
            <button
              onClick={handleDownload}
              className="w-full py-3 bg-yellow-500 text-gray-900 hover:bg-yellow-400 transition-colors text-sm tracking-wide flex items-center justify-center gap-2"
            >
              <Download className="w-4 h-4" strokeWidth={1.5} />
              DOWNLOAD STATEMENT (PDF)
            </button>
          )}
        </div>
      )}
    </div>
  );
}
