require('dotenv').config()
const express = require('express')
const morgan = require('morgan')
const cors = require('cors')

const Person = require('./models/person')
const { count } = require('./models/person')
const app = express()

app.use(cors())
app.use(express.json())
app.use(express.static('build'))


morgan.token('postData', (request) => {
  if (request.method === 'POST') return  JSON.stringify(request.body);
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



  app.post('/api/persons', (request, response) => {
    const body = request.body
    const existName = (element) => element.name===body.name;
    const existNumber = (element) => element.number===body.number;
  
    if (!body.name || !body.number) {
      return response.status(400).json({ 
        error: 'Name or number missing' 
      })
    }
    
    if(persons.findIndex(existName)!==-1){
      return response.status(400).json({ 
        error: 'Name must be unique' 
      })
    }
    
    if(persons.findIndex(existNumber)!==-1){
        return response.status(400).json({ 
          error: 'Number must be unique' 
        })
      }
      
      const person = new Person( {
        name: body.name, 
        number: body.number
    })

     person.save().then(savedNote => {
      response.json(savedNote)
    })
  })


   

  //npm run dev
const PORT = process.env.PORT || 3001
app.listen(PORT)
console.log(`Server running on port ${PORT}`)


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




//https://peaceful-everglades-70618.herokuapp.com/api/persons
//mongodb+srv://Momo:<password>@cluster0.iewk6.mongodb.net/myFirstDatabase?retryWrites=true&w=majority