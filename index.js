const mongooseToConnect=require("./db")
mongooseToConnect()
var cors = require('cors')
const express = require('express')
const app = express()
const port = 3001
app.use(cors())

app.use(express.json())
app.get('/', (req, res) => {
  res.send('Hello World!')
})
app.use('/api/auth',require('./routes/auth'))
app.use('/api/notes',require('./routes/notes'))

app.listen(port, () => {
  console.log(`Inotebook listening at http://localhost:${port}`)
})