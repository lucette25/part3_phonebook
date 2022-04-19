require('dotenv').config()
const express = require('express')
const morgan = require('morgan')
const cors = require('cors')

const Person = require('./models/person')
//const { count } = require('./models/person')
const app = express()

app.use(express.json())
app.use(express.static('build'))
app.use(cors())


morgan.token('postData', (request) => {
  //if (request.method === 'POST')
   return  JSON.stringify(request.body);
});
app.use(
  morgan(
    ':method :url :status :res[content-length] - :response-time ms :postData'
  )
);




let persons=[
    { 
      "id": 1,
      "name": "Arto Hellas", 
      "number": "040-123456"
    },
    { 
      "id": 2,
      "name": "Ada Lovelace", 
      "number": "39-44-5323523"
    },
    { 
      "id": 3,
      "name": "Dan Abramov", 
      "number": "12-43-234345"
    },
    { 
      "id": 4,
      "name": "Mary Poppendieck", 
      "number": "39-23-6423122"
    }
]

app.get('/api/persons', (request, response,next) => {
    Person.find({}).then(persons => {
    response.json(persons)
  })
  .catch(error => next(error))
})

  app.get('/persons/info', (request, response) => {
    Person.countDocuments({},(error,count)=>{
    if(error){
      response.send(error)
    }
    const date=new Date()
    const info=`<p>Phonebook has info for ${count} people</p>
                    <p> ${date}</p>`
    
    response.send(info)
  })
  })

  app.get('/api/persons/:id', (request, response, next) => {
    Person.findById(request.params.id)
    .then(person => {
      if (person) {
        response.json(person)
      } else {
          response.status(404)
          response.send(`Id ${id} does not exist`);
      }
  })
  .catch(error => next(error))

})
   

  app.delete('/api/persons/:id', (request, response, next) => {
    Person.findByIdAndRemove(request.params.id)
    .then(result => {
      response.status(204).end()
    })
    .catch(error => next(error))
  })



  

  app.get('/', (req, res) => {
    res.send('<h1>Hello World!</h1>')
  })

  app.post('/api/persons', (request, response) => {
    const body = request.body
    if (body.content === "undefined") {
      return response.status(400).json({ error: 'content missing' })
    }
    const person = new Person( {
      name: body.name, 
      number: body.number,
    })

   person.save().then(savedPerson => {
    response.json(savedPerson)
  })
})


app.put('/api/persons/:id', (request, response, next) => {
  const body = request.body

  const person ={
    name: body.name, 
    number: body.number
  }

  Person.findByIdAndUpdate(request.params.id, person, { new: true })
    .then(updatedPerson => {
      response.json(updatedPerson)
    })
    .catch(error => next(error))
})
   



// handler of requests with unknown endpoint

const unknownEndpoint = (request, response) => {
  response.status(404).send({ error: 'unknown endpoint' })
}

app.use(unknownEndpoint)
const errorHandler = (error, request, response, next) => {
  console.error(error.message)

  if (error.name === 'CastError') {
    return response.status(400).send({ error: 'malformatted id' })
  } 
  next(error)
}

// this has to be the last loaded middleware.
app.use(errorHandler)
  //npm run dev
const PORT = process.env.PORT 
app.listen(PORT)
console.log(`Server running on port ${PORT}`)










//https://peaceful-everglades-70618.herokuapp.com/api/persons
//mongodb+srv://Momo:<password>@cluster0.iewk6.mongodb.net/myFirstDatabase?retryWrites=true&w=majority