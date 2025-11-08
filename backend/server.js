import express from 'express';
import morgan from 'morgan';
import cors from 'cors';
import { config } from 'dotenv';
import router from './router/route.js';
import connect from './database/conn.js';
import path from 'path';
import { fileURLToPath } from 'url';
import questionRoute from './router/questionRoute.js';


// Load environment variables FIRST
config();

const app = express();

// Middleware
app.use(express.json());
app.use(morgan('tiny'));
app.use(cors());
app.use(questionRoute);
// Static file serving - SINGLE DECLARATION
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Serve images from database/images directory
app.use('/images', express.static(path.join(__dirname, 'database', 'images')));

// Additional fallback - serve from root images folder if exists
app.use('/images', express.static(path.join(__dirname, 'images')));

console.log('Static files served from:');
console.log('-', path.join(__dirname, 'database', 'images'));
console.log('-', path.join(__dirname, 'images'));

const port = process.env.PORT;

// Routes
app.use('/api', router);

app.get('/', (req, res) => {
    res.json("Server is running");
});

// Test route to check image serving
app.get('/test-images', (req, res) => {
    res.json({
        message: "Test image endpoints",
        testUrls: [
            '/images/question2.png',
            '/images/option1.png'
        ]
    });
});

// Database connection and server start
connect().then(() => {
    try {
        app.listen(port, () => {
            console.log(`Server connected on port ${port}`);
        });
    } catch (error) {
        console.log("Cannot connect to the server:", error);
    }
}).catch(error => {
    console.log("Invalid database connection:", error);
});