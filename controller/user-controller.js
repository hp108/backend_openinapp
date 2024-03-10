import { validationResult } from "express-validator";
import jwt from "jsonwebtoken";
import { HttpError } from "../util/http-error.js";
import { User } from "../model/user-model.js";

export const signup = async(req,res,next)=>{
    try{
        const {errors} = validationResult(req.body)
        if(errors.length != 0 )
        {
            throw (new HttpError(JSON.stringify(errors),401))
        }
        const {phoneNumber,priority} = req.body;
        let user;
        try{
            user= await User.findOne({phoneNumber:phoneNumber})
        }
        catch(err)
        {
            throw (new HttpError(err.message,422));
        }
        if(user)
        {
            throw (new HttpError("user aldready exists, please enter new credentials",400))
        }
        else{
            try{
            user =  User({
                phoneNumber,
                priority
            })
            }
            catch(err)
            {
                throw (new HttpError(err.message,422));
            }
        }
        try{    
            await user.save()
        }
        catch(err)
        {
            throw (new HttpError(err.message,422))
        }
        let token;
        try{
        token = jwt.sign({userId:user.id},"secretkey")
        }
        catch(err)
        {
            throw new HttpError(err.message,403)
        }
        res.json({userId:user.id,token:token})
    }
    catch(err)
    {
      return next(new HttpError(err.message|| err || "an error occured",err.code||500));
    }
}

export const login = async(req,res,next)=>{

    const {errors} = validationResult(req)
    if(errors.length != 0)
    {
        return next(new HttpError(JSON.stringify(errors),401))
    }
    const {phoneNumber} = req.body
    let user;
    try{
        user = await User.findOne({phoneNumber:phoneNumber})
    }
    catch(err)
    {
        return next(new HttpError(err.message,422))
    }
    if(!user)
    {
        return next(new HttpError("invalid credentials please provide valid credentials",400))
    }
    let token;
    try{
        token = jwt.sign({userId:user.id},'secretkey')
        }
        catch(err)
        {
            return next(new HttpError(err.message,403))
        }
    res.json({userId:user.id,token:token})
}

export const getUsers=async (req,res,next)=>{
    let users;
    try{
         users = await User.find({priority},"-priority")
    }
    catch(err)
    {
        return next(new HttpError(err.message,422))
    }
    return res.json({users:users.map(user=> user.toObject({getters:true}))})
}