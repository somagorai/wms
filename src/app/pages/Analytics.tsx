import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import { Link } from "react-router-dom";
import { Home, ChevronRight } from "lucide-react";

const data = [
  { name: "Mon", value: 400, projects: 24 },
  { name: "Tue", value: 300, projects: 13 },
  { name: "Wed", value: 600, projects: 38 },
  { name: "Thu", value: 800, projects: 39 },
  { name: "Fri", value: 500, projects: 48 },
  { name: "Sat", value: 200, projects: 12 },
  { name: "Sun", value: 100, projects: 8 },
];

export function Analytics() {
  return (
    <div className="p-8">
      {/* Breadcrumb Navigation */}
      <div className="mb-4 flex items-center gap-2 text-sm text-zinc-500 dark:text-zinc-500">
        <Link to="/app/home" className="hover:text-[#0d9488] dark:hover:text-[#50e080] transition-colors flex items-center gap-1">
          <Home size={14} />
          Home
        </Link>
        <ChevronRight size={14} />
        <Link
          to="/app/navigation"
          className="hover:text-[#0d9488] dark:hover:text-[#50e080] transition-colors"
        >
          Navigation
        </Link>
        <ChevronRight size={14} />
        <Link
          to="/app/navigation?section=reports"
          className="hover:text-[#0d9488] dark:hover:text-[#50e080] transition-colors"
        >
          Reports
        </Link>
        <ChevronRight size={14} />
        <span className="text-zinc-900 dark:text-white font-medium">Analytics</span>
      </div>

      <div className="mb-8">
        <h2 className="text-3xl font-bold text-zinc-900 dark:text-white mb-2">Analytics</h2>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Line Chart */}
        <div className="bg-white dark:bg-zinc-900 border-2 border-zinc-300 dark:border-zinc-700 rounded-xl p-6">
          <h3 className="text-xl font-semibold text-zinc-900 dark:text-white mb-6">User Activity</h3>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={data}>
              <CartesianGrid strokeDasharray="3 3" stroke="#27272a" className="dark:stroke-[#27272a] stroke-zinc-300" />
              <XAxis dataKey="name" stroke="#71717a" className="dark:stroke-[#71717a] stroke-zinc-600" />
              <YAxis stroke="#71717a" className="dark:stroke-[#71717a] stroke-zinc-600" />
              <Tooltip
                contentStyle={{
                  backgroundColor: "#18181b",
                  border: "1px solid #27272a",
                  borderRadius: "8px",
                  color: "#fff",
                }}
              />
              <Line type="monotone" dataKey="value" stroke="#8b5cf6" strokeWidth={2} />
            </LineChart>
          </ResponsiveContainer>
        </div>

        {/* Bar Chart */}
        <div className="bg-white dark:bg-zinc-900 border-2 border-zinc-300 dark:border-zinc-700 rounded-xl p-6">
          <h3 className="text-xl font-semibold text-zinc-900 dark:text-white mb-6">Project Distribution</h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={data}>
              <CartesianGrid strokeDasharray="3 3" stroke="#27272a" className="dark:stroke-[#27272a] stroke-zinc-300" />
              <XAxis dataKey="name" stroke="#71717a" className="dark:stroke-[#71717a] stroke-zinc-600" />
              <YAxis stroke="#71717a" className="dark:stroke-[#71717a] stroke-zinc-600" />
              <Tooltip
                contentStyle={{
                  backgroundColor: "#18181b",
                  border: "1px solid #27272a",
                  borderRadius: "8px",
                  color: "#fff",
                }}
              />
              <Bar dataKey="projects" fill="#50e080" className="dark:fill-[#50e080] fill-[#0d9488]" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Metrics */}
      <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white dark:bg-zinc-900 border-2 border-zinc-300 dark:border-zinc-700 rounded-xl p-6">
          <p className="text-zinc-600 dark:text-zinc-400 text-sm mb-2">Total Views</p>
          <p className="text-3xl font-bold text-zinc-900 dark:text-white">12,458</p>
          <p className="text-emerald-600 dark:text-emerald-400 text-sm mt-2">+23% from last week</p>
        </div>
        <div className="bg-white dark:bg-zinc-900 border-2 border-zinc-300 dark:border-zinc-700 rounded-xl p-6">
          <p className="text-zinc-600 dark:text-zinc-400 text-sm mb-2">Avg. Session</p>
          <p className="text-3xl font-bold text-zinc-900 dark:text-white">4m 32s</p>
          <p className="text-emerald-600 dark:text-emerald-400 text-sm mt-2">+5% from last week</p>
        </div>
        <div className="bg-white dark:bg-zinc-900 border-2 border-zinc-300 dark:border-zinc-700 rounded-xl p-6">
          <p className="text-zinc-600 dark:text-zinc-400 text-sm mb-2">Bounce Rate</p>
          <p className="text-3xl font-bold text-zinc-900 dark:text-white">32%</p>
          <p className="text-red-600 dark:text-red-400 text-sm mt-2">-8% from last week</p>
        </div>
      </div>
    </div>
  );
}