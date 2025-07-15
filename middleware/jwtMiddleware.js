//routes 
//------
const jwt = require('jsonwebtoken')

const jwtMiddleware = (req, res, next)=>{
    console.log('Inside jwt Middleware');
    const token = req.headers["authorization"].split(' ')[1]
   try {
    const jwtResponse = jwt.verify(token,process.env.JWTSECRETKEY)
    console.log(jwtResponse);
    req.payload = jwtResponse.userMail
    next()
    
    
   } catch (error) {
    res.status(401).json('Authorization failed',error)
   }

}

module.exports = jwtMiddleware