import React, { useState, useEffect } from 'react';
import { Button, Container, Row, Col } from 'react-bootstrap';

const LateralBar = ({ switchToList, currentTodoId, deleteCurrentList }) => {
  const [showSidebar, setShowSidebar] = useState(false);
  const [localStorageKeys, setLocalStorageKeys] = useState([]);

  useEffect(() => {
    const keys = Object.keys(localStorage);
    setLocalStorageKeys(keys);
  }, []);

  const toggleSidebar = () => {
    setShowSidebar(!showSidebar);

    if (!showSidebar) {
      const keys = Object.keys(localStorage);
      keys.sort((a, b) => {
        const titleA = JSON.parse(localStorage.getItem(a)).listTitle.toLowerCase();
        const titleB = JSON.parse(localStorage.getItem(b)).listTitle.toLowerCase();
        return titleA.localeCompare(titleB);
      });
      setLocalStorageKeys(keys);
    }
  };

  const createNewTodo = () => {
    const maxId = localStorageKeys.reduce((max, key) => {
      const id = parseInt(key.replace('todo', ''));
      return id > max ? id : max;
    }, 0);

    switchToList(maxId + 1);

    setShowSidebar(false);
  };

  const handleTodoButtonClick = (id) => {
    switchToList(id);

    setShowSidebar(false);
  };

  const renderTodoButtons = () => {
    return localStorageKeys.map((key) => {
      const listTitle = JSON.parse(localStorage.getItem(key)).listTitle;
      const id = key.replace('todo', '');

      return (
        <Button
          key={key}
          className="btn-todos"
          onClick={() => handleTodoButtonClick(parseInt(id))}
          disabled={parseInt(id) === currentTodoId}
        >
          {listTitle}
        </Button>
      );
    });
  };

  const deleteTodo = () => {
    const confirmation = window.confirm('Delete current Todo?');
    if (confirmation) {
      setShowSidebar(false);
      deleteCurrentList();
    }
  };

  return (
    <div>
      <div className='btn-bar-div'>
        <Button onClick={toggleSidebar} className='btn-bar'>
          <i class="bi bi-arrow-bar-right"></i>
        </Button>
      </div>

      {showSidebar && (
        <Container fluid className="sidebar">
          <Row>
            <Col>
            <div className='btn-bar-div-close'>
              <Button onClick={toggleSidebar} className='btn-bar'>
                <i class="bi bi-arrow-bar-left"></i>
              </Button></div>
              <div>
                <Button className="btn-delete-todo" onClick={deleteTodo}>
                  Deletar Lista
                </Button>
                <Button className="btn-create-todo" onClick={createNewTodo}>
                  Criar Nova Todo
                </Button>
                {renderTodoButtons()}
              </div>
            </Col>
          </Row>
        </Container>
      )}
    </div>
  );
};

export default LateralBar;
