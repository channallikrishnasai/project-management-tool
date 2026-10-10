import { useState, useEffect } from "react";

// CSS
import "./index.css";

// Components
import Task from "../Task";

// Drag and Drop
import { Droppable, Draggable } from "react-beautiful-dnd";

const Column = (props) => {
  const [showTaskCard, setShowTaskCard] = useState(false);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");

  // Show / Hide new Task card
  const handleClick = () => {
    setShowTaskCard(!showTaskCard);
  };

  // Add new Task Card
  const handleSubmit = () => {
    const columnId = props.column.id;
    props.addNewTask({ title, description, columnId });
  };

  // Edit task
  const handleEditTask = (task) => {
    props.editTask(task);
  };

  useEffect(() => {
    setShowTaskCard(false);
  }, [props]);

  return (
    <Draggable draggableId={props.column.id} index={props.index}>
      {(provided) => (
        <div
          className="column"
          ref={provided.innerRef}
          {...provided.draggableProps}
        >
          <div className="column-title" {...provided.dragHandleProps}>
            <span>{props.column.title}</span>
            <span className="task-length">{props.tasks.length}</span>
          </div>

          {/* Add New Task Button */}
          <button
            type="submit"
            name="add-task"
            className="add-button"
            onClick={() => handleClick()}
          >
            +
          </button>

          {/* New Task Card */}
          {showTaskCard && (
            <div className="new-task-card">
              <input
                type="text"
                placeholder="Give your task a title"
                onChange={(e) => setTitle(e.target.value)}
              />
              <input
                type="text"
                placeholder="Description..."
                onChange={(e) => setDescription(e.target.value)}
              />
              <button type="submit" onClick={() => handleSubmit()}>
                Done
              </button>
            </div>
          )}

          <Droppable droppableId={props.column.id} type="task">
            {(provided, snapshot) => (
              <div
                ref={provided.innerRef}
                {...provided.droppableProps}
                isDraggingOver={snapshot.isDraggingOver}
              >
                {props.tasks.map((task, index) => (
                  <div key={task.id} onClick={() => handleEditTask(task)}>
                    <Task task={task} index={index} />
                  </div>
                ))}
                {provided.placeholder}
              </div>
            )}
          </Droppable>
        </div>
      )}
    </Draggable>
  );
};

export default Column;
