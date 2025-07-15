
const books = require('../model/bookModel')
const stripe = require('stripe')(process.env.STRIPESCRETKEY)

//add a book 
exports.addBookController = async (req, res) => {
  //logic
  //  console.log(req);

  const { title, author, publisher, language, noofopages, isbn, imageUrl, category, price, dprice, abstract } = req.body
  console.log(title, author, publisher, language, noofopages, isbn, imageUrl, category, price, dprice, abstract);

  console.log(req.files);
  console.log(req.payload);


  try {

    const existingBook = await books.findOne({ title, userMail: req.payload })
    if (existingBook) {
      res.status(401).json('Book Already exist')
    }
    else {
      const newBook = new books({
        title, author, publisher, language, noofopages, isbn, imageUrl, category, price, dprice, abstract, uploadedImages: req.files, userMail: req.payload
      })

      await newBook.save()
      res.status(200).json(newBook)
    }

  } catch (error) {
    res.status(500).json(error)
  }



}


//get home Books
exports.homeBookController = async (req, res) => {
  try {
    const allHomeBooks = await books.find().sort({ _id: -1 }).limit(4)
    res.status(200).json(allHomeBooks)

  } catch (error) {
    res.status(500).json(error)
  }
}


//get all books- userside 

exports.getAllBookUserController = async (req, res) => {
  const { search } = req.query
  console.log(search);

  const userMail = req.payload

  try {

    const query = {
      title: {
        $regex: search, $options: "i"
      },
      userMail: {
        $ne: userMail
      }
    }

    const allBooksUser = await books.find(query)
    res.status(200).json(allBooksUser)

  } catch (error) {
    res.status(500).json(error)
  }
}

//get a particular book 
exports.viewBookController = async (req, res) => {
  const { id } = req.params
  console.log(id);

  try {
    const specificBook = await books.findOne({ _id: id })
    res.status(200).json(specificBook)

  } catch (error) {
    res.status(500).json(error)
  }

}

//get all user added book 
exports.getAllUserAddedBooksController = async (req, res) => {
  const userMail = req.payload
  try {
    const allUserBooks = await books.find({ userMail })
    res.status(200).json(allUserBooks)

  } catch (error) {
    res.status(500).json(error)
  }
}


//get all user brought book 
exports.getAllUserBroughtBooksController = async (req, res) => {
  const userMail = req.payload
  try {
    const allUserBroughtBooks = await books.find({ BroughtBy: userMail })
    res.status(200).json(allUserBroughtBooks)

  } catch (error) {
    res.status(500).json(error)
  }
}

//to delete a particular book 
exports.deleteABookController = async (req, res) => {
  const { id } = req.params
  console.log(id);

  try {
    await books.findByIdAndDelete({ _id: id })
    res.status(200).json('deleted')

  } catch (error) {
    res.status(500).json(error)
  }
}


//make payment 
exports.paymentController = async (req, res) => {
  const email = req.payload
  console.log(email);

  const { bookDetails } = req.body
  console.log(bookDetails);

  try {
    const existingBook = await books.findByIdAndUpdate({ _id: bookDetails._id }, {
      title: bookDetails.title,
      author: bookDetails.author,
      publisher: bookDetails.publisher,
      language: bookDetails.language,
      noofopages: bookDetails.noofopages,
      isbn: bookDetails.isbn,
      imageUrl: bookDetails.imageUrl,
      category: bookDetails.category,
      price: bookDetails.price,
      dprice: bookDetails.dprice,
      abstract: bookDetails.abstract,
      uploadedImages: bookDetails.uploadedImages.filename,
      userMail: bookDetails.userMail,
      status: 'sold',
      BroughtBy: email

    }, { new: true })

    console.log(existingBook);

    const line_item = [{
      price_data: {
        currency: 'usd',//dollars
        product_data: {
          name: bookDetails.title,
          description: `${bookDetails.author} | ${bookDetails.publisher}`,
          images: [bookDetails.imageUrl],
          metadata: {
            title: bookDetails.title,
            author: bookDetails.author,
            publisher: bookDetails.publisher,
            language: bookDetails.language,
            noofopages: bookDetails.noofopages,
            isbn: bookDetails.isbn,
            imageUrl: bookDetails.imageUrl,
            category: bookDetails.category,
            price: `${bookDetails.price}`,
            dprice:`${ bookDetails.dprice}`,
            abstract: bookDetails.abstract.slice(0,20),
            //uploadedImages: bookDetails.uploadedImages,
            userMail: bookDetails.userMail,
            status: 'sold',
            BroughtBy: email
          }
        },
        unit_amount:Math.round(bookDetails.dprice*100) //cents -purchase amount
      },
      quantity:1
    }]

    console.log(line_item);
    
    // create a checkout session for stripe
    const session = await stripe.checkout.sessions.create({
      //payment types
      payment_method_types: ["card"],
      //details of the product that we are purchasing
      line_items: line_item,
      //mode of payment
      mode: 'payment',
      // payment is successfull
      // success_url: 'http://localhost:5173/payment-success',
      success_url: 'https://bookstore-feb25-frontend.vercel.app/payment-success',
      //payment is canceled or failed
      // cancel_url: 'http://localhost:5173/payment-error'
      cancel_url: 'https://bookstore-feb25-frontend.vercel.app/payment-error'

    })
    console.log(session);
    res.status(200).json({sessionId:session.id})
    


  } catch (error) {
    res.status(500).json(error)
  }


}

// --------------------------------------ADMIN -----------------------------

//to get all books
exports.getAllBookController = async (req, res) => {
  try {
    const allBooks = await books.find()
    res.status(200).json(allBooks)

  } catch (error) {
    res.status(500).json(error)
  }
}

//approve book 
exports.approveBookController = async (req, res) => {
  const { id } = req.params
  console.log(id);

  try {
    const existingBook = await books.findOne({ _id: id })

    const UpdatedBook = await books.findByIdAndUpdate({ _id: id }, {
      title: existingBook.title,
      author: existingBook.author,
      publisher: existingBook.publisher,
      language: existingBook.language,
      noofopages: existingBook.noofopages,
      isbn: existingBook.isbn,
      imageUrl: existingBook.imageUrl,
      category: existingBook.category,
      price: existingBook.price,
      dprice: existingBook.dprice,
      abstract: existingBook.abstract,
      uploadedImages: existingBook.uploadedImages,
      userMail: existingBook.userMail,
      status: 'Approved',
      BroughtBy: existingBook.BroughtBy
    }, { new: true })
    res.status(200).json(UpdatedBook)

  } catch (error) {
    res.status(500).json(error)
  }
}