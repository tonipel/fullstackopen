const jwt = require('jsonwebtoken')
const blogsRouter = require('express').Router()
const Blog = require('../models/blog')
const User = require('../models/user')
const config = require('../utils/config')

blogsRouter.get('/', async (_request, response) => {
  const blogs = await Blog.find({}).populate('user')
  response.json(blogs.map(blog => blog.toJSON()))
})

blogsRouter.post('/', async (request, response, next) => {
  const decodedToken = jwt.verify(request.token, config.SECRET)
  if (!request.token && !decodedToken.id) {
    return response.status(401).json({ error: 'token missing or invalid' })
  }

  const user = await User.findById(decodedToken.id)
  let blog = new Blog(request.body)
  blog.user = user._id

  try {
    const result = await blog.save()
    user.blogs = user.blogs.concat(result._id)
    await user.save()

    response.status(201).json(result.toJSON())

  } catch(exception) {
    next(exception)
    response.status(400).end()
  }
})

blogsRouter.put('/:id', async (request, response, next) => {
  const blog = { likes: request.body.likes }

  try {
    const updatedBlog = await Blog.findByIdAndUpdate(request.params.id, blog, { new: true })
    response.json(updatedBlog.toJSON())
  } catch (exception) {
    next(exception)
    response.status(400).end()
  }
})

blogsRouter.delete('/:id', async (request, response) => {
  await Blog.findByIdAndRemove(request.params.id)
  response.status(204).end()
})

module.exports = blogsRouter
