const express = require('express');
const cors = require('cors');

const { v4: uuidv4 } = require('uuid');

const app = express();

app.use(cors());
app.use(express.json());

const users = [];

function checksExistsUserAccount(request, response, next) {
  const { username } = request.headers;

  if (!checksIfUsernameAlreadyExists(username)) {
    return response.status(404).json({ error: 'There is no user with this username.' });
  }

  return next()
}

function checkExistsTodo(request, response, next) {
  const { username } = request.headers;
  const { id } = request.params;

  const userIndex = users.findIndex(user => user.username === username);
  const todoIndex = users[userIndex].todos.findIndex(todo => todo.id === id);

  if (todoIndex === -1) {
    return response.status(404).json({ error: 'There is no todo with this id.' })
  }

  return next();
}

app.post('/users', (request, response) => {
  const { name, username } = request.body;

  if (checksIfUsernameAlreadyExists(username)) {
    return response.status(400).json({ error: 'There is already a user with this username.' });
  }

  const user = {
    id: uuidv4(),
    name,
    username,
    todos: []
  }

  users.push(user);

  return response.status(201).json(user);
});

app.get('/todos', checksExistsUserAccount, (request, response) => {
  const { username } = request.headers;
  const todos = getTodosByUsername(username);

  return response.status(200).json(...todos);
});

app.post('/todos', checksExistsUserAccount, (request, response) => {
  const { username } = request.headers;
  const { title, deadline } = request.body;

  const todo = {
    id: uuidv4(),
    title,
    done: false,
    deadline: new Date(deadline),
    created_at: new Date()
  };

  const userIndex = users.findIndex(user => user.username === username);

  users[userIndex].todos.push(todo);

  return response.status(201).json(todo);
});

app.put('/todos/:id', checksExistsUserAccount, checkExistsTodo, (request, response) => {
  const { username } = request.headers;
  const { id } = request.params;
  const { title, deadline } = request.body;

  const userIndex = users.findIndex(user => user.username === username);
  const todoIndex = users[userIndex].todos.findIndex(todo => todo.id === id);

  users[userIndex].todos[todoIndex] = {
    ...users[userIndex].todos[todoIndex],
    title,
    deadline
  };

  return response.status(200).json(users[userIndex].todos[todoIndex]);
});

app.patch('/todos/:id/done', checksExistsUserAccount, checkExistsTodo, (request, response) => {
  const { username } = request.headers;
  const { id } = request.params;

  const userIndex = users.findIndex(user => user.username === username);
  const todoIndex = users[userIndex].todos.findIndex(todo => todo.id === id);

  users[userIndex].todos[todoIndex] = {
    ...users[userIndex].todos[todoIndex],
    done: true
  };

  return response.status(200).json(users[userIndex].todos[todoIndex]);
});

app.delete('/todos/:id', checksExistsUserAccount, (request, response) => {
  // Complete aqui
});

function checksIfUsernameAlreadyExists(username) {
  return users.find(user => user.username === username)
}

function getTodosByUsername(username) {
  return users
    .filter(user => user.username === username)
    .map(user => user.todos);
}

module.exports = app;