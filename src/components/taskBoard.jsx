import { useState, useMemo, useEffect } from "react"
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
  name: 'ReactTodoApp',
  storeName: 'tasks'
})

export const TaskBoard = () => {
  const [allTasks, setAllTasks] = useState([])
  const [selectedTags, setSelectedTags] = useState([])
  const [selectedPriority, setSelectedPriority] = useState("all")
  const [showModal, setShowModal] = useState(false)
  const [taskToUpdate, setTaskToUpdate] = useState(null)
  const [deleteModal, setDeleteModal] = useState({ isOpen: false, taskId: null, taskTitle: "" })
  const [deleteAllModal, setDeleteAllModal] = useState(false)
  const [searchTerm, setSearchTerm] = useState("")
  const [isLoading, setIsLoading] = useState(true)

  // Load tasks from LocalForage on component mount
  useEffect(() => {
    const loadTasks = async () => {
      try {
        const savedTasks = await localforage.getItem('allTasks')
        if (savedTasks) {
          setAllTasks(savedTasks)
        }
      } catch (err) {
        console.error('Error loading tasks from LocalForage:', err)
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
          console.log('Tasks saved successfully!')
        } catch (err) {
          console.error('Error saving tasks to LocalForage:', err)
        }
      }

      saveTasks()
    }
  }, [allTasks, isLoading])

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

  const confirmDeleteAll = async () => {
    setAllTasks([])
    setDeleteAllModal(false)

    // Clear from LocalForage as well
    try {
      await localforage.removeItem('allTasks')
      console.log('All tasks cleared from storage!')
    } catch (err) {
      console.error('Error clearing tasks from LocalForage:', err)
    }
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

  // Loading state UI
  if (isLoading) {
    return (
      <section className="mb-20 flex items-center justify-center min-h-[400px]" id="tasks">
        <div className="text-center">
          <div className="relative w-16 h-16 mx-auto mb-4">
            <div className="absolute inset-0 rounded-full border-4 border-transparent border-t-cyan-400 border-r-blue-500 animate-spin"></div>
            <div className="absolute inset-2 rounded-full border-4 border-transparent border-b-indigo-400 border-l-purple-500 animate-spin" style={{ animationDirection: 'reverse' }}></div>
          </div>
          <p className="text-slate-400 text-lg font-medium">Loading your tasks...</p>
        </div>
      </section>
    )
  }

  return (
    <section id="tasks">
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