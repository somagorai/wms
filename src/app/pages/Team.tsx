import { Mail, MoreVertical } from "lucide-react";

const team = [
  {
    name: "Sarah Chen",
    role: "Product Designer",
    email: "sarah.chen@example.com",
    avatar: "SC",
    status: "Active",
    color: "from-violet-500 to-purple-500",
  },
  {
    name: "Mike Johnson",
    role: "UI/UX Designer",
    email: "mike.j@example.com",
    avatar: "MJ",
    status: "Active",
    color: "from-blue-500 to-cyan-500",
  },
  {
    name: "Emma Wilson",
    role: "Lead Designer",
    email: "emma.w@example.com",
    avatar: "EW",
    status: "Active",
    color: "from-emerald-500 to-green-500",
  },
  {
    name: "Alex Turner",
    role: "Visual Designer",
    email: "alex.turner@example.com",
    avatar: "AT",
    status: "Away",
    color: "from-orange-500 to-red-500",
  },
  {
    name: "Lisa Martinez",
    role: "UX Researcher",
    email: "lisa.m@example.com",
    avatar: "LM",
    status: "Active",
    color: "from-pink-500 to-rose-500",
  },
  {
    name: "David Kim",
    role: "Design Engineer",
    email: "david.kim@example.com",
    avatar: "DK",
    status: "Active",
    color: "from-indigo-500 to-purple-500",
  },
];

export function Team() {
  return (
    <div className="p-8">
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold text-zinc-900 dark:text-white mb-2">Team</h2>
        </div>
        <button className="px-6 py-3 bg-[#0d9488] dark:bg-[#50e080] hover:bg-[#0f766e] dark:hover:bg-[#3bc76a] text-white rounded-lg transition-colors">
          Invite Member
        </button>
      </div>

      <div className="bg-white dark:bg-zinc-900 border-2 border-zinc-300 dark:border-zinc-700 rounded-xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-zinc-200 dark:border-zinc-800">
                <th className="text-left py-4 px-6 text-zinc-600 dark:text-zinc-400 font-medium text-sm">Member</th>
                <th className="text-left py-4 px-6 text-zinc-600 dark:text-zinc-400 font-medium text-sm">Role</th>
                <th className="text-left py-4 px-6 text-zinc-600 dark:text-zinc-400 font-medium text-sm">Email</th>
                <th className="text-left py-4 px-6 text-zinc-600 dark:text-zinc-400 font-medium text-sm">Status</th>
                <th className="text-right py-4 px-6 text-zinc-600 dark:text-zinc-400 font-medium text-sm">Actions</th>
              </tr>
            </thead>
            <tbody>
              {team.map((member, i) => (
                <tr key={i} className="border-b border-zinc-200 dark:border-zinc-800 hover:bg-zinc-100 dark:hover:bg-zinc-800/50 transition-colors">
                  <td className="py-4 px-6">
                    <div className="flex items-center gap-3">
                      <div className={`w-10 h-10 bg-gradient-to-br ${member.color} rounded-full flex items-center justify-center flex-shrink-0`}>
                        <span className="text-white text-sm font-medium">{member.avatar}</span>
                      </div>
                      <span className="text-zinc-900 dark:text-white font-medium">{member.name}</span>
                    </div>
                  </td>
                  <td className="py-4 px-6">
                    <span className="text-zinc-700 dark:text-zinc-300">{member.role}</span>
                  </td>
                  <td className="py-4 px-6">
                    <div className="flex items-center gap-2 text-zinc-600 dark:text-zinc-400">
                      <Mail size={16} />
                      <span>{member.email}</span>
                    </div>
                  </td>
                  <td className="py-4 px-6">
                    <span
                      className={`px-3 py-1 rounded-full text-xs ${
                        member.status === "Active"
                          ? "bg-emerald-500/20 text-emerald-600 dark:text-emerald-400"
                          : "bg-orange-500/20 text-orange-600 dark:text-orange-400"
                      }`}
                    >
                      {member.status}
                    </span>
                  </td>
                  <td className="py-4 px-6 text-right">
                    <button className="p-2 hover:bg-zinc-200 dark:hover:bg-zinc-700 rounded-lg transition-colors">
                      <MoreVertical size={18} className="text-zinc-600 dark:text-zinc-400" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}