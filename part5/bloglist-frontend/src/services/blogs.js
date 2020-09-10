import axios from 'axios'
const baseUrl = '/api/blogs'

let token = null

const setToken = newtoken => {
  token = `bearer ${newtoken}`
}

const getAll = () => {
  const request = axios.get(baseUrl)
  return request.then(response => response.data)
}

const create = async newObject => {
  const config = {
    headers: { Authorization: token },
  }

  const response = await axios.post(baseUrl, newObject, config)
  return response.data
}

const update = async updateObject => {
  const config = {
    headers: { Authorization: token }
  }

  const response = await axios.put(`${baseUrl}/${updateObject.id}`, updateObject, config)
  return response.data
}

export default { getAll, setToken, create, update }
