// CSS
import "./index.css";

// Drag and drop
import { Draggable } from "react-beautiful-dnd";

const Task = (props) => {
  return (
    <Draggable draggableId={props.task.id} index={props.index}>
      {(provided, snapshot) => (
        <div
          {...provided.draggableProps}
          {...provided.dragHandleProps}
          ref={provided.innerRef}
          isDragging={snapshot.isDragging}
          className="task-card"
        >
          <h4>{props.task.title}</h4>
          {props.task.content}
        </div>
      )}
    </Draggable>
  );
};

export default Task;
