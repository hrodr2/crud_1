import fs from 'node:fs/promises'

const databasePath = new URL('../db.json', import.meta.url)

export class Database{
    #database = {}

    constructor (){
        fs.readFile(databasePath, 'utf-8')
        .then(data => {
            this.#database = JSON.parse(data)
        })
        .catch(() => {
            this.#persist()
        })
    }

    #persist () {
        fs.writeFile(databasePath,JSON.stringify(this.#database))
    }

    select (table, searchArray) {
        let data = this.#database[table] ?? []
       
        if(searchArray){
            data = data.filter(row => {
                return searchArray.some(([key, value]) => {
                    return row[key] ? String(row[key]).toLowerCase().includes(value.toLowerCase()) : false
                })
            })
        }

        return data
    }

    insert (table, data) {
        if(Array.isArray(this. #database[table])){
            this.#database[table].push(data)
        } else {
            this.#database[table] = [data]
        }

        this.#persist()
        return data
    }

    update (table, id, data){                   
        const rowIndex = this.#database[table].findIndex(row => row.id == id)


        if(rowIndex > -1){
            const searchQuery = this.#database[table][rowIndex]

            this.#database[table][rowIndex] = { id, ...searchQuery, ...data}

            this.#persist()
        } else {
            throw new Error();
        }
    }

    delete (table, id){
        const rowIndex = this.#database[table].findIndex(row => row.id == id)

        if(rowIndex > -1){
            this.#database[table].splice(rowIndex, 1)
            this.#persist()
        } else {
            throw new Error();
        }
    }

    completeTask (table, id, data){                   
        const rowIndex = this.#database[table].findIndex(row => row.id == id)


        if(rowIndex > -1){
            const searchQuery = this.#database[table][rowIndex]

            this.#database[table][rowIndex] = { id, ...searchQuery, ...data}

            this.#persist()
        } else {
            throw new Error();
        }
    }
}