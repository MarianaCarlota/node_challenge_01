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
}