import express from 'express';
const router = express.Router();

router.post('/register', (req, res) => {
    const { name, email, password } = req.body;

    res.json({
        message: `successful registration ${name}!`,
        received: true,
    })
})

router.post('/login', (req, res) => {
    const { email, password } = req.body;
    res.json({
        message: `Welcome back ${name}!`,
    })
})

export default router;