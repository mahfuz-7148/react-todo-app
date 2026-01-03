import {AddTask} from './addTask.jsx';
import {useState} from 'react';
import Modal from './modal.jsx';
import {TaskActions} from './taskActions.jsx';
import {TaskList} from './TaskList.jsx';
import NoTasksFound from './NoTasksFound.jsx';

export const TaskBoard = () => {
  const [allTasks, setAllTasks] = useState([])
  const [taskToUpdate, setTaskToUpdate] = useState(null)
  const [showModal, setShowModal] = useState(false)
  const [deleteModal, setDeleteModal] = useState({isOpen: false, taskId: null, taskTitle: ''})
  const [deleteAllModal, setDeleteAllModal] = useState(false);

  const handleAddEditTask = (isAdd, newTask) => {
   setAllTasks(prevState => isAdd ? [...prevState, newTask] : prevState.map(task => task.id === newTask.id ? newTask : task))
    handleCloseClick()
  }
  const handleCloseClick = () => {
    setShowModal(false);
    setTaskToUpdate(null);
  };
  const handleEditTask = (task) => {
    setTaskToUpdate(task);
    setShowModal(true);
  };
  const handleFavorite = (taskId) => {
   setAllTasks(prevState => prevState.map(task => task.id === taskId ? {...task, isFavorite: !task.isFavorite} : task))
  }

  const handleDeleteTask = (taskId, taskTitle) => {
    setDeleteModal({isOpen: true, taskId, taskTitle})
  }

  const confirmDeleteTask = () => {
   setAllTasks(prevState => prevState.filter(task => task.id !== deleteModal.taskId))
    setDeleteModal({isOpen: false, taskId: null, taskTitle: ''})
  }

  const handleDeleteAllClick = () => {
    if (allTasks.length > 0) setDeleteAllModal(true);
  };

  const confirmDeleteAll = () => {
    setAllTasks([]);
    setDeleteAllModal(false);
  };

  return (
    <section className="mb-20" id="tasks">

      {/* delete one modal */}
      <Modal
        isOpen={deleteModal.isOpen}
        onClose={() => setDeleteModal({ isOpen: false, taskId: null, taskTitle: "" })}
        onConfirm={confirmDeleteTask}
        title="Delete Task"
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
        confirmText="Delete All"
        cancelText="Cancel"
        variant="danger"
        showExtraWarning={true}
        warningMessage="This action will permanently delete all tasks!"
      />
      {
        showModal && (<AddTask taskToUpdate={taskToUpdate} onAddEdit={handleAddEditTask}
         onCloseClick={handleCloseClick}
          />
        )
      }


      {/* MAIN CARD */}
      <div className="rounded-xl border border-[rgba(206,206,206,0.12)] bg-[#1D212B] px-6 py-8 md:px-9 md:py-16 w-full max-w-6xl mx-auto">

        {/* actions */}
        <TaskActions
          onAddClick={() => setShowModal(true)}
          onDeleteAllClick={handleDeleteAllClick}
        />

        {
          allTasks.length > 0 ? (
            <div className="overflow-x-auto w-full">

              <TaskList
                tasks={allTasks}
                onEdit={handleEditTask}
                onFav={handleFavorite}
                onDelete={handleDeleteTask}
              />
            </div>
          ) : (

            <div className="w-full flex justify-center px-4">
              <div className="w-full max-w-4xl mx-auto">
                <NoTasksFound />
              </div>
            </div>
          )
        }
      </div>
    </section>
  );
};
