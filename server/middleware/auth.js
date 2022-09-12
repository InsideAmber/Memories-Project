import jwt from 'jsonwebtoken'

// wants to like a post
// click the like button => auth middleware (next)=> like controller...

const auth = async (req, res, next) => {
  try {
    // getting from the frontend api headers
    const token = req.headers.authorization.split(' ')[1]

    // logic for custom token
    const isCustomAuth = token.length < 500
    let decodedData

    if (token && isCustomAuth) {
      decodedData = jwt.verify(token, 'test')

      // sending the user id
      req.userId = decodedData?.id
    } else {
      decodedData = jwt.decode(token)

      // sending the user id
      req.userId = decodedData?.sub
    }
    next()
  } catch (error) {
    console.log(error)
  }
}

export default auth
