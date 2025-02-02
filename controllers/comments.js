const Comment = require('../models/comment')
const Blog = require('../models/blog')
const commentsRouter = require('express').Router()

commentsRouter.get('/:id/comments', async (request, response) => {
  const blog = await Blog.findById(request.params.id).populate('comments', {
    content: 1,
  })

  if (!blog) {
    return response.status(404).json({ error: 'Blog no encontrado' })
  }

  response.json(blog.comments)
})

commentsRouter.post('/:id/comments', async (request, response) => {
  const { content } = request.body
  const blog = await Blog.findById(request.params.id)

  if (!blog) {
    return response.status(404).json({ error: 'Blog no encontrado' })
  }

  const comment = new Comment({
    content,
    blog: blog._id,
  })

  const savedComment = await comment.save()
  blog.comments = blog.comments.concat(savedComment._id)
  await blog.save()

  response.status(201).json(savedComment)
})

module.exports = commentsRouter
