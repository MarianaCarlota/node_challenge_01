import fs from 'node:fs/promises';

const databasePath = new URL('../database.json', import.meta.url);

export class Database {
  #database = {};
  
  constructor() {
    fs.readFile(databasePath, 'utf8').then(data => {
      this.#database = JSON.parse(data);
    }).catch(() => {
      this.#persist();
    })
  }
  
  #persist() {
    fs.writeFile(databasePath, JSON.stringify(this.#database))
  }

  select(table) {
    let data = this.#database[table] ?? [];
    return data;
  }

  insert(table, data) {
    if (Array.isArray(this.#database[table])) {
      this.#database[table].push(data);
    } else {
      this.#database[table] = [data];
    }

    this.#persist();
    return data;
  }

  update(table, id, data) {
    if (Array.isArray(this.#database[table])) {
      const rowIndex = this.#database[table].findIndex(item => item.id === id);
      if (rowIndex > -1) {
        this.#database[table][rowIndex] = { id, ...data };
        this.#persist();
      }
    }
  }

  delete(table, id) {
    const rowIndex = this.#database[table].findIndex(row => row.id === id);

    if (rowIndex > -1) {
      this.#database[table].splice(rowIndex, 1);
      this.#persist();
    }
  }
}