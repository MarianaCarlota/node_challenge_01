import { Database } from "../database";

const database = new Database();

export const routes = [
  {
    method: 'GET',
    path: buildRoutePath('/tasks'),
    handler: (req, res) => {

      const tasks = database.select('tasks');
      return res.end(JSON.stringify(tasks));
    }
  }
]