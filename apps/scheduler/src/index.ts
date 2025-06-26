import Express, { type Response } from 'express';

const app = Express();

app.get('/health', (res: Response) => {
  res.status(200).send('Scheduler is running');
});

app.listen(3000, () => {
  console.log('Server is running on port 3000');
  console.log('http://localhost:3000/health');
});
