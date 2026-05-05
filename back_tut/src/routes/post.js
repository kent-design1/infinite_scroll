import express from 'express';

const router = express.Router();

import {protect} from "../middleware/authMiddleware.js"
import Post from '../models/Post.js';

import asyncHandler from "../utils/asyncHandler.js";

// GET /api/posts — public, anyone can read posts
router.get('/', asyncHandler(async (req, res) => {

    try {
        const posts = await Post.find().populate('author', 'name email').sort({created: -1});
        res.json(posts);
    } catch (err) {
        res.status(500).json({error: err.message});
    }
}));
        // GET /api/posts/:id — public
router.get('/:id', asyncHandler(async (req, res) => {
            try{
                const post = await Post.findById(req.params.id).populate('author', 'name email');
                if(!post){
                    res.status(404).json({error: 'Post not found'});
                }
                res.json(post);
            }
            catch(err){
                res.status(500).json({error: err.message});
            }
        }));

        // POST /api/posts — protected, must be logged in
router.post('/', protect, asyncHandler( async (req, res) => {
        try{
            const {title, body} = req.body;

            if(!title || !body){
                res.status(400).json({error: 'Please provide a title or body'});
            }
            const post = await Post.create({
                title,
                body,
                author:req.user._id
            })

            res.status(201).json(post);
        }
        catch(err){
            res.status(500).json({error: err.message});
        }
    }))

router.delete('/:id', protect, asyncHandler( async (req, res) => {

        try{
            const post = await Post.findById(req.params.id)
            if(!post){
                res.status(404).json({error: 'Post not found'});
            }

            // Mkae sure the logged-in user owns this post
            if(post.author.toString() !== req.user._id.toString()){
                res.status(401).json({error: 'You are not authorized to delete this post'});
            }
            await Post.deleteOne()
            res.json({message: 'Post deleted'});

        }
        catch(err){
            res.status(500).json({error: err.message});
        }
    }))

router.put('/:id', protect, asyncHandler( async (req, res) => {
    try{
        const post = await Post.findById(req.params.id)

        // Post not found
        if(!post){
            res.status(404).json({error: 'Post not found'});
        }

        if(post.author.toString() !== req.user._id.toString()){
            res.status(401).json({error: 'You are not authorized to update this post'});
        }

        const {title, body} = req.body;

        if(title) post.title = title;
        if(body) post.body = body;

        const upDatedPost = await post.save()
        res.json({message: 'Post updated', upDatedPost});

    }
    catch(err){
        res.status(500).json({error: err.message});
    }
}))


export default router;