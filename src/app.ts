import express from 'express';
import cors from 'cors'
import admin from 'firebase-admin'
import * as asteroidFunctions from './functions/asteroid'

const app = express();

app.use(cors({ origin: true }));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

const port = 8080;

// Initialize Firebase

var serviceAccount = require("../src/private/asteroid.json");

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: "https://asteroid-28eb3.firebaseio.com"
});

const db = admin.firestore()
db.settings({ ignoreUndefinedProperties: true })

// Routes

app.get('/list', asteroidFunctions.list)
app.get('/search', asteroidFunctions.search)
app.get('/nearest', asteroidFunctions.nearest)
app.get('/favourite', asteroidFunctions.favourite)
app.post('/favourite/add', asteroidFunctions.addFavourite)
app.post('/favourite/remove', asteroidFunctions.removeFavourite)

app.get('/', (req, res) => {
    res.send('Server is Running!');
});


app.listen(port, () => {
    return console.log(`server is listening on ${port}`);
})

export default app

