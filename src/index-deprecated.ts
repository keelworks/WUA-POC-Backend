import express, { Request, Response } from 'express';

const app = express();

const PORT = 3000;

app.use(express.json());

app.get('/', (req: Request, res: Response) => {
    res.json({message: "Hello, World!"});
});

app.listen(PORT, () => {
    console.log(`App listening on http://localhost:${PORT}`);
});
