// ServiceGrid.jsx
import { Link } from "react-router-dom";
import { CreditCard, QrCode, Landmark, TrendingUp, Wallet, Info } from "lucide-react";

const services = [
  { name: "Pay", path: "/pay", icon: CreditCard, color: "from-blue-500 to-cyan-400" },
  { name: "QR", path: "/qr", icon: QrCode, color: "from-cyan-400 to-teal-400" },
  { name: "Loan", path: "/loan", icon: Landmark, color: "from-blue-600 to-indigo-500" },
  { name: "Invest", path: "/invest", icon: TrendingUp, color: "from-indigo-500 to-purple-500" },
  { name: "Balance", path: "/balance", icon: Wallet, color: "from-purple-500 to-pink-500" },
  { name: "About", path: "/about", icon: Info, color: "from-pink-500 to-rose-500" },
];

export default function ServiceGrid() {
  return (
    <div>
      <h2 className="text-2xl font-bold text-gray-900 mb-6">Services & Features</h2>
      <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
        {services.map(({ name, path, icon: Icon, color }) => (
          <Link key={name} to={path} className="bg-white rounded-2xl p-6 border hover:shadow-xl hover:-translate-y-1 transition-all flex flex-col items-center gap-4 min-h-[160px]">
            <div className={`w-16 h-16 rounded-2xl bg-gradient-to-br ${color} flex items-center justify-center`}>
              <Icon className="text-white w-8 h-8" />
            </div>
            <span className="text-lg font-semibold text-gray-900">{name}</span>
          </Link>
        ))}
      </div>
    </div>
  );
}