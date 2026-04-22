import express from 'express';
import dotenv from 'dotenv';
import auth from './routes/auth.js';
import connectDB from "./config/db.js";


dotenv.config();

connectDB();

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));



app.get('/', (req, res) => {
    res.json({message: 'App is running!'});
})

app.use('/api/authRoutes', auth);



const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
    console.log(`Listening on port http://localhost:${PORT}`);
})