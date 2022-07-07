import { Repository } from './Repository';

const repository = new Repository();

export class Service {
  // getting all todos
  async getTodos() {
    // return all todos
    return repository.findAll();
  }

  // getting a single todo
  async getTodo(id) {
    return repository.findById(id);
  }

  // creating a todo
  async createTodo(todo) {
    return repository.insert(todo);
  }

  // updating a todo
  async updateTodo(id) {
    return repository.update(id);
  }

  // deleting a todo
  async deleteTodo(id) {
    return repository.delete(id);
  }
}
