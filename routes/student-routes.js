import express from 'express'

// const {check} = require('express-validator')

const studentRout = express.Router()
import {getUsers,login,singup, getStudentById} from '../controllers/students-controller.js'

studentRout.get('/' , getUsers)
studentRout.post('/signup' , singup)

studentRout.get('/:Sid' , getStudentById)


studentRout.post('/login'  , login)

export default studentRout

