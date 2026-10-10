import { useState } from "react";

// CSS
import "./index.css";

const EditTask = (props) => {
  const [title, setTitle] = useState(props.task.title);
  const [content, setContent] = useState(props.task.content);

  const handleClick = () => {
    const newTask = {
      id: props.task.id,
      title: title,
      content: content,
    };
    props.updateTask(newTask);
  };

  return (
    <div className="edit-task-container">
      <h3>Edit Task</h3>

      <span>
        <input
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="edit-title"
        />
      </span>

      <hr />

      <span>
        <p>Description:</p>
        <input
          type="text"
          value={content}
          onChange={(e) => setContent(e.target.value)}
          className="edit-content"
        />
      </span>

      <button type="submit" onClick={() => handleClick()}>
        Done
      </button>
    </div>
  );
};

export default EditTask;
