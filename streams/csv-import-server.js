import fs from 'node:fs';
import { parse } from 'csv-parse';
import { randomUUID } from 'node:crypto';
import path from 'node:path';
import { Database } from '../src/database.js';

const database = new Database();

export const csvImportServer = () => {
  return new Promise((resolve, reject) => {
    const filePath = path.join(process.cwd(), 'data', 'tasks.csv');
    const tasks = [];

    fs.createReadStream(filePath)
      .pipe(parse({ columns: true }))
      .on('data', (row) => {
        const task = {
          id: randomUUID(),
          title: row.title, 
          description: row.description,
          created_at: new Date().toUTCString(),
          updated_at: null,
          completed_at: null,
        };
        database.insert('tasks', task);
      })
      .on('end', () => {
        try {
          resolve('Tasks imported successfully');
        } catch (error) {
          reject(error);
        }
      })
      .on('error', (error) => {
        reject(error);
      });
  });
};
