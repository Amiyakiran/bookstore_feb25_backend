//application middleware 


const applicationMiddleware = (req, res, next)=>{
    //logic
 console.log('inside application specific middleware');
 next()
 
}

module.exports = applicationMiddleware