

export const TaskBoard = () => {

  return (
    <section className="mb-20" id="tasks">

      {/* delete one modal */}
      <Modal
        title="Delete Task"
        confirmText="Delete"
        cancelText="Cancel"
        variant="danger"
        showExtraWarning={true}
        warningMessage="This action cannot be undone!"
      />

      {/* delete all modal */}
      <Modal
        title="Delete All Tasks"
        confirmText="Delete All"
        cancelText="Cancel"
        variant="danger"
        showExtraWarning={true}
        warningMessage="This action will permanently delete all tasks!"
      />


        <AddTask

        />
      )}

      {/* Search */}
      <div className="container">
        <div className="p-2 flex justify-end mb-4">
          <SearchTask  />
        </div>
      </div>

      {/* Filters */}
      <div className="mb-4 space-y-4">
        <PriorityFilter

        />

        <TagFilter

        />

      </div>

      {/* MAIN CARD */}
      <div className="rounded-xl border border-[rgba(206,206,206,0.12)] bg-[#1D212B] px-6 py-8 md:px-9 md:py-16 w-full max-w-6xl mx-auto">

        {/* actions */}
        <TaskActions

        />

        {/* LIST OR NO TASK */}

          <div className="overflow-x-auto w-full">
            <TaskList

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
  );
};
