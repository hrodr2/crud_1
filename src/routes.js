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
    },

//PUT: Update
    {
        method: 'PUT',
        path: buildRoutePath('/tasks/:id'),
        handler: (req,res) => {
            const { id } = req.params
            const { title, description } = req.body
                        
            const currentDate = new Date()
            try{
                if(title && description){
                    const task = {
                    title,
                    description,
                    updated_at: format(currentDate,'dd-MM-yyyy') 
                    }
                    database.update('tasks', id, task)
                    return res.writeHead(204).end()

                } else if(title){
                    const task = {
                    title,
                    updated_at: format(currentDate,'dd-MM-yyyy') 
                    }
                    database.update('tasks', id, task)
                    return res.writeHead(204).end()

                } else if(description){
                    const task = {
                    description,
                    updated_at: format(currentDate,'dd-MM-yyyy') 
                    }
                    database.update('tasks', id, task)
                    return res.writeHead(204).end()
                } else{
                    return res.writeHead(422).end()
                }

            } catch {
                return res.writeHead(404).end()
            }             
        }

    },

//DELETE: Delete
    {
        method: 'DELETE',
        path: buildRoutePath('/tasks/:id'),
        handler: (req,res) => {
            const { id } = req.params
            
            try{
                database.delete('tasks', id)
                return res.writeHead(204).end()
            } catch {
                return res.writeHead(404).end()
            }
            

            
        }
    },

//PATCH: Complete
    {
        method: 'PATCH',
        path: buildRoutePath('/tasks/:id/complete'),
        handler: (req,res) => {
            const { id } = req.params                     
            const currentDate = new Date()
            
            try{
                const task = {
                    updated_at: format(currentDate,'dd-MM-yyyy'),
                    completed_at: format(currentDate,'dd-MM-yyyy') 
                }

                database.completeTask('tasks', id, task)
                return res.writeHead(204).end()
                 
            } catch {
                return res.writeHead(404).end()
            }             
        }        
    }
]