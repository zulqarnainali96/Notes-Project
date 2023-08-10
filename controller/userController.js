const User = require('../models/Users.js')
const Note = require('../models/Notes.js')
const asyncHandler = require('express-async-handler')
const bcrypt = require('bcrypt');

// desc GET All Users 
// @route GET /users
// @acess Private

const getAllUsers = asyncHandler(async (req, res) => {
    const users = await User.find().select('-password').lean()
    if (!users?.length) {
        return res.status(400).json({ message: 'No Users Found' })
    }
    res.json(users)
})

// desc Create User 
// @route POST /users
// @acess Private

const createUser = asyncHandler(async (req, res) => {
    const { username, password, roles } = req.body
    if (!username || !password || !Array.isArray(roles) || !roles?.length) {
        return res.status(400).json({ message: 'All fields are required' })
    }
    const duplicate = await User.findOne({ username }).lean().exec()
    if (duplicate) {
        return res.status(409).json({ message: 'Username already exist' })
    }
    const hashPassword = await bcrypt.hash(password, 10) // Salt rounds
    const userObject = { username, 'password': hashPassword, roles }
    const user = await User.create(userObject)
    if (user) {
        res.status(200).json({ message: 'New user created ' + username })
    } else {
        res.status(400).json({ message: 'invalid user data' })
    }

})

// desc Update User 
// @route PATCH /users// @acess Private

const updateUser = asyncHandler(async (req, res) => {
    const {id, username, roles, active, password} = req.body

    if (!id || !username || !password || !Array.isArray(roles) || !roles?.length || typeof active !== 'boolean') {
        return res.status(400).json({ message: 'All fields are required' })
    }
    const user = await User.findById(id).exec()
    console.log('user ', user)
    if(!user) {
        return res.status(400).json({ message : 'User not found'})
    }
    const duplicate = await User.findOne({ username }).lean().exec()
    if(duplicate && duplicate?._id.toString() !== id) {
        return res.status(409).json({ message : 'Duplicate user found'})
    } 
    user.username = username
    user.roles = roles,
    user.active = active
    if (password){
        user.password = await bcrypt.hash(password, 10) // Salt Rounds 
    }
    const updatedUser = await user.save()

    res.json({ message : 'User Updated ' + updatedUser.username})
})

// desc Delete User 
// @route DELETE /users
// @acess Private

const deleteUser = asyncHandler(async (req, res) => {
    const { id } = req.body
    if(!id) {
        return res.status(400).json({ message : 'user id required'})
    }
    const notes = await Note.findOne({user : id }).lean().exec()

    if(notes?.length){
        return res.status(400).json({ message : 'User has assigned notes'})
    }
    const user = await User.findById(id).exec()
    console.log('del User => ', user)

    if(!user) {
        return res.status(400).json({ message : 'User not found'})
    }
    const result = await user.deleteOne()

    const reply = 'Username ' + result?.username + ' with ID ' + result?._id + ' Deleted'

    res.json(reply)

})


module.exports = { getAllUsers, createUser, updateUser, deleteUser}