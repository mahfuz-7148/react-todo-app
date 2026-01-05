import { getTagSolidStyle } from "./tagColors.js"

const FaStar = ({ className, size }) => (
  <svg className={className} width={size} height={size} viewBox="0 0 24 24" fill="currentColor">
    <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
  </svg>
)

export const TaskList = ({ tasks, onEdit, onDelete, onFav}) => {
  const getPriorityColor = (priority) => {
    switch (priority?.toLowerCase()) {
      case "high":
        return "bg-red-500/10 text-red-400 border-red-500/30"
      case "medium":
        return "bg-yellow-500/10 text-yellow-400 border-yellow-500/30"
      case "low":
        return "bg-green-500/10 text-green-400 border-green-500/30"
      default:
        return "bg-gray-500/10 text-gray-400 border-gray-500/30"
    }
  }

  return (
    <div className="w-full">
      <div className="space-y-3">
        {tasks.map((task) => (
          <div
            key={task.id}
            className="border border-gray-700/30 rounded-lg p-5 hover:bg-gray-800/30 duration-200 bg-gray-800/10"
          >
            <div className="flex items-start justify-between gap-4 mb-3">
              <div className="flex items-start gap-3 flex-1">
                <button onClick={() => onFav(task.id)} className="mt-1 flex-shrink-0">
                  {task.isFavorite ? (
                    <FaStar className="text-yellow-400 drop-shadow-[0_0_8px_rgba(250,204,21,0.5)]" size={18} />
                  ) : (
                    <FaStar className="text-gray-600 hover:text-gray-400" size={18} />
                  )}
                </button>

                <div className="flex-1 min-w-0">
                  <h3 className="text-gray-100 font-semibold text-lg mb-1">{task.title}</h3>
                  <p className="text-gray-400 text-sm">{task.description}</p>
                </div>
              </div>

              <span
                className={`px-3 py-1 rounded-lg border text-xs font-semibold flex-shrink-0 ${getPriorityColor(
                  task.priority,
                )}`}
              >
                {task.priority}
              </span>
            </div>

            <div className="flex flex-wrap gap-2 mb-4">
              {task.tags.map((tag) => (
                <span
                  key={tag}
                  style={getTagSolidStyle(tag)}
                  className="inline-flex h-6 px-3 rounded-full text-xs capitalize whitespace-nowrap"
                >
                  {tag}
                </span>
              ))}
            </div>

            <div className="flex justify-end gap-2">
              <button
                className="px-3 py-1.5 rounded-lg bg-blue-500/10 border border-blue-500/30 text-blue-400 text-xs hover:bg-blue-500/20"
                onClick={() => onEdit(task)}
              >
                Edit
              </button>

              <button
                className="px-3 py-1.5 rounded-lg bg-red-500/10 border border-red-500/30 text-red-400 text-xs hover:bg-red-500/20"
                onClick={() => onDelete(task.id, task.title)}
              >
                Delete
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}