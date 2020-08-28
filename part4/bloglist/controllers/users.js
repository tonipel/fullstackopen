const bcrypt = require('bcrypt')
const usersRouter = require('express').Router()
const User = require('../models/user')

usersRouter.get('/', async (_request, response) => {
  const users = await User.find({}).populate('blogs')
  response.json(users.map(user => user.toJSON()))
})

usersRouter.post('/', async (request, response, next) => {
  const body = request.body

  if (body.password === undefined) {
    return response.status(400).json({ error: 'Password must be given' })
  } else if (body.password.length < 3) {
    return response.status(400).json({ error: 'Password is too short' })
  }

  const saltRounds = 10
  const passwordHash = await bcrypt.hash(body.password, saltRounds)

  const user = new User({
    username: body.username,
    name: body.name,
    passwordHash
  })

  try {
    const savedUser = await user.save()
    response.status(201).json(savedUser.toJSON())
  } catch (exception) {
    next(exception)
    response.status(400).json({ error: 'Username must be unique' })
  }
})

module.exports = usersRouter
