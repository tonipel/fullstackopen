const mongoose = require('mongoose')
const supertest = require('supertest')
const app = require('../app')
const api = supertest(app)
const Blog = require('../models/blog')

const initialBlogs = [
  { title: 'React patterns', author: 'Michael Chan', url: 'https://reactpatterns.com/', likes: 7 },
  { title: 'Go To Statement Considered Harmful', author: 'Edsger W. Dijkstra', url: 'http://www.u.arizona.edu/~rubinson/copyright_violations/Go_To_Considered_Harmful.html', likes: 5 },
  { title: 'Canonical string reduction', author: 'Edsger W. Dijkstra', url: 'http://www.cs.utexas.edu/~EWD/transcriptions/EWD08xx/EWD808.html', likes: 12 },
  { title: 'First class tests', author: 'Robert C. Martin', url: 'http://blog.cleancoder.com/uncle-bob/2017/05/05/TestDefinitions.htmll', likes: 10 },
  { title: 'TDD harms architecture', author: 'Robert C. Martin', url: 'http://blog.cleancoder.com/uncle-bob/2017/03/03/TDD-Harms-Architecture.html', likes: 0 },
  { title: 'Type wars', author: 'Robert C. Martin', url: 'http://blog.cleancoder.com/uncle-bob/2016/05/01/TypeWars.html', likes: 2 }
]

beforeEach(async () => {
  await Blog.deleteMany({})

  let blogObject = new Blog(initialBlogs[0])
  await blogObject.save()
  blogObject = new Blog(initialBlogs[1])
  await blogObject.save()
  blogObject = new Blog(initialBlogs[2])
  await blogObject.save()
  blogObject = new Blog(initialBlogs[3])
  await blogObject.save()
  blogObject = new Blog(initialBlogs[4])
  await blogObject.save()
  blogObject = new Blog(initialBlogs[5])
  await blogObject.save()
})

test('blogs are returned as json', async () => {
  await api
    .get('/api/blogs')
    .expect(200)
    .expect('Content-Type', /application\/json/)
})

test('there are six blogs', async () => {
  const response = await api.get('/api/blogs')

  expect(response.body).toHaveLength(initialBlogs.length)
})

test('unique identifier is named id', async () => {
  const response = await api.get('/api/blogs')

  expect(response.body[0]).toHaveProperty('id')
  expect(response.body[0]).not.toHaveProperty('_id')
  expect(response.body[0].likes).toBe(7)
})

test('create new blog', async () => {
  const blog = {
    title: 'A good blog',
    author: 'Matti Meikäläinen',
    url: 'test.com',
    likes: 99
  }

  await api
    .post('/api/blogs')
    .send(blog)
    .expect(201)
    .expect('Content-Type', /application\/json/)

  const response = await api.get('/api/blogs')
  const titles = response.body.map(r => r.title)

  expect(response.body).toHaveLength(initialBlogs.length + 1)
  expect(titles).toContain(blog.title)
})

test('likes default to 0 if missing', async () => {
  const blogs = [
    {
      title: 'Likes missing',
      author: 'Matti Meikäläinen',
      url: 'test.com'
    },
    {
      title: 'Likes are added',
      author: 'Matti Meikäläinen',
      url: 'test.com',
      likes: 90
    }
  ]

  await api
    .post('/api/blogs')
    .send(blogs[0])
    .expect(201)
    .expect('Content-Type', /application\/json/)

  await api
    .post('/api/blogs')
    .send(blogs[1])
    .expect(201)
    .expect('Content-Type', /application\/json/)

  const response = await api.get('/api/blogs')

  let response_blog = response.body.find(b => b.title === 'Likes missing')
  expect(response_blog.likes).toBe(0)

  response_blog = response.body.find(b => b.title === 'Likes are added')
  expect(response_blog.likes).toBe(90)
})

test('missing title or url returns 400', async () => {
  const blogs = [
    {
      author: 'Matti Meikäläinen',
      url: 'title-missing.com',
      likes: 5
    },
    {
      title: 'url missing',
      author: 'Matti Meikäläinen',
      likes: 90
    }
  ]

  await api
    .post('/api/blogs')
    .send(blogs[0])
    .expect(400)

  await api
    .post('/api/blogs')
    .send(blogs[1])
    .expect(400)
})

afterAll(() => {
  mongoose.connection.close()
})
