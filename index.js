import express from 'express';
import routes from './routes/routes.js';
import connectDB from './db/connectDB.js';
import bodyParser from 'body-parser';
import path from 'path';
const app = express();
const port = process.env.PORT || 8080; 
const DATABASEURL = process.env.DATABASEURL || "mongodb://localhost:27017/Portfolio";

app.use(bodyParser.urlencoded({ extended: true }));


//database configuration
connectDB(DATABASEURL);

//serve static files from the public directory
app.use(express.static(path.join(process.cwd(), 'public')));

//set the view engine to ejs
app.set('view engine', 'ejs');
app.set('views', './views');

//create routes
app.use('/', routes);

app.listen(port, () => {
    console.log(`Server is running at http://localhost:${port}`);
});
