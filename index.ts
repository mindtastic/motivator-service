import express, { Express, Request, Response } from 'express';

const app = express();
const port = process.env.PORT;

app.get('/', (req, res) => {
    res.send('Hello world');
});

app.listen(port, () => {
    console.log(`Server is running at https://localhost:${port}`)
});