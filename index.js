const express = require('express')
const bodyParser = require('body-parser')
const morgan = require('morgan')
const cors = require('cors') 

const app = express()

morgan.token('body', (req, res) => req.method === 'POST' && JSON.stringify(req.body))

app.use(cors())
app.use(bodyParser.json())
app.use(morgan(':method :url :status :res[content-length] - :response-time ms :body'))


let persons = [
    {
        name: "Arto Hellas",
        number: "040-123456",
        id: 1
    },
    {
        name: "Ada Lovelace",
        number: "39-44-5323523",
        id: 2
    },
    {
        name: "Dan Abramov",
        number: "12-43-234345",
        id: 3
    },
    {
        name: "Mary Poppendieck",
        number: "39-23-6423122",
        id: 4
    }
]

app.get('/api/persons', (req, res) => {
    res.json(persons)
})

app.get('/api/persons/:id', (req, res) => {
    const id = Number(req.params.id)
    const person = persons.find(person => person.id === id)
    if(person){
        res.json(person)
    }else{
        res.status(404).end()
    }
})

app.delete('/api/persons/:id', (req, res) => {
    const id = Number(req.params.id)
    persons = persons.filter(person => person.id !== id)
    res.status(204).end()
})

app.post('/api/persons', (req, res) => {
    const body = req.body
    const newId = Math.floor(Math.random() * 100000000)
    if(!body.name || !body.number){
        return res.status(400).json({
            error: 'name or number missing'
        })
    }
    if(persons.find(person => person.name === body.name)){
        return res.status(400).json({
            error: 'name must be unique'
        })
    }
    const newPerson = {
        name: body.name, 
        number: body.number, 
        id: newId
    }
    persons = persons.concat(newPerson)
    res.json(newPerson)
})

app.get('/info', (req, res) => {
    const count = persons.length
    const date = new Date()

    res.send(
        `<p>Phonebook has info for ${count} people</p>
         <p>${date}</p>`)
})

app.use((req, res) => res.status(404).send({error: 'unknown path'}))
const port = process.env.PORT || 3001

app.listen(port, () => console.log('running...'))

