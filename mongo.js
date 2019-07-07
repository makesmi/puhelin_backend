const mongoose = require('mongoose')

const argCount = process.argv.length

if(argCount < 3){
    console.log('too few arguments')
    process.exit(1)
}

const password = process.argv[2]
const url = `mongodb+srv://makesmi:${password}@cluster0-yst8a.mongodb.net/phonebook?retryWrites=true&w=majority`

mongoose.connect(url, { useNewUrlParser: true })

const personSchema = new mongoose.Schema({
    name: String,
    number: String
})

const Person = mongoose.model('Person', personSchema)

if(argCount === 5){
    const newName = process.argv[3]
    const newNumber = process.argv[4]

    const person = new Person({
        name: newName,
        number: newNumber
    })

    person.save().then(() => {
        console.log('saved')
        mongoose.connection.close()
    })
}else if(argCount === 3){
    console.log('phonebook:')
    Person.find({}).then(persons => {
        persons.forEach(person => {
            console.log(`${person.name} ${person.number}`)
        })
        mongoose.connection.close()
    })
}else{
    console.log('wrong number of parameters')
    mongoose.connection.close()
}