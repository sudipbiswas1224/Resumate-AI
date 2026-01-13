import express from 'express';
import cors from 'cors';
import userRouter from './routes/user.route.js';
import resumeRouter from './routes/resume.routes.js';
import aiRouter from './routes/ai.routes.js';
import morgan from 'morgan'
const app = express();

app.use(express.json());
app.use(cors());
app.use(morgan('tiny'));

app.get('/', (req, res) => {
    res.send('server is live')
});

app.use('/api/users', userRouter);
app.use('/api/resumes', resumeRouter)
app.use('/api/ai', aiRouter)

export default app;