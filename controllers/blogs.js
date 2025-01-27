const blogRouter = require('express').Router()
const Blog = require('../models/blog')
const { userExtractor } = require('../utils/middleware')

blogRouter.get('/', async (request, response) => {
  const blog = await Blog.find({}).populate('user', { name: 1, username: 1 })
  response.json(blog)
})

blogRouter.get('/:id', async (request, response) => {
  const blog = await Blog.findById(request.params.id).populate('user', {
    name: 1,
    username: 1,
  })
  blog
    ? response.json(blog)
    : response.status(404).json({ error: 'Blog no encontrado' })
})

blogRouter.post('/', userExtractor, async (request, response) => {
  const { title, author, url, likes } = request.body

  const user = request.user
  if (!user) {
    return response(401).json({ error: 'Usuario no autenticado' })
  }

  if (!title || !url || !author) {
    return response
      .status(400)
      .json({ error: 'title, author y url son requeridos' })
  }

  const blog = new Blog({
    title,
    author,
    url,
    likes: likes || 0,
    user: user._id,
  })

  const saveBlog = await blog.save()

  user.blogs = user.blogs.concat(saveBlog._id)
  await user.save()

  response.status(201).json(saveBlog)
})

blogRouter.put('/:id', async (request, response) => {
  const { title, author, url, likes } = request.body

  const updateBlog = await Blog.findByIdAndUpdate(
    request.params.id,
    { title, author, url, likes },
    { new: true, runValidators: true, context: 'query' }
  ).populate('user', { username: 1, name: 1 })

  if (updateBlog) {
    response.json(updateBlog)
  } else {
    response.status(404).json({ error: 'Blog no encontrado' })
  }
})

blogRouter.delete('/:id', async (request, response) => {
  await Blog.findByIdAndDelete(request.params.id)
  response.status(204).end()
})

module.exports = blogRouter
