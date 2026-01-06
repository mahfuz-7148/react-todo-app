// import { useState, useMemo } from "react"
// import { getTagSolidStyle } from "./tagColors.js"
//
// const FaStar = ({ className, size }) => (
//   <svg className={className} width={size} height={size} viewBox="0 0 24 24" fill="currentColor">
//     <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
//   </svg>
// )
//
// const PaginationButton = ({ children, active, disabled, onClick }) => (
//   <button
//     onClick={onClick}
//     disabled={disabled}
//     className={[
//       "inline-flex items-center justify-center px-3 h-8 rounded-md text-xs font-medium transition-all duration-150",
//       disabled
//         ? "opacity-40 cursor-not-allowed"
//         : "hover:bg-gray-800/70 hover:text-gray-100",
//       active
//         ? "bg-blue-500 text-white shadow-[0_0_18px_rgba(59,130,246,0.5)]"
//         : "bg-gray-800/60 text-gray-300 border border-gray-700/70",
//     ].join(" ")}
//   >
//     {children}
//   </button>
// )
//
// export const TaskList = ({ tasks, onEdit, onDelete, onFav }) => {
//   const [currentPage, setCurrentPage] = useState(1)
//   const pageSize = 3
//
//   const totalPages = Math.max(1, Math.ceil((tasks?.length || 0) / pageSize))
//
//   const currentTasks = useMemo(() => {
//     const start = (currentPage - 1) * pageSize
//     const end = start + pageSize
//     return tasks.slice(start, end)
//   }, [tasks, currentPage])
//
//   const handlePageChange = (page) => {
//     if (page < 1 || page > totalPages) return
//     setCurrentPage(page)
//   }
//
//   return (
//     <div className="w-full space-y-4">
//       {/* Header + meta info */}
//       <div className="flex items-center justify-between gap-3">
//         <div>
//           <h2 className="text-sm font-semibold tracking-wide text-gray-300 uppercase">
//             Tasks Overview
//           </h2>
//           <p className="text-xs text-gray-500">
//             Page {currentPage} of {totalPages} • Showing{" "}
//             <span className="text-blue-400 font-medium">
//               {currentTasks.length}
//             </span>{" "}
//             out of{" "}
//             <span className="text-gray-300 font-medium">
//               {tasks.length}
//             </span>{" "}
//             tasks
//           </p>
//         </div>
//
//         <div className="inline-flex items-center gap-2 rounded-full border border-gray-700/70 bg-gray-900/80 px-3 py-1.5 shadow-[0_0_25px_rgba(15,23,42,0.9)]">
//           <span className="h-2 w-2 rounded-full bg-emerald-400 shadow-[0_0_10px_rgba(52,211,153,0.9)]" />
//           <span className="text-[11px] text-gray-400">
//             Per page: <span className="text-gray-200 font-medium">{pageSize}</span>
//           </span>
//         </div>
//       </div>
//
//       {/* Task cards */}
//       <div className="space-y-3">
//         {currentTasks.map((task) => (
//           <div
//             key={task.id}
//             className="border border-gray-700/40 rounded-xl p-5 bg-gradient-to-br from-gray-900/80 via-slate-900/80 to-black/80
//                        hover:border-blue-500/40 hover:shadow-[0_0_22px_rgba(59,130,246,0.25)] transition-all duration-200"
//           >
//             <div className="flex items-start justify-between gap-4 mb-3">
//               <div className="flex items-start gap-3 flex-1">
//                 <button
//                   onClick={() => onFav(task.id)}
//                   className="mt-1 shrink-0 rounded-full p-1.5 bg-gray-900/80 hover:bg-gray-800/80 transition-colors"
//                 >
//                   {task.isFavorite ? (
//                     <FaStar
//                       className="text-yellow-400 drop-shadow-[0_0_10px_rgba(250,204,21,0.8)]"
//                       size={18}
//                     />
//                   ) : (
//                     <FaStar
//                       className="text-gray-600 hover:text-gray-300 transition-colors"
//                       size={18}
//                     />
//                   )}
//                 </button>
//
//                 <div className="flex-1 min-w-0">
//                   <h3 className="text-gray-50 font-semibold text-lg mb-1 line-clamp-1">
//                     {task.title}
//                   </h3>
//                   <p className="text-gray-400 text-sm leading-relaxed line-clamp-3">
//                     {task.description}
//                   </p>
//
//                   <div className="mt-2 flex items-center gap-2 text-[10px] text-gray-500">
//                     <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-gray-900/70 border border-gray-700/80">
//                       <span className="h-1.5 w-1.5 rounded-full bg-blue-400" />
//                       Priority: <span className="text-gray-300 capitalize">{task.priority || "none"}</span>
//                     </span>
//                     <span className="text-gray-600">•</span>
//                     <span className="uppercase tracking-wide">
//                       {task.tags?.length || 0} tags
//                     </span>
//                   </div>
//                 </div>
//               </div>
//
//               <span
//                 className={`px-3 py-1 rounded-lg border text-xs font-semibold flex-shrink-0
//                             shadow-[0_0_16px_rgba(15,23,42,0.8)] ${(() => {
//                   switch (task.priority?.toLowerCase()) {
//                     case "high":
//                       return "bg-red-500/10 text-red-300 border-red-500/40"
//                     case "medium":
//                       return "bg-yellow-500/10 text-yellow-300 border-yellow-500/40"
//                     case "low":
//                       return "bg-emerald-500/10 text-emerald-300 border-emerald-500/40"
//                     default:
//                       return "bg-slate-700/40 text-slate-300 border-slate-500/40"
//                   }
//                 })()}`}
//               >
//                 {task.priority || "No priority"}
//               </span>
//             </div>
//
//             {task.tags?.length > 0 && (
//               <div className="flex flex-wrap gap-2 mb-4">
//                 {task.tags.map((tag) => (
//                   <span
//                     key={tag}
//                     style={getTagSolidStyle(tag)}
//                     className="inline-flex h-6 px-3 rounded-full text-[11px] capitalize whitespace-nowrap
//                                border border-white/10 shadow-[0_0_12px_rgba(15,23,42,0.8)]"
//                   >
//                     {tag}
//                   </span>
//                 ))}
//               </div>
//             )}
//
//             <div className="flex justify-end gap-2">
//               <button
//                 className="px-3 py-1.5 rounded-lg bg-blue-500/10 border border-blue-500/40
//                            text-blue-300 text-xs hover:bg-blue-500/25 hover:text-blue-50
//                            shadow-[0_0_14px_rgba(59,130,246,0.3)] transition-all"
//                 onClick={() => onEdit(task)}
//               >
//                 Edit
//               </button>
//
//               <button
//                 className="px-3 py-1.5 rounded-lg bg-red-500/10 border border-red-500/40
//                            text-red-300 text-xs hover:bg-red-500/25 hover:text-red-50
//                            shadow-[0_0_14px_rgba(248,113,113,0.4)] transition-all"
//                 onClick={() => onDelete(task.id, task.title)}
//               >
//                 Delete
//               </button>
//             </div>
//           </div>
//         ))}
//
//         {currentTasks.length === 0 && (
//           <div className="border border-dashed border-gray-700/60 rounded-xl py-10 px-4 text-center bg-gray-900/70">
//             <p className="text-sm text-gray-400">
//               এই পেইজে দেখানোর মতো কোনো টাস্ক নেই। আগের অথবা পরের পেইজ দেখুন।
//             </p>
//           </div>
//         )}
//       </div>
//
//       {/* Pagination controls */}
//       <div className="flex items-center justify-between pt-2 border-t border-gray-800/70">
//         <div className="text-[11px] text-gray-500">
//           Showing{" "}
//           <span className="text-gray-200">
//             {(currentPage - 1) * pageSize + 1}
//           </span>{" "}
//           –{" "}
//           <span className="text-gray-200">
//             {(currentPage - 1) * pageSize + currentTasks.length}
//           </span>{" "}
//           of{" "}
//           <span className="text-gray-200">
//             {tasks.length}
//           </span>
//         </div>
//
//         <div className="flex items-center gap-1.5">
//           <PaginationButton
//             disabled={currentPage === 1}
//             onClick={() => handlePageChange(currentPage - 1)}
//           >
//             ‹ Prev
//           </PaginationButton>
//
//           {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
//             <PaginationButton
//               key={page}
//               active={page === currentPage}
//               onClick={() => handlePageChange(page)}
//             >
//               {page}
//             </PaginationButton>
//           ))}
//
//           <PaginationButton
//             disabled={currentPage === totalPages}
//             onClick={() => handlePageChange(currentPage + 1)}
//           >
//             Next ›
//           </PaginationButton>
//         </div>
//       </div>
//     </div>
//   )
// }



import { useState, useMemo, useCallback } from "react"
import { Star, ChevronLeft, ChevronRight, MoreHorizontal } from "lucide-react"
import { getTagSolidStyle } from "./tagColors"

const ITEMS_PER_PAGE = 3

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

const getPageNumbersHelper = (currentPage, totalPages) => {
  const pages = []
  const maxPagesToShow = 5

  if (totalPages <= maxPagesToShow) {
    for (let i = 1; i <= totalPages; i++) {
      pages.push(i)
    }
  } else {
    pages.push(1)

    if (currentPage > 3) {
      pages.push("...")
    }

    const startPage = Math.max(2, currentPage - 1)
    const endPage = Math.min(totalPages - 1, currentPage + 1)

    for (let i = startPage; i <= endPage; i++) {
      if (!pages.includes(i)) {
        pages.push(i)
      }
    }

    if (currentPage < totalPages - 2) {
      pages.push("...")
    }

    pages.push(totalPages)
  }

  return pages
}

export const TaskList = ({ tasks, onEdit, onDelete, onFav }) => {
  const [currentPage, setCurrentPage] = useState(1)

  const paginationData = useMemo(() => {
    const totalPages = Math.ceil(tasks.length / ITEMS_PER_PAGE)
    const startIndex = (currentPage - 1) * ITEMS_PER_PAGE
    const endIndex = startIndex + ITEMS_PER_PAGE
    const currentTasks = tasks.slice(startIndex, endIndex)
    const pageNumbers = getPageNumbersHelper(currentPage, totalPages)

    return {
      totalPages,
      startIndex,
      endIndex,
      currentTasks,
      pageNumbers,
    }
  }, [tasks, currentPage])

  const handlers = useCallback(
    () => ({
      handlePageChange: (page) => {
        setCurrentPage(page)
        window.scrollTo({ top: 0, behavior: "smooth" })
      },
      handleFav: (taskId) => {
        onFav(taskId)
      },
      handleEdit: (task) => {
        onEdit(task)
      },
      handleDelete: (taskId, taskTitle) => {
        onDelete(taskId, taskTitle)
      },
    }),
    [onFav, onEdit, onDelete],
  )

  const { totalPages, startIndex, endIndex, currentTasks, pageNumbers } = paginationData
  const { handlePageChange, handleFav, handleEdit, handleDelete } = handlers()

  return (
    <div className="w-full space-y-6">
      {/* Tasks Container */}
      <div className="space-y-3 min-h-[600px]">
        {currentTasks.length > 0 ? (
          currentTasks.map((task, index) => (
            <div
              key={task.id}
              className="border border-gray-700/30 rounded-lg p-5 hover:bg-gray-800/30 duration-200 bg-gray-800/10 hover:shadow-lg hover:shadow-blue-500/5 transition-all group"
              style={{
                animation: `slideIn 0.3s ease-out ${index * 0.1}s both`,
              }}
            >
              <div className="flex items-start justify-between gap-4 mb-3">
                <div className="flex items-start gap-3 flex-1">
                  <button
                    onClick={() => handleFav(task.id)}
                    className="mt-1 shrink-0 transition-transform hover:scale-110"
                  >
                    <Star
                      size={18}
                      className={
                        task.isFavorite
                          ? "fill-yellow-400 text-yellow-400 drop-shadow-[0_0_8px_rgba(250,204,21,0.5)]"
                          : "text-gray-600 hover:text-gray-400"
                      }
                    />
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
                  className="px-3 py-1.5 rounded-lg bg-blue-500/10 border border-blue-500/30 text-blue-400 text-xs hover:bg-blue-500/20 transition-colors"
                  onClick={() => handleEdit(task)}
                >
                  Edit
                </button>

                <button
                  className="px-3 py-1.5 rounded-lg bg-red-500/10 border border-red-500/30 text-red-400 text-xs hover:bg-red-500/20 transition-colors"
                  onClick={() => handleDelete(task.id, task.title)}
                >
                  Delete
                </button>
              </div>
            </div>
          ))
        ) : (
          <div className="flex flex-col items-center justify-center h-64 text-center">
            <div className="text-gray-400 mb-2">
              <MoreHorizontal className="w-12 h-12 mx-auto opacity-50" />
            </div>
            <p className="text-gray-400">No tasks found</p>
          </div>
        )}
      </div>

      {totalPages > 1 && (
        <div className="flex flex-col items-center gap-4 pt-6 border-t border-gray-700/30">
          {/* Task Count Info */}
          <div className="text-sm text-gray-400">
            Showing <span className="font-semibold text-gray-300">{startIndex + 1}</span> to{" "}
            <span className="font-semibold text-gray-300">{Math.min(endIndex, tasks.length)}</span> of{" "}
            <span className="font-semibold text-gray-300">{tasks.length}</span> tasks
          </div>

          {/* Custom Pagination with Lucide Icons */}
          <div className="flex items-center justify-center gap-1 flex-wrap">
            {/* Previous Button */}
            <button
              onClick={() => currentPage > 1 && handlePageChange(currentPage - 1)}
              disabled={currentPage === 1}
              className={`inline-flex items-center justify-center gap-1 px-3 py-2 rounded-md transition-all ${
                currentPage === 1
                  ? "pointer-events-none opacity-50 cursor-not-allowed"
                  : "cursor-pointer hover:bg-gray-800/50 text-gray-400 hover:text-gray-300"
              }`}
            >
              <ChevronLeft size={16} />
              <span className="text-sm">Prev</span>
            </button>

            {/* Page Numbers */}
            {pageNumbers.map((page, index) =>
              page === "..." ? (
                <div key={`ellipsis-${index}`} className="px-2 py-2">
                  <span className="text-gray-500">...</span>
                </div>
              ) : (
                <button
                  key={page}
                  onClick={() => handlePageChange(page)}
                  className={`px-3 py-2 rounded-md transition-all text-sm font-medium ${
                    currentPage === page
                      ? "bg-blue-500/20 border border-blue-500/50 text-blue-400"
                      : "text-gray-400 hover:text-gray-300 hover:bg-gray-800/50"
                  }`}
                >
                  {page}
                </button>
              ),
            )}

            {/* Next Button */}
            <button
              onClick={() => currentPage < totalPages && handlePageChange(currentPage + 1)}
              disabled={currentPage === totalPages}
              className={`inline-flex items-center justify-center gap-1 px-3 py-2 rounded-md transition-all ${
                currentPage === totalPages
                  ? "pointer-events-none opacity-50 cursor-not-allowed"
                  : "cursor-pointer hover:bg-gray-800/50 text-gray-400 hover:text-gray-300"
              }`}
            >
              <span className="text-sm">Next</span>
              <ChevronRight size={16} />
            </button>
          </div>
        </div>
      )}

      {/* Add animation styles */}
      <style jsx>{`
        @keyframes slideIn {
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
