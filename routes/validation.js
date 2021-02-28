const Joi = require('@hapi/joi');
const jwt  = require('jsonwebtoken');

const registerValidation = data => {
    const schema = Joi.object({
        name: Joi.string().min(6).required(),
        // email: Joi.string().min(6).email(),
        password:   Joi.string().min(6).required(),
        contact: Joi.string().min(9).required()
    });
    return schema.validate(data);
};

const loginValidation = data => {
    const schema = Joi.object({
        name: Joi.string().min(6).required(),
        password: Joi.string().min(6).required()
    });
    return schema.validate(data);
};

const isAdmin = token => {
    try {
        let result = jwt.verify(token, process.env.TOKEN_SECRET);
        return result.role === 'admin';
    } catch (error) {
        return {
            auth: false,
            message: error.message
        }
    }
    
    // return true;
    // console.log(result)

};

function authRole(role) {
    
    // console.log(token);
    return (req, res, next) => {
        let token = req.header('auth-token');
        try {
            let result = jwt.verify(token, process.env.TOKEN_SECRET);
            if(result.role !== role) {
                // return res.status(401).send('Not Allowed');
                return res.status(401).json({
                    message: 'Not Allowed'
                })
            }
            next()
        } catch (error) {
            res.status(401).json({
                message: error.message
            })
        }

        
        // if (req.user.role)
        // const token = req.header('auth-token');
        // console.log(token);
        // res.status(200).send('Allowed');
        // next()
    }
}

module.exports.registerValidation = registerValidation;
module.exports.loginValidation = loginValidation;
module.exports.isAdmin = isAdmin;
module.exports.authRole = authRole;