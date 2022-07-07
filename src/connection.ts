import { createConnection } from 'mysql2/promise';

export const connection = async () => {
  return createConnection({
    host: 'localhost',
    user: 'root',
    database: 'todo-list',
  });
};
