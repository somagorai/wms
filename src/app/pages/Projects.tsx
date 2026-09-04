import { FolderKanban, Clock, Users } from "lucide-react";

const projects = [
  {
    name: "Mobile App Redesign",
    status: "In Progress",
    team: 5,
    progress: 65,
    color: "violet",
    updated: "2 hours ago",
  },
  {
    name: "Website Dashboard",
    status: "Review",
    team: 3,
    progress: 90,
    color: "blue",
    updated: "5 hours ago",
  },
  {
    name: "Brand Identity",
    status: "In Progress",
    team: 4,
    progress: 40,
    color: "emerald",
    updated: "1 day ago",
  },
  {
    name: "Marketing Campaign",
    status: "Planning",
    team: 6,
    progress: 15,
    color: "orange",
    updated: "3 days ago",
  },
  {
    name: "Product Launch",
    status: "In Progress",
    team: 8,
    progress: 75,
    color: "pink",
    updated: "4 hours ago",
  },
  {
    name: "User Research",
    status: "Completed",
    team: 2,
    progress: 100,
    color: "cyan",
    updated: "1 week ago",
  },
];

export function Projects() {
  return (
    <div className="p-8">
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold text-zinc-900 dark:text-white mb-2">Projects</h2>
        </div>
        <button className="px-6 py-3 bg-[#0d9488] dark:bg-[#50e080] hover:bg-[#0f766e] dark:hover:bg-[#3bc76a] text-white rounded-lg transition-colors">
          New Project
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {projects.map((project, i) => (
          <div
            key={i}
            className="bg-white dark:bg-zinc-900 border-2 border-zinc-300 dark:border-zinc-700 rounded-xl p-6 hover:border-zinc-400 dark:hover:border-zinc-600 transition-all cursor-pointer group"
          >
            <div className="flex items-start justify-between mb-4">
              <div className={`w-12 h-12 bg-${project.color}-600 rounded-lg flex items-center justify-center`}>
                <FolderKanban size={24} className="text-white" />
              </div>
              <span className="px-3 py-1 bg-zinc-100 dark:bg-zinc-800 text-zinc-700 dark:text-zinc-300 text-xs rounded-full">
                {project.status}
              </span>
            </div>

            <h3 className="text-lg font-semibold text-zinc-900 dark:text-white mb-3 group-hover:text-violet-600 dark:group-hover:text-violet-400 transition-colors">
              {project.name}
            </h3>

            <div className="mb-4">
              <div className="flex items-center justify-between text-sm text-zinc-600 dark:text-zinc-400 mb-2">
                <span>Progress</span>
                <span>{project.progress}%</span>
              </div>
              <div className="w-full bg-zinc-200 dark:bg-zinc-800 rounded-full h-2">
                <div
                  className={`bg-${project.color}-600 h-2 rounded-full transition-all`}
                  style={{ width: `${project.progress}%` }}
                />
              </div>
            </div>

            <div className="flex items-center justify-between text-sm text-zinc-600 dark:text-zinc-400">
              <div className="flex items-center gap-1">
                <Users size={16} />
                <span>{project.team} members</span>
              </div>
              <div className="flex items-center gap-1">
                <Clock size={16} />
                <span>{project.updated}</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}