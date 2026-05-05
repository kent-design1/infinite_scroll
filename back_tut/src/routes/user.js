import express from 'express';

import {protect} from "../middleware/authMiddleware.js";

const router = express.Router();

import Post from "../models/Post.js";


router.get('/me', protect, async (req, res) => {
    try{
        res.json(res.user);
    }catch(err){
        res.status(500).json({error: err.message});
    }
});

router.get('/me/post', protect, async (req, res) => {
    try{
        const posts = await Post.find({author:req.user._id}).sort({createdAt:-1})
        res.json({count: posts.length, posts})
    }
    catch(err){
        res.status(500).json({error: err.message});
    }
})

export default router;