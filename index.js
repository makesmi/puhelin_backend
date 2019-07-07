require('dotenv').config()

const express = require('express')
const bodyParser = require('body-parser')
const morgan = require('morgan')
const cors = require('cors') 

const app = express()

const Person = require('./models/person')

morgan.token('body', (req, res) => req.method === 'POST' && JSON.stringify(req.body))

app.use(cors())
app.use(bodyParser.json())
app.use(express.static('build'))
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

//minulla ainakaan ei tarvitse käsin kutsua person.toJSON() vaan se toimii automaattisesti

app.get('/api/persons', (req, res) => {
    Person.find({}).then(persons => res.json(persons))
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

app.delete('/api/persons/:id', (req, res, next) => {
    Person.findByIdAndRemove(req.params.id)
        .then(() => res.status(204).end())
        .catch(next)
})

app.post('/api/persons', (req, res) => {
    const body = req.body
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
    const newPerson = new Person({
        name: body.name, 
        number: body.number
    })

    newPerson.save().then(res.json.bind(res))
})

app.put('/api/persons/:id', (req, res, next) => {
    const person = (({name, number}) => ({name, number}))(req.body)
    Person.findByIdAndUpdate(req.params.id, person, { new: true })
        .then(res.json.bind(res))
        .catch(next)
})

app.get('/info', (req, res) => {
    const count = persons.length
    const date = new Date()

    res.send(
        `<p>Phonebook has info for ${count} people</p>
         <p>${date}</p>`)
})

app.use((req, res) => res.status(404).send({error: 'unknown path'}))

const errorHandler = (error, req, res, next) => {
    console.log(error)

    if(error.name === 'CastError' && error.kind == 'ObjectId'){
        return res.status(400).send({ error: 'malformatted id' })
    }

    next(error)
}

app.use(errorHandler)

const port = process.env.PORT || 3001

app.listen(port, () => console.log('running...'))

