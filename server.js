const express = require('express');
const app = express();
const PORT = process.env.PORT || 8000;
const connectDb = require('./config/db');

//Connect Database
connectDb();

//Init Middlewae
app.use(express.json()) // allow us to get data from req.body


app.get('/', (req, res) => {
  res.send('API is running');
});

//Define routes
app.use('/api/users', require('./routes/api/users'));
app.use('/api/auth', require('./routes/api/auth'));
app.use('/api/profile', require('./routes/api/profile'));
app.use('/api/posts', require('./routes/api/posts'));

app.listen(PORT, () => console.log(`Server is started on port ${PORT}`));
