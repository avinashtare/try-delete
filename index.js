// 1. Setting up dependencies and installing Express.js
const express = require('express')
const app = express()
const path = require("path")
const cors = require('cors')
const axios = require("axios")


app.use(express.static('public'));
app.use(express.json())
app.use(cors())

app.post('/ai', async (req, res) => {
    console.log("requiest for ai "+new Date().getMinutes() +"  "+new Date().getSeconds())

    let response = {}
    try {
        let data = req.body
        response = await axios.post('https://generative-backend.photoroom.com/text2image', data)
        response = await response.data;

    } catch (error) {
        response = {error: error}
        response.statusCode = 400
    }
    res.json(await response)
})

app.get("/ai-person",(reqq,res)=>{
    return res.sendFile(path.join(__dirname+"/public/ai/index.html"))
})


app.listen(3000, () => {
    console.log('Server started on port 3000')
})
