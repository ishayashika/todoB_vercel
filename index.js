import "dotenv/config"
import express  from "express";
import mongoose from "mongoose";
import morgan from 'morgan';
import cookieParser from 'cookie-parser';
import cors from 'cors';
import allRoutes from "./routes/main.js"
const app = express();
const PORT = process.env.PORT || 8000;


app.get('/', (req, res) => {
  res.send('API is running...');
});

/* Middleware */

app.use(cors({
  origin: [
    'http://localhost:5173',
    'http://localhost:5174',
    'http://127.0.0.1:5173',
    'http://127.0.0.1:5174',
    'https://your-render-frontend-url.onrender.com' // Add your frontend URL
  ],
  credentials: true
})); //helps us to share our info between clients
app.use(morgan('tiny')); //whenever we hit any kind of route it will actually login our terminal
app.use(cookieParser()); 
app.use(express.json());//it will enable our abality to work with json
app.use(express.urlencoded({extended:true}));

/* Routes */
app.use("/api", allRoutes)
/*whenever we go next middleware after this allRoutes 
  it go to next middleware as i mention belew*/

// error handler
// eslint-disable-next-line
app.use((err, _req, res, next) => {
  const status = err.statusCode || 500;
  const message = err.message || 'Internal Server Error';
  return res.status(status).json({ message, stack: err.stack });
});

mongoose.set('strictQuery', false);

mongoose.connect(process.env.MONGO_URI)
.then(res=>{
  console.log("Connected to MongoDB successfully")
}).catch(err=>{
  console.log("Error connecting to MongoDB",err);
})


app.listen(PORT, () => {
    console.log(`Server is running on port http://localhost:${PORT}`);
});