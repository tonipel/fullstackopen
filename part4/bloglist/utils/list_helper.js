const _ = require('lodash')

// eslint-disable-next-line no-unused-vars
const dummy = (_blogs) => {
  return 1
}

const totalLikes = (blogs) => {
  const total = blogs.reduce((s, p) => (
    { likes: s.likes + p.likes }
  ))
  return total.likes
}

const favoriteBlog = (blogs) => {
  const favorite = blogs.reduce(function(s, p) {
    return (s.likes > p.likes) ? s : p
  })
  return favorite
}

const mostBlogs = (blogs) => {
  // Use lodash to find the most common author
  const getId = ({ author }) => `${author}`

  const mostOccurring = _.get(_(blogs)
    .countBy(getId)
    .entries()
    // eslint-disable-next-line no-unused-vars
    .maxBy(([_, v]) => v), 0)

  const result = blogs.filter((o) => getId(o) === mostOccurring)

  return { author: result[0].author, blogs: result.length }
}

const mostLikes = (blogs) => {
  const result = blogs.reduce(function(acc, val){
    let o = acc.filter(function(obj){
      return obj.author === val.author
    }).pop() || { author: val.author, likes: 0 }

    o.likes += val.likes
    acc.push(o)
    return acc
  }, [])

  const favoriteAuthorData = favoriteBlog(result)
  return favoriteAuthorData
}


module.exports = {
  dummy,
  totalLikes,
  favoriteBlog,
  mostBlogs,
  mostLikes
}
