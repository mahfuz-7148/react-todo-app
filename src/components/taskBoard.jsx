import { useState, useEffect } from "react"
import localforage from 'localforage'
import { AddTask } from "./addTask.jsx"
import { TaskActions } from "./taskActions.jsx"
import { TaskList } from "./TaskList.jsx"
import NoTasksFound from "./NoTasksFound.jsx"
import Modal from "./modal.jsx"
import { SearchTask } from "./searchTask.jsx"
import { PriorityFilter } from './priorityFilter.jsx'
import { TagFilter } from './tagFilter.jsx'

// LocalForage configuration
localforage.config({
  name: 'TodoApp',
  storeName: 'tasks',
  description: 'Todo app tasks storage'
})

export const TaskBoard = () => {
  const [allTasks, setAllTasks] = useState([])
  const [showModal, setShowModal] = useState(false)
  const [taskToUpdate, setTaskToUpdate] = useState(null)
  const [deleteModal, setDeleteModal] = useState({ isOpen: false, taskId: null, taskTitle: "" })
  const [deleteAllModal, setDeleteAllModal] = useState(false)
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedPriority, setSelectedPriority] = useState("All")
  const [selectedTags, setSelectedTags] = useState([])
  const [isLoading, setIsLoading] = useState(true)

  // Load tasks from LocalForage on mount
  useEffect(() => {
    const loadTasks = async () => {
      try {
        const savedTasks = await localforage.getItem('allTasks')
        if (savedTasks && Array.isArray(savedTasks)) {
          setAllTasks(savedTasks)
        }
      } catch (err) {
        console.error('Error loading tasks:', err)
      } finally {
        setIsLoading(false)
      }
    }

    loadTasks()
  }, [])

  // Save tasks to LocalForage whenever they change
  useEffect(() => {
    if (!isLoading) {
      const saveTasks = async () => {
        try {
          await localforage.setItem('allTasks', allTasks)
        } catch (err) {
          console.error('Error saving tasks:', err)
        }
      }

      saveTasks()
    }
  }, [allTasks, isLoading])

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

  const confirmDeleteAll = async () => {
    setAllTasks([])
    setDeleteAllModal(false)
    // Optional: Clear from LocalForage immediately
    try {
      await localforage.removeItem('allTasks')
    } catch (err) {
      console.error('Error clearing tasks:', err)
    }
  }

  const handleSearch = (term) => {
    setSearchTerm(term)
  }

  const handlePriorityChange = (priority) => {
    setSelectedPriority(priority)
  }

  const handleTagToggle = (tag) => {
    setSelectedTags((prev) =>
      prev.includes(tag) ? prev.filter((t) => t !== tag) : [...prev, tag]
    )
  }

  const handleClearTags = () => {
    setSelectedTags([])
  }

  // Get all unique tags
  const availableTags = [...new Set(allTasks.flatMap((task) => task.tags))]

  // Filter tasks
  const filteredTasks = allTasks.filter((task) => {
    const matchesSearch =
      task.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      task.description.toLowerCase().includes(searchTerm.toLowerCase())

    const matchesPriority = selectedPriority === "All" || task.priority === selectedPriority

    const matchesTags =
      selectedTags.length === 0 || selectedTags.some((tag) => task.tags.map((t) => t.toLowerCase()).includes(tag))

    return matchesSearch && matchesPriority && matchesTags
  })

  if (isLoading) {
    return (
      <section className="mb-20 flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
          <p className="text-slate-400">Loading tasks...</p>
        </div>
      </section>
    )
  }

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
        <AddTask onAddEdit={handleAddEditTask} taskToUpdate={taskToUpdate} onCloseClick={handleCloseClick} />
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