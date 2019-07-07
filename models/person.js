const mongoose = require('mongoose')
const uniqueValidator = require('mongoose-unique-validator')

const url = process.env.MONGODB_URI

mongoose.connect(url, { useNewUrlParser: true })

mongoose.set('useFindAndModify', false)
mongoose.set('useCreateIndex', true)

const personSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        unique: true
    },
    number: String
})

personSchema.plugin(uniqueValidator)

personSchema.set('toJSON', {
    transform: (document, person) => {
        person.id = person._id
        delete person._id
        delete person.__v
    }
})

module.exports = mongoose.model('Person', personSchema)
