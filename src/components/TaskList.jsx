import { useState } from "react"
import {TaskCard} from './TaskCard.jsx';
import {Pagination} from './Pagination.jsx';

const TASKS_PER_PAGE = 3

const EmptyState = () => (
  <div className="w-full flex items-center justify-center py-16">
    <p className="text-gray-500 text-lg">No tasks found</p>
  </div>
)

// Main Component
export const TaskList = ({ tasks, onEdit, onDelete, onFav }) => {
  const [currentPage, setCurrentPage] = useState(1)

  const totalPages = Math.ceil(tasks.length / TASKS_PER_PAGE)
  const startIndex = (currentPage - 1) * TASKS_PER_PAGE
  const endIndex = startIndex + TASKS_PER_PAGE
  const currentTasks = tasks.slice(startIndex, endIndex)

  const handlePageChange = (page) => {
    setCurrentPage(Math.max(1, Math.min(page, totalPages)))
  }

  if (tasks.length === 0) {
    return <EmptyState />
  }

  return (
    <div className="w-full">
      <div className="space-y-3 mb-6">
        {currentTasks.map((task) => (
          <TaskCard
            key={task.id}
            task={task}
            onEdit={onEdit}
            onDelete={onDelete}
            onFav={onFav}
          />
        ))}
        {/* Fill empty slots to maintain consistent layout */}
        {currentTasks.length < TASKS_PER_PAGE &&
          Array.from({ length: TASKS_PER_PAGE - currentTasks.length }).map((_, idx) => (
            <div key={`placeholder-${idx}`} className="h-[180px]" />
          ))
        }
      </div>

      <Pagination
        currentPage={currentPage}
        totalPages={totalPages}
        startIndex={startIndex}
        endIndex={endIndex}
        totalItems={tasks.length}
        onPageChange={handlePageChange}
      />

      <style>{`
        @keyframes dropdownSlide {
          from { 
            opacity: 0;
            transform: translateY(10px);
          }
          to { 
            opacity: 1;
            transform: translateY(0);
          }
        }
      `}</style>
    </div>
  )
}