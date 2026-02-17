import app from './app.js';
const PORT = process.env.PORT || 3000; // 2. Apply Helmet with custom configuration

app.listen(PORT, () =>
  console.log(`Server running on port http://localhost:${PORT}`)
);
