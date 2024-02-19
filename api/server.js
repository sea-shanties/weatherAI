const express = require('express');

const app = express();
const port = 3000;
const bodyParser = require('body-parser');
const cors = require('cors');
const { parse } = require('dotenv');

let dotenv = require('dotenv').config();

const { GoogleGenerativeAI } = require("@google/generative-ai");

const genAI = new GoogleGenerativeAI(process.env.GOOGLE_GEN_AI_API_KEY);

async function getAIWeatherQuote(temp) {
    if (typeof temp != "string") return false;
    if (isNaN(temp)) return false;
    const temp_int = parseInt(temp);
    if (isNaN(temp_int)) return false;
    if (temp_int < -128 || temp_int > 134) return false;


    const model = genAI.getGenerativeModel({ model: "gemini-pro" });
    const prompt = 'The current temperature is ' + temp + ' degrees fahrenheit. Provide a fun, witty comment about the current weather.'

    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();

    return text;
}

app.get('/quote', async (req, res) => {
    res.send(await getAIWeatherQuote(req.query.temp));
})

app.get('/test', async (req, res) => {
    res.send("Success");
})

app.listen(port, () => {
    console.log(`App listening on port ${port}`)
})