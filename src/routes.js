import { Database } from "./database.js"
import { randomUUID } from "node:crypto"
import { buildRoutePath } from "./utils/build-route-path.js"
import { format } from "date-fns"


const database = new Database()

export const routes = [
    
    //GET: List all/List specific
    {
        method: 'GET',
        path: buildRoutePath('/tasks'),
        handler: (req,res) => {
            
            const queryObj = req.query
            const queryArray = Object.entries(queryObj)

            const tasks = database.select('tasks', queryArray.length > 0 ? queryArray : null)

            return res.end(JSON.stringify(tasks))
        }
    },

    //POST: Insert DB
    {
        method: 'POST',
        path: buildRoutePath('/tasks'),
        handler: (req,res) => {
            console.log(req.body)
            const { title, description } = req.body
            const currentDate = new Date()

            if(title && description){ 
                const task = {
                    id: randomUUID(),
                    title,
                    description,
                    completed_at: null, 
                    created_at: format(currentDate,'dd-MM-yyyy'),
                    updated_at: format(currentDate,'dd-MM-yyyy'),
                }

                database.insert('tasks', task)

                return res.writeHead(201).end()
            } else {
                return res.writeHead(422).end()
            }            
        }
    }
]