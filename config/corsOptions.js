const allowedOrigins = require('./allowedOrigins')

const corsOptions = {
    origin : (origin,callback) => {
        if(allowedOrigins.indexOf(origin) !== -1 || !origin) {
            callback(null,true)
        } else {
            callback(new Error('orgin not allowed by CORS Error'))
        }
    },
    credential : true,
    optionssSuccessStatus : 200,

}

module.exports = corsOptions