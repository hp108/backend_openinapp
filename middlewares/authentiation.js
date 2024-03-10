import { HttpError } from '../util/http-error.js';
import jwt from 'jsonwebtoken'


export const checkAuth= (req,res,next)=>{

    try{
    const token = req.headers.authorization.split(' ')[1]
    if(!token)
    {
        throw (new HttpError('Authentication Failed',401));
    }
     const decodedToken = jwt.verify(token,'secretkey')
     req.body.userId = decodedToken.userId
     next()
    }
    catch(err)
    {
        return next(new HttpError("Authentiaction Failed",401))
    }
}