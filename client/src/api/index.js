import axios from 'axios'

const API = axios.create({ baseURL: 'http://localhost:5000' })

// Adding authorization
// passing the token in api headers
API.interceptors.request.use((req) => {
  if (localStorage.getItem('profile')) {
    req.headers.Authorization = `Bearer ${
      JSON.parse(localStorage.getItem('profile')).token
    }`
  }
  return req
})

//otherwise direct send the token
// through the api call and in the backend api call get the token and
// decode then assign the user id to creator and then compare with user id
// to like and comment without any backend middleware
// but it is much better way.
export const fetchPost = (id) => API.get(`/posts/${id}`)
export const fetchPosts = (page) => API.get(`/posts?page=${page}`)
export const fetchPostsBySearch = (searchQuery) =>
  API.get(
    `/posts/search?searchQuery=${searchQuery.search || 'none'}&tags=${
      searchQuery.tags
    }`
  )
export const createPost = (newPost) => API.post('/posts', newPost)
export const updatePost = (id, updatedPost) =>
  API.patch(`/posts/${id}`, updatedPost)
export const deletePost = (id) => API.delete(`/posts/${id}`)
export const likePost = (id) => API.patch(`/posts/${id}/likePost`)
export const comment = (value, id) =>
  API.post(`/posts/${id}/commentPost`, { value })
export const signIn = (formData) => API.post('/user/signin', formData)
export const signUp = (formData) => API.post('/user/signup', formData)
