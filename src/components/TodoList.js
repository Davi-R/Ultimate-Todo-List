import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Form, Button, ListGroup } from 'react-bootstrap';

function TodoList() {
  const [task, setTask] = useState('');
  const [tasks, setTasks] = useState([]);
  const [editIndex, setEditIndex] = useState(null);
  const [editTask, setEditTask] = useState('');
  const [listTitle, setListTitle] = useState('Minha Lista de Tarefas');

  // Função para adicionar uma tarefa
  const addTask = () => {
    if (task) {
      const newTask = { text: task, completed: false };
      const updatedTasks = [...tasks, newTask];
      setTasks(updatedTasks);
      setTask('');
      saveDataToLocalStorage({ listTitle, tasks: updatedTasks });
    }
  };

  // Função para remover uma tarefa
  const removeTask = (index) => {
    const updatedTasks = [...tasks];
    updatedTasks.splice(index, 1);
    setTasks(updatedTasks);
    saveDataToLocalStorage({ listTitle, tasks: updatedTasks });
  };

  // Função para alternar a conclusão de uma tarefa
  const toggleCompletion = (index) => {
    const updatedTasks = [...tasks];
    updatedTasks[index].completed = !updatedTasks[index].completed;
    setTasks(updatedTasks);
    saveDataToLocalStorage({ listTitle, tasks: updatedTasks });
  };

  // Função para iniciar a edição de uma tarefa
  const startEditing = (index) => {
    setEditIndex(index);
    setEditTask(tasks[index].text);
  };

  // Função para salvar a edição de uma tarefa
  const saveEdit = (index) => {
    const updatedTasks = [...tasks];
    updatedTasks[index].text = editTask;
    setTasks(updatedTasks);
    setEditIndex(null);
    setEditTask('');
    saveDataToLocalStorage({ listTitle, tasks: updatedTasks });
  };

  // Função para cancelar a edição de uma tarefa
  const cancelEdit = () => {
    setEditIndex(null);
    setEditTask('');
  };

  // Função para lidar com a submissão do formulário
  const handleSubmit = (e) => {
    e.preventDefault();
    addTask();
  };

  // Função para salvar os dados (título e tarefas) no Local Storage
  const saveDataToLocalStorage = (data) => {
    localStorage.setItem('todoData', JSON.stringify(data));
  };

  // Função para carregar os dados (título e tarefas) do Local Storage quando a aplicação iniciar
  const loadDataFromLocalStorage = () => {
    const storedData = localStorage.getItem('todoData');
    if (storedData) {
      const parsedData = JSON.parse(storedData);
      setListTitle(parsedData.listTitle);
      setTasks(parsedData.tasks);
    }
  };

  useEffect(() => {
    loadDataFromLocalStorage();
  }, []);

  // Função para lidar com a edição direta do título da lista
  const handleListTitleDoubleClick = () => {
    setEditIndex(-1);
    setEditTask(listTitle);
  };

  // Função para salvar a edição do título da lista
  const saveListTitleEdit = () => {
    setListTitle(editTask);
    saveDataToLocalStorage({ listTitle: editTask, tasks });
    setEditIndex(null);
    setEditTask('');
  };

  // Função para cancelar a edição do título da lista
  const cancelListTitleEdit = () => {
    setEditIndex(null);
    setEditTask('');
  };

  return (
    <Container>
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
                  variant="success"
                  size="sm"
                  onClick={saveListTitleEdit}
                  disabled={!editTask.trim()}
                >
                  Salvar
                </Button>
                <Button
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
                autoComplete="off"
              />
            </Form.Group>
            <Button
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
                      variant="success"
                      size="sm"
                      onClick={() => saveEdit(index)}
                      disabled={!editTask.trim()}
                    >
                      Salvar
                    </Button>
                    <Button
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
                      className="float-right"
                      onClick={() => toggleCompletion(index)}
                    >
                      {taskItem.completed ? 'Desfazer' : 'Concluir'}
                    </Button>
                    <Button
                      variant="danger"
                      size="sm"
                      className="float-right mr-2"
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

export default TodoList