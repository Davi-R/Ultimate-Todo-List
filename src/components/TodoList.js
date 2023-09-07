import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Form, Button, ListGroup } from 'react-bootstrap';
import LateralBar from './LateralBar';

function TodoList() {
  const [task, setTask] = useState('');
  const [tasks, setTasks] = useState([]);
  const [editIndex, setEditIndex] = useState(null);
  const [editTask, setEditTask] = useState('');
  const [listTitle, setListTitle] = useState('Minha Lista de Tarefas');
  const [currentListId, setCurrentListId] = useState(1); 
  const [oldtodo, setOldTodo] = useState(null);


  
  const addTask = () => {
    if (task) {
      const newTask = { text: task, completed: false };
      const updatedTasks = [...tasks, newTask];
      setTasks(updatedTasks);
      setTask('');
      saveDataToLocalStorage({ listTitle, tasks: updatedTasks }, currentListId);
    }
  };

  
  const removeTask = (index) => {
    const updatedTasks = [...tasks];
    updatedTasks.splice(index, 1);
    setTasks(updatedTasks);
    saveDataToLocalStorage({ listTitle, tasks: updatedTasks }, currentListId);
  };

  
  const toggleCompletion = (index) => {
    const updatedTasks = [...tasks];
    updatedTasks[index].completed = !updatedTasks[index].completed;
    setTasks(updatedTasks);
    saveDataToLocalStorage({ listTitle, tasks: updatedTasks }, currentListId);
  };

  
  const startEditing = (index) => {
    setEditIndex(index);
    setEditTask(tasks[index].text);
  };

  
  const saveEdit = (index) => {
    const updatedTasks = [...tasks];
    updatedTasks[index].text = editTask;
    setTasks(updatedTasks);
    setEditIndex(null);
    setEditTask('');
    saveDataToLocalStorage({ listTitle, tasks: updatedTasks }, currentListId);
  };

  
  const cancelEdit = () => {
    setEditIndex(null);
    setEditTask('');
  };

  
  const deleteCurrentList = () => {
    localStorage.removeItem(`todo${currentListId}`);
    switchToList('delete');
  };

  
  const handleSubmit = (e) => {
    e.preventDefault();
    addTask();
  };

  
  const saveDataToLocalStorage = (data, id) => {
    localStorage.setItem(`todo${id}`, JSON.stringify(data));
  };

  
  const loadDataFromLocalStorage = (id) => {
    const storedData = localStorage.getItem(`todo${id}`);
    if (storedData) {
      const parsedData = JSON.parse(storedData);
      setListTitle(parsedData.listTitle);
      setTasks(parsedData.tasks);
    }
  };

  useEffect(() => {
    loadDataFromLocalStorage(currentListId);
  }, [currentListId]);

  
  const handleListTitleDoubleClick = () => {
    setEditIndex(-1);
    setEditTask(listTitle);
  };

  
  const saveListTitleEdit = () => {
    setListTitle(editTask);
    saveDataToLocalStorage({ listTitle: editTask, tasks }, currentListId);
    setEditIndex(null);
    setEditTask('');
  };

  
  const cancelListTitleEdit = () => {
    setEditIndex(null);
    setEditTask('');
  };

  

  const switchToList = (id) => {
    if (id === 'delete'){
      setTasks([]); 
      setListTitle('Minha Lista de Tarefas'); 
      setEditIndex(null); 
    } else if (id !== oldtodo) {
      setCurrentListId(id);
      setTasks([]); 
      setListTitle('Minha Lista de Tarefas'); 
      setEditIndex(null); 
      setOldTodo(id); 
    }
  };

  return (
    <Container>
      <LateralBar switchToList={switchToList} deleteCurrentList={deleteCurrentList} />
      <Row>
        <Col>
          <h1 className={editIndex === -1 ? 'editing' : ''}>
            {editIndex === -1 ? (
              <>
                <input
                  type="text"
                  value={editTask}
                  onChange={(e) => setEditTask(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' && editTask.trim() !== '') {
                      saveListTitleEdit();
                    }
                  }}
                />
                <Button
                  className='btn-title-save'
                  variant="success"
                  size="sm"
                  onClick={saveListTitleEdit}
                  disabled={!editTask.trim()}
                >
                  Salvar
                </Button>
                <Button
                  className='btn-title-cancel'
                  variant="secondary"
                  size="sm"
                  onClick={cancelListTitleEdit}
                >
                  Cancelar
                </Button>
              </>
            ) : (
              <span onDoubleClick={handleListTitleDoubleClick}>{listTitle}</span>
            )}
          </h1>
          <Form onSubmit={handleSubmit}>
            <Form.Group controlId="taskInput">
              <Form.Control
                type="text"
                placeholder="Adicione uma tarefa"
                value={task}
                onChange={(e) => setTask(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' && task.trim() !== '') {
                    addTask();
                  }
                }}
              />
            </Form.Group>
            <Button
              className='btn-add-task'
              variant="primary"
              onClick={addTask}
              disabled={!task.trim()}
            >
              Adicionar Tarefa
            </Button>
          </Form>
          <br />
          <ListGroup>
            {tasks.map((taskItem, index) => (
              <ListGroup.Item
                key={index}
                className={taskItem.completed ? 'completed' : ''}
              >
                {editIndex === index ? (
                  <>
                    <Form.Control
                      type="text"
                      value={editTask}
                      onChange={(e) => setEditTask(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter' && editTask.trim() !== '') {
                          saveEdit(index);
                        }
                      }}
                    />
                    <Button
                      className='btn-task-save'
                      variant="success"
                      size="sm"
                      onClick={() => saveEdit(index)}
                      disabled={!editTask.trim()}
                    >
                      Salvar
                    </Button>
                    <Button
                      className='btn-task-cancel'
                      variant="secondary"
                      size="sm"
                      onClick={cancelEdit}
                    >
                      Cancelar
                    </Button>
                  </>
                ) : (
                  <>
                    <span onDoubleClick={() => startEditing(index)}>
                      {taskItem.text}
                    </span>
                    <Button
                      variant="success"
                      size="sm"
                      className="btn-check"
                      onClick={() => toggleCompletion(index)}
                    >
                      {taskItem.completed ? 'Desfazer' : 'Concluir'}
                    </Button>
                    <Button
                      variant="danger"
                      size="sm"
                      className="btn-remove-task"
                      onClick={() => removeTask(index)}
                    >
                      Remover
                    </Button>
                  </>
                )}
              </ListGroup.Item>
            ))}
          </ListGroup>
        </Col>
      </Row>
    </Container>
  );
}

export default TodoList;
