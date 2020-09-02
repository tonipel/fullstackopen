import React, { useState, useEffect } from 'react'
import BlogForm from './components/BlogForm'
import Blog from './components/Blog'
import Notification from './components/Notification'
import Togglable from './components/Togglable'
import blogService from './services/blogs'
import loginService from './services/login'

const App = () => {
  const [blogs, setBlogs] = useState([])
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [user, setUser] = useState(null)

  const [notificationMessage, setNotification] = useState(null)
  const [notificationStyle, setNotificationStyle] = useState()

  const handleNotification = (message, color) => {
    setNotification(message)
    setNotificationStyle(color)
    setTimeout(() => {
      setNotification(null)
    }, 3000)
  }

  const handleLogin = async (event) => {
    event.preventDefault()
    try {
      const user = await loginService.login({
        username, password,
      })

      window.localStorage.setItem(
        'loggedBlogappUser', JSON.stringify(user)
      )

      blogService.setToken(user.token)
      setUser(user)
      setUsername('')
      setPassword('')
    } catch (exception) {
      handleNotification('Wrong credentials', 'red')
    }
  }

  const handleLogout = (event) => {
    event.preventDefault()
    setUser(null)
    window.localStorage.removeItem('loggedBlogappUser')
  }

  useEffect(() => {
    blogService.getAll().then(blogs =>
      setBlogs( blogs )
    )  
  }, [])

  useEffect(() => {
    const loggedUserJson = window.localStorage.getItem('loggedBlogappUser')
    if (loggedUserJson) {
      const user = JSON.parse(loggedUserJson)
      setUser(user)
    }
  }, [])

  const createBlog = (blogObject) => {
    blogService
      .create(blogObject)
      .then(returnedBlog => {
        setBlogs(blogs.concat(returnedBlog))
        
        handleNotification(`New blog: ${returnedBlog.title} by ${returnedBlog.author} added`, 'green')
      })
  }

  const blogForm = () => {
    return (
      <>
        <div>
        <h2>blogs</h2>

        <Notification message={notificationMessage}
                      notificationStyle={notificationStyle}/>

        <div>
          {user.name} logged in
          <button type="button"
                  onClick={event => handleLogout(event)}>log out</button>
        </div>
        <br></br>
        {blogs.map(blog =>
          <Blog key={blog.id} blog={blog} />
        )}
        </div>
        <br></br>
        <div>
          <Togglable buttonLabel="add new blog">
            <BlogForm createBlog={createBlog}/>
          </Togglable>
        </div>
      </>
    )
  }

  const loginForm = () => (
    <div>
      <h2>
        Log in to application
      </h2>
    
      <Notification message={notificationMessage}
                    notificationStyle={notificationStyle}/>

      <form onSubmit={handleLogin}>
        <div>
          username
            <input
              type="text"
              value={username}
              name="Username"
              onChange={({ target }) => setUsername(target.value)}
          />
        </div>
        <div>
          password
            <input
              type="password"
              value={password}
              name="Password"
              onChange={({ target }) => setPassword(target.value)}
          />
        </div>
        <button type="submit">login</button>
      </form>
    </div>
  )

  if (user === null) {
    return loginForm()
  }
  return blogForm()
}

export default App