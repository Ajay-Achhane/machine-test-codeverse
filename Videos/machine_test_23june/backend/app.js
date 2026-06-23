require('dotenv').config();
const express = require('express');
const cors = require('cors');
const connectDB = require('./config/db');

// Connect to database
connectDB();

const app = express();

// Enable CORS for frontend requests
app.use(cors({ origin: process.env.FRONTEND_URL }));
app.use(express.json()); // Ensure body parsing is enabled globally

const userRoute = require('./routes/userRoutes');
const superadminRoutes = require('./routes/superadminRoutes');
const masterRoutes = require('./routes/masterRoutes');
const dataRoutes = require('./routes/dataRoutes');

app.use("/auth", userRoute); // Changed to /auth as per requirements
app.use("/superadmin", superadminRoutes);
app.use("/master", masterRoutes);
app.use("/data", dataRoutes);

const PORT = process.env.PORT || 6000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});