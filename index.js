const express = require('express')
const morgan = require('morgan')
const mongoose = require('mongoose')

const app = express()
const cors = require('cors')

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

const password="Momo"

//Mongo
const url =`mongodb+srv://Momo:${password}@cluster0.iewk6.mongodb.net/phonebookApp?retryWrites=true&w=majority`
mongoose.connect(url)

const personSchema = new mongoose.Schema({
    name: String, 
    number: String,
})

const Person = mongoose.model('Person', personSchema)

personSchema.set('toJSON', {
  transform: (document, returnedObject) => {
    returnedObject.id = returnedObject._id.toString()

    //In order to use string methodes to filter
    returnedObject.name = `${returnedObject.name}`
    returnedObject.number = `${returnedObject.number}`

    delete returnedObject._id
    delete returnedObject.__v
  }
})





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

app.get('/api/persons', (request, response) => {
    Person.find({}).then(persons => {
    response.json(persons)
  })  })

  app.get('/persons/info', (request, response) => {
    const numberPersons=persons.length
    const date=new Date()
    const info=`<p>Phonebook has info for ${numberPersons} people</p>
                    <p> ${date}</p>`
    
    response.send(info)
  })

  app.get('/api/persons/:id', (request, response) => {
    const id = Number(request.params.id)
    const person= persons.find(note => note.id === id)
    if (person) {
      response.json(person)

      

    } else {
        response.status(404)
        response.send(`Id ${id} does not exist`);
    }
  })
   

  app.delete('/api/persons/:id', (request, response) => {
    const id = Number(request.params.id)
    persons = persons.filter(person => person.id !== id)
    response.status(204).end()
  })

  const generateId = () =>  Math.floor(Math.random() * (1000- 10) + 10)


  



  
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
      
      const person = {
        id: generateId(),
        name: body.name, 
        number: body.number
    }

    
  
    persons = persons.concat(person)
    response.json(person)
  })


   

  //npm run dev
const PORT = process.env.PORT || 3001
app.listen(PORT)
console.log(`Server running on port ${PORT}`)



const unknownEndpoint = (request, response) => {
  response.status(404).send({ error: 'unknown endpoint' })
}

app.use(unknownEndpoint)





//https://peaceful-everglades-70618.herokuapp.com/api/persons
//mongodb+srv://Momo:<password>@cluster0.iewk6.mongodb.net/myFirstDatabase?retryWrites=true&w=majority