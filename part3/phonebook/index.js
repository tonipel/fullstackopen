const express = require('express')
const app = express()

app.use(express.json())

let persons = [
    {
      "name": "Arto Hellas",
      "number": "040-123456",
      "id": 1
    },
    {
      "name": "Ada Lovelace",
      "number": "39-44-5323523",
      "id": 2
    },
    {
      "name": "Dan Abramov",
      "number": "12-43-234345",
      "id": 3
    },
    {
      "name": "Mary Poppendieck",
      "number": "39-23-6423122",
      "id": 4
    }
]

app.get('/info', (reg, res) => {
    const date = new Date()
    res.send(`Phonebook has info for ${persons.length} people <br><br> ${date.toString()}`)
})

app.get('/api/persons', (reg, res) => {
    res.json(persons)
})

app.get('/api/persons/:id', (req, res) => {
  const id = Number(req.params.id)
  const person = persons.find(person => person.id === id)
  console.log(person)
  if (person) {
    res.json(person)
  } else {
    res.status(404).end()
  }
})

app.delete('/api/persons/:id', (req, res) => {
  const id = Number(req.params.id)
  persons = persons.filter(person => person.id !== id)
  console.log(id)
  res.status(202).end()
})

app.post('/api/persons', (req, res) => {
  const person = req.body

  if (!person.name) {
    return res.status(400).json({
      error: 'Name is missing'
    })
  } else if (!person.number) {
    return res.status(400).json({
      error: 'Number is missing'
    })
  } else if (persons.some(p => p.name === person.name)) {
    return res.status(400).json({
      error: 'Person is already in phonebook'
    })
  }

  const id = Math.floor(Math.random() * Math.floor(10000))
  person.id = id

  persons = persons.concat(person)

  res.json(person)
})

const PORT = 3001
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`)
})
