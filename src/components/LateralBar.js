import React, { useState, useEffect } from 'react';
import { Button, Container, Row, Col } from 'react-bootstrap';

const LateralBar = ({ switchToList, currentTodoId, deleteCurrentList}) => {
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
          onClick={() => handleTodoButtonClick(parseInt(id))}
          disabled={parseInt(id) === currentTodoId}
        >
          {listTitle}
        </Button>
      );
    });
  };

  const deletetodo = () => {
  const confirmation = window.confirm('Delete current Todo?')
  if (confirmation) {
    setShowSidebar(false);
    deleteCurrentList()
  }}
  return (
    <div>
      <Button variant="primary" onClick={toggleSidebar}>
        Abrir Barra Lateral
      </Button>

      {showSidebar && (
        <Container fluid className="sidebar">
          <Row>
            <Col>
              <div className="sidebar-content">
              <Button variant="danger" onClick={deletetodo}>
            Deletar Lista
          </Button>
                <Button onClick={createNewTodo}>Criar Nova Todo</Button>
                {renderTodoButtons()}
              </div>
            </Col>
          </Row>
        </Container>
      )}

      <style>
        {`
          .sidebar {
            position: fixed;
            top: 0;
            left: 0;
            width: 250px;
            height: 100%;
            background-color: #333;
            padding: 20px;
            z-index: 1000;
            overflow-y: auto;
            transition: transform 0.3s ease-in-out;
          }

          .sidebar-content {
            color: white;
          }
        `}
      </style>
    </div>
  );
};

export default LateralBar;
