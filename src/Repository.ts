import { connection } from './connection';

export class Repository {
  async findAll() {
    const db = await connection();
    const [rows] = await db.query(
      `SELECT *
             FROM tasks`,
    );
    await db.end();
    return rows;
  }

  async findById(id) {
    const db = await connection();
    const [rows] = await db.query(
      `SELECT *
             FROM tasks
             WHERE id = ${id}`,
    );
    await db.end();
    return rows[0];
  }

  async insert(inputs: CreateTaskDto) {
    // const params = Object.values(inputs).map(value => value ?);
    const params = Object.values(inputs).map((value) =>
      value ? `"${value}"` : 'null',
    );
    const db = await connection();
    const query = `INSERT INTO tasks (title, startedAt, endedAt)
                       VALUES (${params})`;
    console.log(query);
    await db.query(query);
    await db.end();
    return this.findAll();
  }

  async update(id: number) {
    const db = await connection();
    console.log(id);
    await db.query(
      `UPDATE tasks
             SET isCompleted = IF(isCompleted = 1, 0, 1)
             WHERE id = ${id}`,
    );

    await db.end();
    return this.findAll();
  }

  async delete(id) {
    const db = await connection();
    await db.query(
      `DELETE
             FROM tasks
             WHERE id = ${id}`,
    );
    await db.end();
    return this.findAll();
  }
}

type CreateTaskDto = {
  title: string;
  startedAt?: Date;
  endedAt?: Date;
};
