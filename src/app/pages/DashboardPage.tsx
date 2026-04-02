import { useEffect, useState } from "react";
import { Link } from "react-router";
import { useAuth } from "../../contexts/AuthContext";
import { dashboardService, DashboardData, OrderStatus } from "../../services/dashboard.service";
import { ShoppingCart, FileText, LifeBuoy, ChevronRight } from "lucide-react";

const STATUS_STYLES: Record<OrderStatus, string> = {
  Pending: "bg-yellow-100 text-yellow-800",
  Processing: "bg-blue-100 text-blue-800",
  Shipped: "bg-purple-100 text-purple-800",
  Delivered: "bg-green-100 text-green-800",
  Cancelled: "bg-gray-100 text-gray-600",
};

export default function DashboardPage() {
  const { user } = useAuth();
  const [data, setData] = useState<DashboardData | null>(null);

  useEffect(() => {
    if (user) {
      dashboardService.getData(user.accountType).then(setData);
    }
  }, [user]);

  return (
    <div className="space-y-8 max-w-6xl">
      {/* Header */}
      <div>
        <h1 className="text-2xl tracking-tight text-gray-900">
          Welcome back, {user?.companyName}
        </h1>
        <p className="text-sm text-gray-500 mt-1">
          Here&apos;s an overview of your trade account.
        </p>
      </div>

      {/* Account status + stats */}
      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Account card */}
        <div className="sm:col-span-2 lg:col-span-1 bg-white border border-gray-200 p-6">
          <p className="text-xs tracking-widest text-gray-500 mb-3">ACCOUNT</p>
          {data ? (
            <div className="space-y-1.5">
              <p className="text-sm font-medium text-gray-900">{data.accountInfo.tier}</p>
              <p className="text-xs text-gray-500">Approved {data.accountInfo.approvalDate}</p>
            </div>
          ) : (
            <div className="h-8 bg-gray-100 animate-pulse rounded" />
          )}
        </div>

        {/* Stats */}
        {[
          {
            label: "TOTAL ORDERS",
            icon: ShoppingCart,
            value: data?.stats.recentOrdersCount,
            sub: "last 30 days",
          },
          {
            label: "PENDING",
            icon: FileText,
            value: data?.stats.pendingOrdersCount,
            sub: "awaiting fulfilment",
          },
          {
            label: "SUPPORT",
            icon: LifeBuoy,
            value: data?.stats.openSupportTickets,
            sub: "open tickets",
          },
        ].map(({ label, icon: Icon, value, sub }) => (
          <div key={label} className="bg-white border border-gray-200 p-6">
            <div className="flex items-center justify-between mb-3">
              <p className="text-xs tracking-widest text-gray-500">{label}</p>
              <Icon className="w-4 h-4 text-gray-400" strokeWidth={1.5} />
            </div>
            {value !== undefined ? (
              <>
                <p className="text-3xl font-light text-gray-900">{value}</p>
                <p className="text-xs text-gray-400 mt-1">{sub}</p>
              </>
            ) : (
              <div className="h-8 bg-gray-100 animate-pulse rounded" />
            )}
          </div>
        ))}
      </div>

      {/* Quick actions */}
      <div>
        <p className="text-xs tracking-widest text-gray-500 mb-3">QUICK ACTIONS</p>
        <div className="flex flex-wrap gap-3">
          <Link
            to="/dashboard/orders/new"
            className="px-6 py-3 bg-yellow-500 text-gray-900 hover:bg-yellow-400 transition-colors text-sm tracking-wide"
          >
            NEW ORDER
          </Link>
          <Link
            to="/dashboard/price-list"
            className="px-6 py-3 border border-gray-900 text-gray-900 hover:bg-gray-50 transition-colors text-sm tracking-wide"
          >
            PRICE LIST
          </Link>
          <Link
            to="/dashboard/support/new"
            className="px-6 py-3 border border-gray-200 text-gray-700 hover:border-gray-400 transition-colors text-sm tracking-wide"
          >
            CONTACT SUPPORT
          </Link>
        </div>
      </div>

      {/* Recent orders */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <p className="text-xs tracking-widest text-gray-500">RECENT ORDERS</p>
          <Link
            to="/dashboard/orders"
            className="flex items-center gap-1 text-xs text-gray-500 hover:text-gray-900 transition-colors"
          >
            View all <ChevronRight className="w-3 h-3" strokeWidth={2} />
          </Link>
        </div>

        <div className="bg-white border border-gray-200 overflow-hidden">
          {!data ? (
            <div className="p-8 space-y-3">
              {[...Array(5)].map((_, i) => (
                <div key={i} className="h-6 bg-gray-100 animate-pulse rounded" />
              ))}
            </div>
          ) : (
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-gray-100 bg-gray-50">
                  {["Order #", "Date", "Items", "Total", "Status", ""].map((h) => (
                    <th
                      key={h}
                      className="px-4 py-3 text-left text-xs tracking-widest text-gray-500 font-normal"
                    >
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {data.recentOrders.map((order) => (
                  <tr
                    key={order.id}
                    className="hover:bg-gray-50 transition-colors cursor-pointer"
                  >
                    <td className="px-4 py-3 font-medium text-gray-900">{order.orderNumber}</td>
                    <td className="px-4 py-3 text-gray-500">{order.date}</td>
                    <td className="px-4 py-3 text-gray-500">{order.items}</td>
                    <td className="px-4 py-3 text-gray-900">{order.total}</td>
                    <td className="px-4 py-3">
                      <span
                        className={`px-2 py-0.5 text-xs font-medium rounded-sm ${STATUS_STYLES[order.status]}`}
                      >
                        {order.status}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <Link
                        to={`/dashboard/orders/${order.id}`}
                        className="text-xs text-gray-400 hover:text-gray-900 transition-colors"
                      >
                        View
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </div>
  );
}
