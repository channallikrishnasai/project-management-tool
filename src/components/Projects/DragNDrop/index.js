import { useState, useEffect } from "react";

// CSS
import "./index.css";

// Components
import Column from "../Column";
import EditTask from "../Edit";

// Drag and Drop
import { DragDropContext, Droppable } from "react-beautiful-dnd";

// Data
import projectData from "../../../data";

const DragNDrop = () => {
  const [data, setData] = useState(() => {
    const newData = localStorage.getItem("project-data");
    return newData !== null ? JSON.parse(newData) : projectData;
  });
  const [task, setTask] = useState();
  const [editSection, setEditSection] = useState(false);

  // Save to local storage
  useEffect(() => {
    localStorage.setItem("project-data", JSON.stringify(data));
  }, [data]);

  // On Drag
  const onDragEnd = (result) => {
    const { destination, source, draggableId, type } = result;

    //If there is no destination
    if (!destination) {
      return;
    }

    //If source and destination is the same
    if (
      destination.droppableId === source.droppableId &&
      destination.index === source.index
    ) {
      return;
    }

    //If you're dragging columns
    if (type === "column") {
      const newColumnOrder = Array.from(data.columnOrder);
      newColumnOrder.splice(source.index, 1);
      newColumnOrder.splice(destination.index, 0, draggableId);
      const newState = {
        ...data,
        columnOrder: newColumnOrder,
      };
      setData(newState);
      return;
    }

    //Anything below this happens if you're dragging tasks
    const start = data.columns[source.droppableId];
    const finish = data.columns[destination.droppableId];

    //If dropped inside the same column
    if (start === finish) {
      const newTaskIds = Array.from(start.taskIds);
      newTaskIds.splice(source.index, 1);
      newTaskIds.splice(destination.index, 0, draggableId);
      const newColumn = {
        ...start,
        taskIds: newTaskIds,
      };
      const newState = {
        ...data,
        columns: {
          ...data.columns,
          [newColumn.id]: newColumn,
        },
      };
      setData(newState);
      return;
    }

    //If dropped in a different column
    const startTaskIds = Array.from(start.taskIds);
    startTaskIds.splice(source.index, 1);
    const newStart = {
      ...start,
      taskIds: startTaskIds,
    };

    const finishTaskIds = Array.from(finish.taskIds);
    finishTaskIds.splice(destination.index, 0, draggableId);
    const newFinish = {
      ...finish,
      taskIds: finishTaskIds,
    };

    const newState = {
      ...data,
      columns: {
        ...data.columns,
        [newStart.id]: newStart,
        [newFinish.id]: newFinish,
      },
    };

    setData(newState);
  };

  // Add new Task to respective column
  const handleNewTask = (newTask) => {
    const { title, description, columnId } = newTask;
    const totalTasks = Object.keys(data.tasks).length;
    const taskId = `task-${totalTasks + 1}`;

    let newData = { ...data };

    newData.tasks[taskId] = {
      id: taskId,
      title: title,
      content: description,
    };

    newData.columns[columnId].taskIds.push(taskId);
    setData(newData);
  };

  // Edit Task
  const handleEditTask = (task) => {
    setTask(task);
    setEditSection(!editSection);
  };

  const updateTask = (newTask) => {
    let newData = { ...data };

    newData.tasks[newTask.id] = newTask;
    setData(newData);
    setEditSection(!editSection);
  };

  return (
    <DragDropContext onDragEnd={onDragEnd}>
      {editSection && <EditTask task={task} updateTask={updateTask} />}

      <Droppable droppableId="all-columns" direction="horizontal" type="column">
        {(provided) => (
          <div
            className="droppable-container"
            {...provided.droppableProps}
            ref={provided.innerRef}
          >
            {data.columnOrder.map((id, index) => {
              const column = data.columns[id];
              const tasks = column.taskIds.map((taskId) => data.tasks[taskId]);

              return (
                <Column
                  key={column.id}
                  column={column}
                  tasks={tasks}
                  index={index}
                  addNewTask={handleNewTask}
                  editTask={handleEditTask}
                />
              );
            })}
            {provided.placeholder}
          </div>
        )}
      </Droppable>
    </DragDropContext>
  );
};

export default DragNDrop;
