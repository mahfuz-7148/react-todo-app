import React, { useState, useMemo } from 'react';
import { AddTask } from './addTask.jsx';
import { TaskActions } from './taskActions.jsx';
import { TaskList } from './TaskList.jsx';
import NoTasksFound from './NoTasksFound.jsx';
import Modal from './modal.jsx';
import { SearchTask } from './searchTask.jsx';
import { PriorityFilter } from './PriorityFilter.jsx';
import { TagFilter } from './TagFilter.jsx';

export const TaskBoard = () => {
  const [allTasks, setAllTasks] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selectedTags, setSelectedTags] = useState([]);
  const [selectedPriority, setSelectedPriority] = useState('all');
  const [showAddModal, setShowAddModal] = useState(false);
  const [taskToUpdate, setTaskToUpdate] = useState(null);
  const [deleteModal, setDeleteModal] = useState({
    isOpen: false,
    taskId: null,
    taskTitle: ''
  });
  const [deleteAllModal, setDeleteAllModal] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');

  const handleSearch = (searchValue) => {
    setSearchTerm(searchValue);
  };

  const handlePriorityChange = (priority) => {
    setSelectedPriority(priority);
  };

  // সব ফিল্টার একসাথে
  const filteredTasks = useMemo(() => {
    let filtered = [...allTasks];

    // 1) title search
    if (searchTerm.trim() !== '') {
      const q = searchTerm.toLowerCase();
      filtered = filtered.filter(task =>
        task.title.toLowerCase().includes(q)
      );
    }

    // 2) priority filter
    if (selectedPriority !== 'all') {
      filtered = filtered.filter(task =>
        task.priority.toLowerCase() === selectedPriority.toLowerCase()
      );
    }

    // 3) tag filter (task এ selectedTags এর যেকোনো একটা থাকলেই চলবে)
    if (selectedTags.length > 0) {
      const selectedLower = selectedTags.map(t => t.toLowerCase());
      filtered = filtered.filter(task => {
        const taskLower = (task.tags).map(t => t.toLowerCase());
        return selectedLower.some(tag => taskLower.includes(tag));
      });
    }
    return filtered;
  }, [allTasks, searchTerm, selectedPriority, selectedTags]);

  const handleAddEditTask = (isAdd, newTask) => {
    let updatedTasks;
    if (isAdd) {
      updatedTasks = [...allTasks, newTask];
    } else {
      updatedTasks = allTasks.map(task =>
        task.id === newTask.id ? newTask : task
      );
    }
    setAllTasks(updatedTasks);
    handleCloseClick();
  };

  const handleEditTask = (task) => {
    setTaskToUpdate(task);
    setShowAddModal(true);
  };

  const handleFavorite = (taskId) => {
    setAllTasks(
      allTasks.map(task =>
        task.id === taskId
          ? { ...task, isFavorite: !task.isFavorite }
          : task
      )
    );
  };

  const handleCloseClick = () => {
    setShowAddModal(false);
    setTaskToUpdate(null);
  };

  const handleDeleteTask = (taskId, taskTitle) => {
    setDeleteModal({
      isOpen: true,
      taskId,
      taskTitle
    });
  };

  const confirmDeleteTask = () => {
    const filterTask = allTasks.filter(
      task => task.id !== deleteModal.taskId
    );
    setAllTasks(filterTask);
    setDeleteModal({
      isOpen: false,
      taskId: null,
      taskTitle: ''
    });
  };

  const handleDeleteAllClick = () => {
    if (allTasks.length === 0) return;
    setDeleteAllModal(true);
  };

  // সব available tags (lowercase এ)
  const getAvailableTags = () => {
    const tagSet = new Set();
    allTasks.forEach(task => {
      (task.tags).forEach(tag => {
        if (tag && tag.trim()) {
          tagSet.add(tag.trim().toLowerCase());
        }
      });
    });
    return Array.from(tagSet).sort();
  };

  const availableTags = getAvailableTags();

  const confirmDeleteAll = () => {
    setAllTasks([]);
    setDeleteAllModal(false);
  };

  const handleTagToggle = (tag) => {
    // এখানে tag already lowercase (availableTags থেকে এসেছে)
    setSelectedTags(prev =>
      prev.includes(tag)
        ? prev.filter(tg => tg !== tag)
        : [...prev, tag]
    );
  };

  const handleClearTags = () => {
    setSelectedTags([]);
  };

  return (
    <section className="mb-20" id="tasks">
      {/* single delete modal */}
      <Modal
        isOpen={deleteModal.isOpen}
        onClose={() =>
          setDeleteModal({ isOpen: false, taskId: null, taskTitle: '' })
        }
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
        message={`Are you sure you want to delete all ${allTasks.length} tasks? This will remove everything from your task list.`}
        confirmText="Delete All"
        cancelText="Cancel"
        variant="danger"
        showExtraWarning={true}
        warningMessage="This action will permanently delete all tasks!"
      />

      {showAddModal && (
        <AddTask
          onSave={handleAddEditTask}
          taskToUpdate={taskToUpdate}
          handleCloseClick={handleCloseClick}
        />
      )}

      <div className="container">
        <div className="p-2 flex justify-end mb-4">
          <SearchTask onSearch={handleSearch} />
        </div>
      </div>

      <div className="mb-4 space-y-4">
        <PriorityFilter
          selectedPriority={selectedPriority}
          onPriorityChange={handlePriorityChange}
        />

        <TagFilter
          availableTags={availableTags}
          selectedTags={selectedTags}
          onTagToggle={handleTagToggle}
          onClearTags={handleClearTags}
        />
      </div>

      <div className="rounded-xl border border-[rgba(206,206,206,0.12)] bg-[#1D212B] px-6 py-8 md:px-9 md:py-16">
        <TaskActions
          onAddClick={() => setShowAddModal(true)}
          onDeleteAllClick={handleDeleteAllClick}
        />

        {filteredTasks.length > 0 ? (
          <TaskList
            tasks={filteredTasks}
            onFav={handleFavorite}
            onEdit={handleEditTask}
            onDelete={handleDeleteTask}
          />
        ) : (
          <NoTasksFound />
        )}
      </div>
    </section>
  );
};
