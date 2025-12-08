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
