import * as http from 'http';
import { Service } from './Service';
import { getReqData } from './utils';

const PORT = process.env.PORT || 5000;

const server = http.createServer(async (req, res) => {
  console.log(req.url, req.method);
  const headers = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'OPTIONS, POST, GET, PATCH',
    'Content-Type': 'application/json',
  };
  // /api/todos : GET
  if (req.url === '/api/todos' && req.method === 'GET') {
    const todos = await new Service().getTodos();
    res.writeHead(200, headers);
    res.end(JSON.stringify(todos));
  }

  // /api/todos/:id : GET
  else if (req.url.match(/\/api\/todos\/([0-9]+)/) && req.method === 'GET') {
    try {
      const id = req.url.split('/')[3];
      const todo = await new Service().getTodo(id);
      res.writeHead(200, headers);
      res.end(JSON.stringify(todo));
    } catch (error) {
      res.writeHead(404, headers);
      res.end(JSON.stringify({ message: error }));
    }
  }

  // /api/todos/:id : DELETE
  else if (req.url.match(/\/api\/todos\/([0-9]+)/) && req.method === 'DELETE') {
    try {
      const id = req.url.split('/')[3];
      const message = await new Service().deleteTodo(id);
      res.writeHead(200, headers);
      res.end(JSON.stringify({ message }));
    } catch (error) {
      res.writeHead(404, headers);
      res.end(JSON.stringify({ message: error }));
    }
  }

  // /api/todos/:id : UPDATE
  else if (req.url.match(/\/api\/todos\/([0-9]+)/) && req.method === 'POST') {
    try {
      const id = req.url.split('/')[3];

      const updated_todo = await new Service().updateTodo(id);
      res.writeHead(200, headers);
      res.end(JSON.stringify(updated_todo));
    } catch (error) {
      res.writeHead(404, headers);
      res.end(JSON.stringify({ message: error }));
    }
  }

  // /api/todos/ : POST
  else if (req.url === '/api/todos' && req.method === 'POST') {
    // get the data sent along
    const todo_data = await getReqData(req).then((res) => {
      console.log(res);
      return JSON.parse(res);
    });
    const todo = await new Service().createTodo(todo_data);
    res.writeHead(200, headers);
    res.end(JSON.stringify(todo));
  }

  // No route present
  else {
    res.writeHead(404, headers);
    res.end(JSON.stringify({ message: 'Route not found' }));
  }
});

server.listen(PORT, () => {
  console.log(`server started on port: ${PORT}`);
});
