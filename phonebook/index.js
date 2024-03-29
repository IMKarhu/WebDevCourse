require('dotenv').config()
const express = require('express')
const morgan = require('morgan')
const cors = require('cors')
const Person = require('./models/person')
const app = express()

app.use(express.json())
app.use(cors())
app.use(express.static('build'))

app.use(morgan((tokens,request,response) => {
  return [
    tokens.method(request,response),
    tokens.url(request,response),
    tokens.status(request,response),
    tokens.res(request,response, 'content-length'), '-',
    tokens['response-time'](request,response), 'ms',
    JSON.stringify(request.body)
  ].join(' ')
}))


  const generateId = (min,max) => {
    return Math.random() * (max-min) + min
  }
  
  app.get('/', (req, response) => {
    response.send('<h1>Hello World!</h1>')
  })
  
  app.get('/api/persons', (request, response, next) => {
    Person.find({}).then(persons => {
      if(persons)
      {
        response.json(persons)
      }
      else
      {
        response.status(404).end()
      }
    }).catch(error => next(error))
  })

  app.get('/api/persons/:id', (request, response, next) => {
    Person.findById(request.params.id).then(person => {
      if(person)
      {
        response.json(person)
      }
      else
      {
        response.status(404).end()
      }
    }).catch(error => next(error))
  })

  app.get('/info', (request, response, next) => {
    const timeStamp = new Date().toUTCString()
    Person.find({}).then(persons => {
      if(persons)
      {
        response.send(`phonebook has info for ${persons.length} people, ${timeStamp}`)

      }
      else
      {
        response.status(404).end()
      }
    }).catch(error => next(error))
  })

  app.delete('/api/persons/:id', (request, response, next) => {
    Person.findByIdAndRemove(request.params.id)
    .then(result => {
      response.status(204).end()
    })
    .catch(error => next(error))
  })

  app.post('/api/persons', (request, response, next) => {
    const body = request.body

    const person = new Person({
        name: body.name,
        number: body.number
    })

    person.save().then(savedPerson => {
      response.json(savedPerson)
    }).catch(error => next(error))
  })

    app.put('/api/persons/:id', (request, response, next) => {
      const { name, number } = request.body

      Person.findByIdAndUpdate(request.params.id, {name,number}, { runValidators: true, context: 'query'})
      .then(updatedPerson => {
        response.json(updatedPerson)
      })
      .catch(error => next(error))

      /*persons = persons.concat(person)
      person.save().then(savedPerson => {
      response.json(savedPerson)
      })*/
    })

  const errorHandler = (error, reguest, response, next) => {
    console.error(error.message)
  
    if(error.name === 'CastError')
    {
      return response.status(400).send({ error: 'malformatted id'})
    }
    else if(error.name === 'ValidationError')
    {
      return response.status(400).json({ error: error.message })
    }
  
    next(error)
  }
  
  app.use(errorHandler)

  const PORT = process.env.PORT
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`)
})
