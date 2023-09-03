const mongoose = require('mongoose')



const password = process.argv[2]

const url = `mongodb+srv://fullstack:${password}@webdev.diands3.mongodb.net/phonebookApp?retryWrites=true&w=majority`

mongoose.set(`strictQuery`, false)
mongoose.connect(url)

const personSchema = new mongoose.Schema({
    name: {
        type: String,
        minlength: 3,
        required: true
    },
    number: {
        type: String,
        minlength: 5,
        required: true
    }
})

const Person = mongoose.model('Person', personSchema)

if(process.argv.length < 3)
{
    console.log('give password as argument')
    process.exit(1)
} else if(process.argv.length >= 3 && process.argv.length < 4)
{
    Person.find({}).then(result => {
        result.forEach(person => {
            console.log(person.name,person.number)
        })
        mongoose.connection.close()
    })
} else
{
    const person = new Person({
        name: process.argv[3],
        number: process.argv[4],
    })

    person.save().then(result => {
        console.log(`Added ${person.name} number ${person.number} to phonebook`)
        mongoose.connection.close()
    })
}

/*person.save().then(result => {
    console.log(`Added ${person.name} number ${person.number} to phonebook`)
    mongoose.connection.close()
})*/
