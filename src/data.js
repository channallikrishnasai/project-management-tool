const data = {
  tasks: {
    "task-1": {
      id: "task-1",
      title: "Task 1",
      content:
        "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nulla placerat vestibulum quam sit amet vulputate.",
    },
    "task-2": {
      id: "task-2",
      title: "Task 2",
      content:
        "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nulla placerat vestibulum quam sit amet vulputate.",
    },
    "task-3": {
      id: "task-3",
      title: "Task 2",
      content:
        "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nulla placerat vestibulum quam sit amet vulputate.",
    },
    "task-4": {
      id: "task-4",
      title: "Task 4",
      content:
        "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nulla placerat vestibulum quam sit amet vulputate.",
    },
  },
  columns: {
    "column-1": { id: "column-1", title: "Todo", taskIds: ["task-1"] },
    "column-2": {
      id: "column-2",
      title: "In progress",
      taskIds: ["task-2", "task-3"],
    },
    "column-3": { id: "column-3", title: "Review", taskIds: ["task-4"] },
  },
  columnOrder: ["column-1", "column-2", "column-3"],
};

export default data;
