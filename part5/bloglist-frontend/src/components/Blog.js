import React, { useState } from 'react'

const Blog = ({ blog, userId, handleUpdate, handleDelete }) => {
  const [visible, setVisible] = useState(false)
  const [buttonName, setButtonName] = useState('view')

  const showWhenVisible = { display: visible ? '' : 'none' }

  let blogCreatorId = ''
  if (blog.user === undefined) {
    blogCreatorId = ''
  } else if (blog.user.id === undefined) {
    blogCreatorId = blog.user
  } else {
    blogCreatorId = blog.user.id
  }

  const isCreatedByUser = userId === blogCreatorId
  const showDeleteButton = { display: isCreatedByUser ? '' : 'none' }

  const toggleVisibility = () => {
    setVisible(!visible)
    setButtonName(visible ? 'view' : 'hide')
  }

  const blogStyle = {
    paddingTop: 10,
    paddingLeft: 2,
    border: 'solid',
    borderWidth: 1,
    marginBottom: 5
  }

  // Check for missing user in old blogs
  let username = 'Unknown'
  if (blog.user !== undefined) {
    username = blog.user.name
  }

  return (
    <div style={blogStyle}>
      <div>
        {blog.title} {blog.author}
        <button onClick={toggleVisibility}>{buttonName}</button>
      </div>
      <div style={showWhenVisible}>
        <div>
          {blog.url}
        </div>
        <div>
          {blog.likes}
          <button onClick={handleUpdate}>like</button>
        </div>
        <div>
          {username}
        </div>
        <div style={showDeleteButton}>
          <button onClick={handleDelete}>remove</button>
        </div>
      </div>
    </div>
  )
}

export default Blog
