import React from 'react'
import '@testing-library/jest-dom/extend-expect'
import { render, fireEvent } from '@testing-library/react'
import { prettyDOM } from '@testing-library/dom'
import Blog from './Blog'

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
