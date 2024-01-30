import {asyncHandler} from '../../../utils/errorHandling.js'
import generateConfirmEmail from '../../../utils/genrateConfirmEMail.js'
import {hash,compare} from '../../../utils/HashAndCompare.js'
import User from '../../../../DB/model/User.model.js'
import { generateToken, verifyToken } from '../../../utils/GenerateAndVerifyToken.js';
import { nanoid, customAlphabet } from 'nanoid';
import sendEmail from '../../../utils/email.js';

export const signUp=asyncHandler(async(req,res,next)=>{
    const {email,userName,password}=req.body;
    if(await User.findOne({email:email.toLowerCase()})){
        return next(new Error("email already exist",{cause:409}));
    }
    await generateConfirmEmail(email,req);
    const hashedPassword=hash({plaintext:password,salt:9});
    req.body.password=hashedPassword;
    const user =await User.create({...req.body});
    res.status(201).json({message:"Done",_id:user._id});
});

export const confirmEmail=asyncHandler(async(req,res,next)=>{
    const {confirmationToken}=req.params;
    const {email}=verifyToken({token:confirmationToken});
    if (!email) {
        return next(new Error("in-valid token payload"));
    }
    const user = await User.updateOne({email},{confirmEmail:true});
    if(!user.matchedCount){
        return next(new Error("in-valid email"))
    }
    return res.status(200).json({message:"Done"})
});

export const unsubscribe=asyncHandler(async(req,res,next)=>{
    const {newConfirmToken}=req.params;
    const {email}=verifyToken({token:newConfirmToken});
    if (!email) {
        return next(new Error("in-valid token payload"));
    }
    const user = await User.deleteOne({email});
    if (user.confirmEmail) {
        return next(new Error("sorry email was confirmed"));
    }
    if(!user.deletedCount){
        return next(new Error("in-valid email"))
    }
    return res.status(200).json({message:"Done"})
});

export const requestNewConfirmMail = asyncHandler(async(req,res,next)=>{
    const {newConfirmToken}=req.params;
    const {email}=verifyToken({token:newConfirmToken});
    if (!email) {
        return next(new Error("in-valid token payload"));
    }
    const user =await User.findOne({email:email.toLowerCase()});
    if (!user) {
        return next(new Error("not register account"),{cause:404});
    }
    if (user.confirmEmail) {
        return next(new Error("email is already confirmed"));
    }
    generateConfirmEmail(email,req);
    return res.status(200).json({message:"check your inbox"});
});

export const logIn =asyncHandler(async(req,res,next)=>{
    const {email,password}=req.body;
    const user=await User.findOne({email:email.toLowerCase()});

    if(!user){
        return next(new Error("not register account",{cause:404}));
    }

    if(!compare({plaintext:password,hashValue:user.password})){
        return next(new Error("in-valid login data"),{cause:400});
    }

    if (!user.confirmEmail) {
        generateConfirmEmail(email,req);
        return next(new Error("please confirm your email"),{cause:400});
    }
    const accessToken =generateToken({payload:{id:user._id,role:user.role,userName:user.userName},expiresIn:60*30});
    const refreshToken=generateToken({payload:{id:user._id,role:user.role,userName:user.userName},expiresIn:60*60*24*30*365});
    user.active="online";
    await user.save();
    res.status(200).json({message:"Done",accessToken,refreshToken});
});

export const sendCode =asyncHandler(async(req,res,next)=>{
    const {email}=req.body;
    const nanoId=customAlphabet("0123456789",6);
    const user =await User.findOneAndUpdate({email:email.toLowerCase()},{forgetCode:nanoId()},{ new:true});
    if (!user) {
        return next(new Error("not register account"),{cause:404});
    }
    const html= `
                <br/>
                <br/>
                <p>code for reset password</p>
                <p>${user.forgetCode}</p>
                <br/>
                <br/>`;
    await sendEmail({to:email,subject:"forget password",html});
    return res.status(200).json({message:"check your inbox",user});
});

export const resetPassword =asyncHandler(async(req,res,next)=>{
    const {email,password,forgetCode}=req.body;
    const user =await User.findOne({email:email.toLowerCase()});
    if (!user) {
        return next(new Error("not register account"),{cause:404});
    }
    if (forgetCode!==user.forgetCode || user.forgetCode==null) {
        return next(new Error("in-valid forget code"),{cause:400})
    }
    user.password=hash({plaintext:password});
    user.forgetCode=null;
    user.changePasswordTime=Date.now();
    user.save();
    return res.status(200).json({message:"Done"});
});

export const changePassword =asyncHandler(async(req,res,next)=>{
    const {oldPassword,newPassword}=req.body;
    const {_id}=req.user;
    const user =await User.findById(_id);
    const match =compare({plaintext:oldPassword,hashValue:user.password});
    
    if (!match) {
        return next(new Error("in-valid old password",{cause:400}));
    }

    user.password=hash({plaintext:newPassword});
    user.changePasswordTime=Date.now();
    user.save();
    return res.status(200).json({message:"Done"});
});

