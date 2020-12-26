import React from 'react'
import '@testing-library/jest-dom/extend-expect'
import { render, fireEvent } from '@testing-library/react'
import { getByText, prettyDOM } from '@testing-library/dom'
import Blog from './Blog'
import BlogForm from './BlogForm'

test('renders content and author, not url or likes', () => {
  const blog = {
    title: 'React patterns',
    author: 'Michael Chan',
    url: 'https://reactpatterns.com/',
    likes: 7123
  }

  const component = render(
    <Blog blog={blog} />
  )

  const div = component.container.querySelector('.blog')

  expect(div).toHaveTextContent(
    'React patterns',
    'Michael Chan'
  )

  expect(div).not.toHaveTextContent(
    'https://reactpatterns.com/',
    '7123'
  )
})

test('url and likes are shown when "view"-button is clicked', () => {
  const blog = {
    title: 'React patterns',
    author: 'Michael Chan',
    url: 'https://reactpatterns.com/',
    likes: 7123
  }

  const component = render(
    <Blog blog={blog} />
  )

  // make rest of the data visible
  const button = component.getByText('view')
  fireEvent.click(button)

  const div = component.container.querySelector('.blog')

  expect(div).toHaveTextContent(
    'https://reactpatterns.com/',
    '7123'
  )
})

test('likes are clicked twice, handleUpdate is called twice', () => {
  const blog = {
    title: 'React patterns',
    author: 'Michael Chan',
    url: 'https://reactpatterns.com/',
    likes: 7123
  }

  const mockHandler = jest.fn()

  const component = render(
    <Blog blog={blog}
      handleUpdate={mockHandler} />
  )

  // make rest of the data visible
  let button = component.getByText('view')
  fireEvent.click(button)

  button = component.getByText('like')
  fireEvent.click(button)
  fireEvent.click(button)

  expect(mockHandler.mock.calls).toHaveLength(2)
})

test('blogform calls event handler', () => {
  const createBlog = jest.fn()

  const component = render(
    <BlogForm createBlog={createBlog} />
  )

  const inputTitle = component.container.querySelector('input[name="title"]')
  const inputAuthor = component.container.querySelector('input[name="author"]')
  const inputUrl = component.container.querySelector('input[name="url"]')
  const form = component.container.querySelector('form')

  fireEvent.change(inputTitle, {
    target: { value: 'test title' }
  })
  fireEvent.change(inputAuthor, {
    target: { value: 'test author' }
  })
  fireEvent.change(inputUrl, {
    target: { value: 'test url' }
  })

  fireEvent.submit(form)

  expect(createBlog.mock.calls).toHaveLength(1)
  expect(createBlog.mock.calls[0][0].title).toBe('test title')
  expect(createBlog.mock.calls[0][0].author).toBe('test author')
  expect(createBlog.mock.calls[0][0].url).toBe('test url')
})
