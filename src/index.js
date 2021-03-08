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
  // Complete aqui
});

app.put('/todos/:id', checksExistsUserAccount, (request, response) => {
  // Complete aqui
});

app.patch('/todos/:id/done', checksExistsUserAccount, (request, response) => {
  // Complete aqui
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