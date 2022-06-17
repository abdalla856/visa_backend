import express from 'express'

// const {check} = require('express-validator')

const clerkRout = express.Router()
import {login , getClerkById} from '../controllers/clerk-controller.js'

// clerkRout.get('/' , getUsers)


clerkRout.post('/clogin'  , login)
clerkRout.get('/:id',getClerkById)

export default clerkRout