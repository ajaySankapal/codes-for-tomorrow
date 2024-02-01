import express from 'express'

const app = express()

app.use(express.json())
app.use(express.urlencoded())


const PORT = process.env.PORT || 5000

app.get('/health', (req, res) => {
    res.status(200).json({
        success: true,
        message: "SERVER IS RUNNING SUCCESSFULLY!!"
    })
})

//import routes
import UserRouter from './routes/user.routes.js'
import CategoryRouter from './routes/category.routes.js'
import ServicePriceRouter from './routes/price.routes.js'

app.use('/api/user', UserRouter)
app.use('/api/category', CategoryRouter)
app.use('/api/price', ServicePriceRouter)


app.listen(PORT, () => {
    console.log(`🟢 SERVER IS UP ON PORT ${PORT}`)
})
