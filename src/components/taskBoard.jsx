import { useState, useMemo } from "react"
import { AddTask } from "./addTask.jsx"
import { TaskActions } from "./taskActions.jsx"
import { TaskList } from "./TaskList.jsx"
import NoTasksFound from "./NoTasksFound.jsx"
import Modal from "./modal.jsx"
import { SearchTask } from "./searchTask.jsx"
import {PriorityFilter} from './priorityFilter.jsx';
import {TagFilter} from './tagFilter.jsx';

export const TaskBoard = () => {
  const [allTasks, setAllTasks] = useState([])
  const [selectedTags, setSelectedTags] = useState([])
  const [selectedPriority, setSelectedPriority] = useState("all")
  const [showModal, setShowModal] = useState(false)
  const [taskToUpdate, setTaskToUpdate] = useState(null)
  const [deleteModal, setDeleteModal] = useState({ isOpen: false, taskId: null, taskTitle: "" })
  const [deleteAllModal, setDeleteAllModal] = useState(false)
  const [searchTerm, setSearchTerm] = useState("")

  const handleSearch = (val) => setSearchTerm(val)
  const handlePriorityChange = (p) => setSelectedPriority(p)

  const filteredTasks = useMemo(() => {
    let final = [...allTasks]

    if (searchTerm.trim() !== "") {
      const q = searchTerm.toLowerCase()
      final = final.filter((t) => t.title.toLowerCase().includes(q))
    }

    if (selectedPriority !== "all") {
      final = final.filter((t) => t.priority.toLowerCase() === selectedPriority.toLowerCase())
    }

    if (selectedTags.length > 0) {
      const tagsLower = selectedTags.map((t) => t.toLowerCase())
      final = final.filter((task) => {
        const taskTags = task.tags.map((tg) => tg.toLowerCase())
        return tagsLower.some((tg) => taskTags.includes(tg))
      })
    }

    return final
  }, [allTasks, searchTerm, selectedPriority, selectedTags])

  const handleAddEditTask = (isAdd, newTask) => {
    setAllTasks((prev) => (isAdd ? [...prev, newTask] : prev.map((t) => (t.id === newTask.id ? newTask : t))))
    handleCloseClick()
  }

  const handleEditTask = (task) => {
    setTaskToUpdate(task)
    setShowModal(true)
  }

  const handleFavorite = (taskId) => {
    setAllTasks((prev) => prev.map((t) => (t.id === taskId ? { ...t, isFavorite: !t.isFavorite } : t)))
  }

  const handleCloseClick = () => {
    setShowModal(false)
    setTaskToUpdate(null)
  }

  const handleDeleteTask = (taskId, taskTitle) => {
    setDeleteModal({ isOpen: true, taskId, taskTitle })
  }

  const confirmDeleteTask = () => {
    setAllTasks((prev) => prev.filter((t) => t.id !== deleteModal.taskId))
    setDeleteModal({ isOpen: false, taskId: null, taskTitle: "" })
  }

  const handleDeleteAllClick = () => {
    if (allTasks.length > 0) setDeleteAllModal(true)
  }

  const confirmDeleteAll = () => {
    setAllTasks([])
    setDeleteAllModal(false)
  }

  const getAvailableTags = () => {
    const tagSet = new Set()
    allTasks.forEach((task) => {
      task.tags.forEach((tag) => {
        if (tag && tag.trim()) {
          tagSet.add(tag.trim().toLowerCase())
        }
      })
    })
    return Array.from(tagSet).sort()
  }

  const availableTags = getAvailableTags()

  const handleTagToggle = (tag) => {
    const lowerTag = tag.toLowerCase()

    setSelectedTags((prev) => (prev.includes(lowerTag) ? prev.filter((t) => t !== lowerTag) : [...prev, lowerTag]))
  }

  const handleClearTags = () => setSelectedTags([])

  return (
    <section className="mb-20" id="tasks">
      {/* delete one modal */}
      <Modal
        isOpen={deleteModal.isOpen}
        onClose={() => setDeleteModal({ isOpen: false, taskId: null, taskTitle: "" })}
        onConfirm={confirmDeleteTask}
        title="Delete Task"
        message={`Are you sure you want to delete "${deleteModal.taskTitle}"?`}
        confirmText="Delete"
        cancelText="Cancel"
        variant="danger"
        showExtraWarning={true}
        warningMessage="This action cannot be undone!"
      />

      {/* delete all modal */}
      <Modal
        isOpen={deleteAllModal}
        onClose={() => setDeleteAllModal(false)}
        onConfirm={confirmDeleteAll}
        title="Delete All Tasks"
        message={`Are you sure you want to delete all ${allTasks.length} tasks?`}
        confirmText="Delete All"
        cancelText="Cancel"
        variant="danger"
        showExtraWarning={true}
        warningMessage="This action will permanently delete all tasks!"
      />

      {/* add modal */}
      {showModal && (
        <AddTask onAddEdit={handleAddEditTask} taskToUpdate={taskToUpdate} handleCloseClick={handleCloseClick} />
      )}

      {/* Search */}
      <div className="container">
        <div className="p-2 flex justify-end mb-4">
          <SearchTask onSearch={handleSearch} searchTerm={searchTerm} />
        </div>
      </div>

      {/* Filters */}
      <div className="mb-4 space-y-4">
        <PriorityFilter selectedPriority={selectedPriority} onPriorityChange={handlePriorityChange} />

        <TagFilter
          availableTags={availableTags.map((t) => t.toLowerCase())}
          selectedTags={selectedTags}
          onTagToggle={handleTagToggle}
          onClearTags={handleClearTags}
        />
      </div>

      {/* MAIN CARD */}
      <div className="rounded-xl border border-[rgba(206,206,206,0.12)] bg-[#1D212B] px-6 py-8 md:px-9 md:py-16 w-full max-w-6xl mx-auto">
        {/* actions */}
        <TaskActions onAddClick={() => setShowModal(true)} onDeleteAllClick={handleDeleteAllClick} />

        {/* LIST OR NO TASK */}
        {filteredTasks.length > 0 ? (
          <div className="overflow-x-auto w-full">
            <TaskList
              tasks={filteredTasks}
              onFav={handleFavorite}
              onEdit={handleEditTask}
              onDelete={handleDeleteTask}
            />
          </div>
        ) : (
          <div className="w-full flex justify-center px-4">
            <div className="w-full max-w-4xl mx-auto">
              <NoTasksFound />
            </div>
          </div>
        )}
      </div>
    </section>
  )
}
