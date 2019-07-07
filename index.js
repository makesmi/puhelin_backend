require('dotenv').config()

const express = require('express')
const bodyParser = require('body-parser')
const morgan = require('morgan')
const cors = require('cors')

const app = express()

const Person = require('./models/person')

morgan.token('body', req => req.method === 'POST' && JSON.stringify(req.body))

app.use(cors())
app.use(bodyParser.json())
app.use(express.static('build'))
app.use(morgan(':method :url :status :res[content-length] - :response-time ms :body'))



//minulla ainakaan ei tarvitse käsin kutsua person.toJSON() vaan se toimii automaattisesti

app.get('/api/persons', (req, res) => {
    Person.find({}).then(persons => res.json(persons))
})

app.get('/api/persons/:id', (req, res, next) => {
    Person.findById(req.params.id)
        .then(person => person ? res.json(person) : res.status(404).end())
        .catch(next)
})

app.delete('/api/persons/:id', (req, res, next) => {
    Person.findByIdAndRemove(req.params.id)
        .then(() => res.status(204).end())
        .catch(next)
})

app.post('/api/persons', (req, res, next) => {
    const body = req.body
    if(!body.name || !body.number){
        return res.status(400).json({
            error: 'name or number missing'
        })
    }
    const newPerson = new Person({
        name: body.name,
        number: body.number
    })

    newPerson.save()
        .then(res.json.bind(res))
        .catch(next)
})

app.put('/api/persons/:id', (req, res, next) => {
    const person = (({ name, number }) => ({ name, number }))(req.body)
    Person.findByIdAndUpdate(req.params.id, person, { new: true })
        .then(res.json.bind(res))
        .catch(next)
})

app.get('/info', (req, res) => {
    Person.countDocuments({})
        .then(count => {
            const date = new Date()

            res.send(
                `<p>Phonebook has info for ${count} people</p>
                <p>${date}</p>`)
        })
})

app.use((req, res) => res.status(404).send({ error: 'unknown path' }))

const errorHandler = (error, req, res, next) => {
    console.log(error)

    if(error.name === 'CastError' && error.kind === 'ObjectId'){
        return res.status(400).send({ error: 'malformatted id' })
    }else if(error.name === 'ValidationError'){
        return res.status(400).send({ error: error.message })
    }

    next(error)
}

app.use(errorHandler)

const port = process.env.PORT || 3001

app.listen(port, () => console.log('running...'))

