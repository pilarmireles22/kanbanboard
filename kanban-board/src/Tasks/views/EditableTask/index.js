import React, { useRef, useState } from "react";
import { Store } from "../../../Store";
import {
  NEW_TASK_ITEM
} from "../../actions";

export default function EditableTask({ task, stage, removeTask, updateTask }) {
  const { state, dispatch } = React.useContext(Store);

  const elementToEdit = useRef(null);
  const [title, setTitle] = useState(task.title || "");
  const [text, setText] = useState(task.text || "");
  const [isEditing, setIsEditing] = useState(task.editMode);
  const [showAnimation, setShowAnimation] = useState(false);
  let timer;

  function handleTitleChange(e) {
    setTitle(e.target.value);
  }

  function handleTextChange(e) {
    setText(e.target.value);
  }

  function handleTaskUpdate() {
    if (!title) {
      removeTask({ taskID: task.id, stage });
    }
    updateTask({
      taskID: '1',
      title,
      text,
      stage
    });
    setIsEditing(false);
    setShowAnimation(true);
    timer = setTimeout(() => {
      setShowAnimation(false);
      clearTimeout(timer);
    }, 600);
  }

  function handleEmptyTask() {
    task.title = title;
    task.text = text;
    if (!task.title) {
      removeTask({ taskID: task.id, stage });
    } else {
      setTitle(task.title);
      setText(task.text);
      task.stage = stage;
      setIsEditing(false);
      const payload = task;
      return dispatch({
        type: NEW_TASK_ITEM,
        payload
      });
    }
  }

  function handleKeyPress(event) {
    if (event.keyCode === 13) handleTaskUpdate();
    if (event.keyCode === 27) handleEmptyTask();
  }

  return (
    <div
      className={`${showAnimation && "saved"} task-item`}
      onDoubleClick={() => setIsEditing(true)}
    >
      {isEditing ? (
        <div ref={elementToEdit} className="input-group">
          <input
            className="form-control"
            type="text"
            placeholder="New title"
            value={title}
            onChange={handleTitleChange}
            autoFocus
          />
          <input
            className="form-control"
            type="text"
            placeholder="New description"
            value={text}
            onChange={handleTextChange}
          />
        </div>
      ) : (
        <div className="input-group">
          <div className="px-3 task-text">{task.title}</div>
          <div className="px-3 task-text">{task.text}</div>
        </div>
      )}
      <button onClick={handleEmptyTask}>Action</button>
      <button onClick={handleTaskUpdate}>Cancel</button>
    </div>
  );
}
