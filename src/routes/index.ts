import * as asteroidFunctions from '../functions/asteroid'
import app from '../app'

app.get('/list', asteroidFunctions.list)
app.get('/search', asteroidFunctions.search)
app.get('/nearest', asteroidFunctions.nearest)