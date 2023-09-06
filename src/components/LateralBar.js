import React, { useState, useEffect } from 'react';
import { Button, Container, Row, Col } from 'react-bootstrap';

const LateralBar = ({ switchToList, currentTodoId }) => {
  const [showSidebar, setShowSidebar] = useState(false);
  const [localStorageKeys, setLocalStorageKeys] = useState([]);

  useEffect(() => {
    // Obtém as chaves do Local Storage
    const keys = Object.keys(localStorage);
    setLocalStorageKeys(keys);
  }, []);

  const toggleSidebar = () => {
    setShowSidebar(!showSidebar);

    // Ordenar as chaves em ordem alfabética quando a barra lateral for aberta
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
    // Encontre o ID mais alto
    const maxId = localStorageKeys.reduce((max, key) => {
      const id = parseInt(key.replace('todo', ''));
      return id > max ? id : max;
    }, 0);

    // Chame a função switchToList com o ID mais alto + 1
    switchToList(maxId + 1);

    // Feche a barra lateral quando o botão "Criar Nova Todo" for pressionado
    setShowSidebar(false);
  };

  const renderTodoButtons = () => {
    return localStorageKeys.map((key) => {
      const listTitle = JSON.parse(localStorage.getItem(key)).listTitle;
      const id = key.replace('todo', '');

      return (
        <Button
          key={key}
          onClick={() => switchToList(parseInt(id))}
          disabled={parseInt(id) === currentTodoId}
        >
          {listTitle}
        </Button>
      );
    });
  };

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
