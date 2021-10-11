// GET /users
// Search users by username or email.

// GET /users/me
// Returns your user data

// GET /users/{id}
// Returns a single user

// PUT /users/me
// Changes your user data

// POST /users/me/avatar
// Changes profile avatar

// POST /users/account
// Registration

// POST /users/session
// Login

// DELETE /users/session
// Logout. If implemented with cookies, should set an empty cookie. Otherwise it should just remove the refresh token from the DB.

// POST /users/session/refresh
// Refresh session

import express from 'express'
import userModel from './schema.js'
import createHttpError from 'http-errors'

const userRouter = express.Router()

userRouter.get('/', async (req, res, next) => {
  try {
    //console.log("Hi Users👋")
    const users = await userModel.find()
    res.send(users)
  } catch (err) {
    next(err)
  }
})

userRouter.get('/me', async (req, res, next) => {
  try {
    res.send(req.user) //WHERE IS THIS USER COMNMING FROM???
  } catch (error) {
    next(error)
  }
})

userRouter.get('/:userId', async (req, res, next) => {
  try {
    const userId = req.params.userId
    const user = await userModel.findById(userId)
    if (user) {
      res.send(user)
    } else {
      next(createHttpError(404, `👻 User id ${userId} not found`))
    }
  } catch (error) {
    next(error)
  }
})

userRouter.put('/me', async (req, res, next) => {
  try {
    req.user.name = 'Whatever' // modify req.user with the fields coming from req.body
    await req.user.save()

    res.send()
  } catch (error) {
    next(error)
  }
})

userRouter.put('/userId', async (req, res, next) => {
  const userId = req.params.userId
  const modifedUser = await userModel.findByIdAndUpdate(userId, req.body, {
    new: true, // returns the modified user
  })
  if (modifiedUser) {
    res.send(modifiedUser)
  } else {
    next(createHttpError(404, `👻 User with id ${userId} not found`))
  }
})
export default userRouter
