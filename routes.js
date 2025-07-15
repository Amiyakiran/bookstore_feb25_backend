//import express 
const express = require('express')
const userController = require('./controllers/userController.js')
const bookController = require('./controllers/bookController.js')
const jobController = require('./controllers/jobController.js')
const applicationController = require('./controllers/appController.js')
//import middleware 
const jwt = require('./middleware/jwtMiddleware.js')
const multerConfig = require('./middleware/multerMiddleware')
const pdfMulterConfig = require('./middleware/pdfMulterMiddleware.js')


//instance
const routes = new express.Router()

//path to register a user 
routes.post('/register', userController.registerController)

//path to login
routes.post('/login',userController.loginController)



//path to google login
routes.post('/google-login',userController.googleLoginController)



//path to get all home books 
routes.get('/home-books', bookController.homeBookController)


//path to get all jobs 
routes.get('/all-jobs', jobController.getAllJobsController)


//path to edit the profile
routes.put('/edit-profile',jwt, multerConfig.single('profile'), userController.updateProfileController)


//--------------------------USER-----------------------------

//Path to add Book 
routes.post('/add-book',jwt, multerConfig.array('uploadedImages',3), bookController.addBookController)

//path to get all books - user 
routes.get('/all-books-user', jwt , bookController.getAllBookUserController)


//path to view Book
routes.get('/view-book/:id', bookController.viewBookController)

//path to get all user added book 
routes.get('/all-user-added-books', jwt, bookController.getAllUserAddedBooksController)


//path to get all user brought book 
routes.get('/all-user-brought-books', jwt, bookController.getAllUserBroughtBooksController)


//path to delete a book 
routes.delete('/delete-book/:id', bookController.deleteABookController)

//path to add application
routes.post('/add-application',jwt,pdfMulterConfig.single('resume'), applicationController.addApplicationsController )

//path to make payment
routes.put('/make-payment', jwt, bookController.paymentController)

//-------------------------ADMIN ----------------------------

//path to get all books 
routes.get('/all-books', bookController.getAllBookController)

//path to approve the book
routes.put('/approve-Book/:id', bookController.approveBookController )

//path to get all users'
routes.get('/all-users', userController.getAllUserController)

//path to add new job
routes.post('/add-job', jobController.addJobController)


//path to delete Job 
routes.delete('/delete-job/:id', jobController.deleteJobController)

//path to get all applications
routes.get('/all-application', applicationController.getAllApplicationController)

//export 
module.exports = routes