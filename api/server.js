const express = require('express');

const app = express();
const port = 3000;
const bodyParser = require('body-parser');
const cors = require('cors');
const OpenAIApi = require("openai");
const { parse } = require('dotenv');

let dotenv = require('dotenv').config();

// const openAIConfig = new Configuration()
const openai = new OpenAIApi({
    organization: process.env.OPENAI_ORGANIZATION,
    apiKey: process.env.OPENAI_API_KEY
});


app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

async function getAIWeatherQuote(temp) {
    if (typeof temp != "string") return false;
    if (isNaN(temp)) return false;
    const temp_int = parseInt(temp);
    if (isNaN(temp_int)) return false;
    if (temp_int < -128 || temp_int > 134) return false;

    const completion = await openai.chat.completions.create({
        messages: [{ role: 'user', content: 'You are a weather quip bot. The current temperature is ' + temp + ' degrees fahrenheit. Provide a fun witty comment about the current weather. Keep the comment short.' }],
        model: 'gpt-3.5-turbo',
    })
    return completion.choices[0].message.content;
}


app.get('/quote', async (req, res) => {
    res.send(await getAIWeatherQuote(req.query.temp));
})

app.get('/test', async (req, res) => {
    res.send(req.query.temp);
})

app.listen(port, () => {
    console.log(`App listening on port ${port}`)
})