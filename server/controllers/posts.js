import mongoose from 'mongoose'
import postMessage from '../models/postMessage.js'

export const getPost = async (req, res) => {
  const { id } = req.params
  try {
    const post = await postMessage.findById(id)
    res.status(200).json(post)
  } catch (error) {
    res.status(404).json({ message: error.message })
  }
}

export const getPosts = async (req, res) => {
  const { page } = req.query
  try {
    const LIMIT = 6
    const startIndex = (Number(page) - 1) * LIMIT //get the starting index of every page
    const total = await postMessage.countDocuments({})
    const posts = await postMessage
      .find()
      .sort({ _id: -1 })
      .limit(LIMIT)
      .skip(startIndex)
    res.status(200).json({
      data: posts,
      currentPage: Number(page),
      numberOfPages: Math.ceil(total / LIMIT),
    })
  } catch (error) {
    res.status(404).json({ message: error.message })
  }
}

// Query -> /posts?page=1 -> page = 1
// Params -> /posts/123 -> id = 123

export const getPostsBySearch = async (req, res) => {
  const { searchQuery, tags } = req.query
  try {
    const title = new RegExp(searchQuery, 'i') //Test test TEST -> test

    const posts = await postMessage.find({
      $or: [{ title }, { tags: { $in: tags.split(',') } }],
    })

    res.json({ data: posts })
  } catch (error) {
    res.status(404).json({ message: error.message })
  }
}

export const createPost = async (req, res) => {
  const post = req.body

  const newPostMessage = new postMessage({
    ...post,
    creator: req.userId, //getting user id from middleware
    createdAt: new Date().toISOString(),
  })

  try {
    await newPostMessage.save()

    res.status(201).json(newPostMessage)
  } catch (error) {
    res.status(409).json({ message: error.message })
  }
}

export const updatePost = async (req, res) => {
  const { id: _id } = req.params
  const post = req.body

  if (!mongoose.Types.ObjectId.isValid(_id)) {
    //verifying if the id exists
    return res.status(404).send('No post with that id')
  }

  const updatedPost = await postMessage.findByIdAndUpdate(
    _id,
    { ...post, _id },
    {
      new: true,
    }
  )
  res.json(updatedPost)
}

export const deletePost = async (req, res) => {
  const { id } = req.params

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(404).send('No post with that id')
  }
  await postMessage.findByIdAndRemove(id)
  res.json({ message: 'Post deleted successfully' })
}

export const likePost = async (req, res) => {
  const { id } = req.params

  if (!req.userId) return res.json({ message: 'unauthenticated' })

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(404).send('No post with that id')
  }
  const post = await postMessage.findById(id)

  // finding the id in the likes array for that particular post
  const index = post.likes.findIndex((id) => id === String(req.userId))

  // if it is not in the likes array then like the post otherwise dislike the post through removing this id
  if (index === -1) {
    //like a post
    post.likes.push(req.userId)
  } else {
    //dislike a post
    post.likes = post.likes.filter((id) => id !== String(req.userId))
  }

  const updatedPost = await postMessage.findByIdAndUpdate(id, post, {
    new: true,
  })

  res.json(updatedPost)
}
export const commentPost = async (req, res) => {
  const { id } = req.params
  const { value } = req.body

  const post = await postMessage.findById(id)

  post.comments.push(value)

  const updatedPost = await postMessage.findByIdAndUpdate(id, post, {
    new: true,
  })

  res.json(updatedPost)
}
