import { Database } from "../database.js";
import { randomUUID } from 'node:crypto';
import { buildRoutePath } from "../utils/build-route-path.js";
import { parse } from 'csv-parse';
import { csvImportServer } from "../../streams/csv-import-server.js";

const database = new Database();

export const routes = [
  {
    method: 'POST',
    path: buildRoutePath('/tasks'),
    handler: async (req, res) => {
      try {
        const message = await csvImportServer();
        return res.writeHead(201).end(message);
      } catch (error) {
        return res.writeHead(500).end('Error importing tasks');
      }
    }
  },
  {
    method: 'GET',
    path: buildRoutePath('/tasks'),
    handler: (req, res) => {
      const tasks = database.select('tasks');
      return res.end(JSON.stringify(tasks));
    }
  },
  {
    method: 'PUT',
    path: buildRoutePath('/tasks/:id'),
    handler: (req, res) => {
      const { id } = req.params;
      const { title, description } = req.body;

      if (title && description) {
        return res.writeHead(400).end('Only one field can be updated at a time');
      }
      const tasks = database.select('tasks');
      const task = tasks.find(task => task.id === id);

      if (!task) {
        return res.writeHead(404).end('Task not found');
      }
  
      database.update('tasks', id, {
        ...task,
        title: title || task.title,
        description: description || task.description,
        updated_at: (new Date().toUTCString()),
      });
      return res.writeHead(204).end();
    }
  },
  {
    method: 'DELETE',
    path: buildRoutePath('/tasks/:id'),
    handler: (req, res) => {
      const { id } = req.params;
      const task = database.select('tasks').find(task => task.id === id);

      if (!task) {
        return res.writeHead(404).end('Task not found');
      }

      database.delete('tasks', id);
      return res.writeHead(204).end();
    }
  },
  {
    method: 'PATCH',
    path: buildRoutePath('/tasks/:id/complete'),
    handler: (req, res) => {
      const { id } = req.params;
      const task = database.select('tasks').find(task => task.id === id);
      database.update('tasks', id, { ...task, completed_at: (new Date().toUTCString()) });
      return res.writeHead(204).end();
    }
  }
]