const mongoose = require('mongoose')

const url = process.env.MONGODB_URI

mongoose.connect(url, { useNewUrlParser: true })

mongoose.set('useFindAndModify', false)

const personSchema = new mongoose.Schema({
    name: String,
    number: String
})

personSchema.set('toJSON', {
    transform: (document, person) => {
        person.id = person._id
        delete person._id
        delete person.__v
    }
})

module.exports = mongoose.model('Person', personSchema)
