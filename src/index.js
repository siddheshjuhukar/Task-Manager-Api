const express = require('express')
require('./db/mongoose')
const usersRouter = require('./routers/Users')
const tasksRouter = require('./routers/Tasks')

const app = express()
const port = process.env.PORT

app.use(express.json())
app.use(usersRouter)
app.use(tasksRouter)

app.listen(port, () => {
    console.log('Server up and running on port ' + port)
})
