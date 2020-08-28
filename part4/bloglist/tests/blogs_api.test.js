const mongoose = require('mongoose')
const bcrypt = require('bcrypt')
const supertest = require('supertest')
const app = require('../app')
const api = supertest(app)
const Blog = require('../models/blog')
const User = require('../models/user')
const blogsRouter = require('../controllers/blogs')

const initialBlogs = [
  { title: 'React patterns', author: 'Michael Chan', url: 'https://reactpatterns.com/', likes: 7 },
  { title: 'Go To Statement Considered Harmful', author: 'Edsger W. Dijkstra', url: 'http://www.u.arizona.edu/~rubinson/copyright_violations/Go_To_Considered_Harmful.html', likes: 5 },
  { title: 'Canonical string reduction', author: 'Edsger W. Dijkstra', url: 'http://www.cs.utexas.edu/~EWD/transcriptions/EWD08xx/EWD808.html', likes: 12 },
  { title: 'First class tests', author: 'Robert C. Martin', url: 'http://blog.cleancoder.com/uncle-bob/2017/05/05/TestDefinitions.htmll', likes: 10 },
  { title: 'TDD harms architecture', author: 'Robert C. Martin', url: 'http://blog.cleancoder.com/uncle-bob/2017/03/03/TDD-Harms-Architecture.html', likes: 0 },
  { title: 'Type wars', author: 'Robert C. Martin', url: 'http://blog.cleancoder.com/uncle-bob/2016/05/01/TypeWars.html', likes: 2 }
]

describe('blogs api tests', () => {
  beforeEach(async () => {
    await Blog.deleteMany({})

    const blogs = initialBlogs.map(blog => new Blog(blog))
    const promises = blogs.map(blog => blog.save())
    await Promise.all(promises)
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

    const response_blog = response.body.find(b => b.title === 'React patterns')

    expect(response_blog).toHaveProperty('id')
    expect(response_blog).not.toHaveProperty('_id')
    expect(response_blog.likes).toBe(7)
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

  test('delete with id', async () => {
    let blogs = await Blog.find({})
    const blogToDelete = blogs[0]

    await api
      .delete(`/api/blogs/${blogToDelete.id}`)
      .expect(204)

    blogs = await Blog.find({})
    expect(blogs).toHaveLength(initialBlogs.length - 1)

    const titles = blogs.map(blog => blog.title)
    expect(titles).not.toContain(blogToDelete.title)

  })

  test('update blog', async () => {
    let blogs = await Blog.find({})
    let blogToUpdate = blogs.find(b => b.title === 'React patterns')

    expect(blogToUpdate.likes).toBe(7)

    blogToUpdate.likes = 50

    await api
      .put(`/api/blogs/${blogToUpdate.id}`)
      .send(blogToUpdate)
      .expect(200)
      .expect('Content-Type', /application\/json/)

    blogs = await Blog.find({})

    const updatedBlog = blogs.find(b => b.title === 'React patterns')

    expect(updatedBlog.likes).toBe(50)
  })
})

describe('users api tests', () => {
  beforeEach(async () => {
    await User.deleteMany({})

    const passwordHash = await bcrypt.hash('password', 10)
    const user = new User({ username: 'root', passwordHash })

    await user.save()
  })

  test('users are returned as json', async () => {
    await api
      .get('/api/users')
      .expect(200)
      .expect('Content-Type', /application\/json/)
  })

  test('user creation', async () => {
    const initialUsers = await User.find({})

    const newUser = {
      username: 'testuser',
      name: 'Test User',
      password: 'salasana'
    }

    await api
      .post('/api/users')
      .send(newUser)
      .expect(201)
      .expect('Content-Type', /application\/json/)

    const users = await User.find({})
    expect(users).toHaveLength(initialUsers.length + 1)

    const usernames = users.map(user => user.username)
    expect(usernames).toContain(newUser.username)
  })

  test('user creation fails if username exists already', async () => {
    const initialUsers = await User.find({})

    const newUser = {
      username: 'root',
      name: 'Root User',
      password: 'salasana'
    }

    const result = await api
      .post('/api/users')
      .send(newUser)
      .expect(400)

    expect(result.body.error).toContain('Username must be unique')

    const users = await User.find({})
    expect(users).toHaveLength(initialUsers.length)
  })

  test('user creation fails password is too short or does not exist', async () => {
    const initialUsers = await User.find({})

    let newUser = {
      username: 'root',
      name: 'Root User'
    }

    let result = await api
      .post('/api/users')
      .send(newUser)
      .expect(400)

    expect(result.body.error).toContain('Password must be given')

    newUser = {
      username: 'root',
      name: 'Root User',
      password: 's'
    }

    result = await api
      .post('/api/users')
      .send(newUser)
      .expect(400)

    expect(result.body.error).toContain('Password is too short')

    const users = await User.find({})
    expect(users).toHaveLength(initialUsers.length)
  })
})

describe('login api tests', () => {
  beforeEach(async () => {
    await User.deleteMany({})

    const passwordHash = await bcrypt.hash('password', 10)
    const user = new User({ username: 'root', passwordHash })

    await user.save()
  })

  test('valid login', async () => {
    const newUser = {
      username: 'testuser',
      name: 'Test User',
      password: 'salasana'
    }

    await api
      .post('/api/users')
      .send(newUser)
      .expect(201)

    const loginUser = {
      username: 'testuser',
      password: 'salasana'
    }

    await api
      .post('/api/login')
      .send(loginUser)
      .expect(200)
  })

  test('invalid login', async () => {
    const newUser = {
      username: 'testuser',
      name: 'Test User',
      password: 'salasana'
    }

    await api
      .post('/api/users')
      .send(newUser)
      .expect(201)

    const loginUser = {
      username: 'testuser',
      password: 'väärä salasana'
    }

    await api
      .post('/api/login')
      .send(loginUser)
      .expect(401)
  })
})

afterAll(() => {
  mongoose.connection.close()
})
