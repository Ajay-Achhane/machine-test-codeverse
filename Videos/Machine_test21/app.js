const express = require('express');
const app = express();
const cors = require('cors');
const port = 3000;
const route  =  require('./routes/route');

app.get('/', (req, res) => {
  res.send('Hello World!');
});
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({extended:true}))

app.use("/api",route);

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});