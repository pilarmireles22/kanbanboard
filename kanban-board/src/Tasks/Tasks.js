import React, { useState, useEffect } from "react";
import { Store } from "../Store";

import Stage from "./views/Stage";
import SearchForm from "./views/SearchForm";
import stages from "./stages";
import {
  UPDATE_TASKS,
  REMOVE_TASK,
  NEW_TASK_ITEM,
  UPDATE_TASK_ITEM,
  UPDATE_SEARCH_TERM
} from "./actions";
import { DragDropContext, Droppable } from "react-beautiful-dnd";
import { getListStyle, handleDragEnd } from "./utils/drag";
import Icon from "Components/Icon";
import CardLoader from "./CardLoader";
/** @jsx jsx */
import { jsx, css } from '@emotion/react'
import Modal from 'react-modal';
import EditableTask from "Tasks/views/EditableTask";

const customStyles = {
  content: {
    top: '50%',
    left: '50%',
    right: 'auto',
    bottom: 'auto',
    marginRight: '-50%',
    transform: 'translate(-50%, -50%)',
  },
};

function Tasks() {
  const { state, dispatch } = React.useContext(Store);
  const [hasLoaded, setHasLoaded] = useState(false);
  const [modalIsOpen, setIsOpen] = React.useState(false);
  const [modalTitle, setModalTitle] = React.useState("");
  const [modalKey, setModalKey] = React.useState("");
  const [modalAction, setModalAction] = React.useState("");

  function openModal() {
    setIsOpen(true);
  }

  function closeModal() {
    setIsOpen(false);
  }

  useEffect(() => {
    setTimeout(() => {
      setHasLoaded(true);
    }, 5000);
  }, []);

  const updateTasks = payload => {
    return dispatch({
      type: UPDATE_TASKS,
      payload
    });
  };

  const addEmptyTask = (key, title) => {
    openModal();
    setModalKey(key);
    setModalAction(title);
    setModalTitle("Add new task");
  };

  const updateTask = payload => {
    closeModal();
    // updateTasks();
    return dispatch({
      type: NEW_TASK_ITEM,
      payload
    });
  };
  const removeTask = payload => {
    closeModal();
    return dispatch({
      type: REMOVE_TASK,
      payload
    });
  };
  const updateSearchTerm = payload => {
    closeModal();
    return dispatch({
      type: UPDATE_SEARCH_TERM,
      payload
    });
  };
  const getList = key => state.tasks[key];
  const onDragEnd = result => handleDragEnd({ result, updateTasks, getList });
  const getStageData = key => {
    if (state.tasks.searchTerm === "") {
      return state.tasks[key];
    }
    return state.tasks[key].filter(t => {
      const filter = state.tasks.searchTerm.toUpperCase();
      if (t.text && t.text.toUpperCase().indexOf(filter) > -1) {
        return true;
      }
      return false;
    });
  };

  const addButton = css({
    color: "#8bc34a",
    cursor: "pointer"
  });

  return (
    <div className="Tasks">
      <SearchForm
        updateSearchTerm={updateSearchTerm}
        searchTerm={state.tasks.searchTerm}
      />
      <div className="py-4 row">
        <DragDropContext onDragEnd={onDragEnd}>
          {stages.map(({ key, title }) => (
            <>
              <div className={`col-md-${12 / stages.length}`} key={key}>
                {!hasLoaded &&
                  (<CardLoader>
                  </CardLoader>)
                }
                {hasLoaded &&
                  (<div className="px-3 py-3 bg-white rounded shadow-sm">
                    <div className="row px-2">
                      <div className="col-10">
                        <h2>{title}</h2>
                      </div>
                      <div className="col-2">
                        <div
                          css={addButton}
                          onClick={() => addEmptyTask(key, title)}
                        >
                          <Icon type="add" />
                        </div>
                      </div>
                    </div>
                    <Droppable droppableId={key}>
                      {(provided, snapshot) => (
                        <div
                          ref={provided.innerRef}
                          style={getListStyle(snapshot.isDraggingOver)}
                        >
                          <Stage
                            updateTask={updateTask}
                            removeTask={removeTask}
                            stage={key}
                            title={title}
                            data={getStageData(key)}
                          />
                          {provided.placeholder}
                        </div>
                      )}
                    </Droppable>
                  </div>
                  )}
              </div>
            </>
          ))}
        </DragDropContext>
      </div>
      {modalIsOpen &&
        <div>
          <Modal
            isOpen={modalIsOpen}
            onRequestClose={closeModal}
            style={customStyles}
          >
            <h2>{modalTitle}</h2>
            <EditableTask
              updateTask={updateTask}
              removeTask={removeTask}
              stage={modalKey}
              task={{ title: "", text: "", editMode: true }}
            />
          </Modal>
        </div>
      }
    </div>
  );
}

export default Tasks;
