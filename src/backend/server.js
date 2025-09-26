import express from 'express';

const app = express();
app.use(express.json());

app.post('/api/chat', async (req, res) => {
	const { prompt } = req.body || {};

	const reply = `Echo: ${prompt}`;
	res.json({ reply });
});

// eslint-disable-next-line no-undef
const port = process.env.PORT || 3001;
app.listen(port, () => {
	console.log(`API running on http://localhost:${port}`);
});