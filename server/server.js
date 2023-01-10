import express from 'express';
import * as dotenv from 'dotenv';
import cors from 'cors';
import { Configuration, OpenAIApi } from 'openai';

dotenv.config();

const configuration = new Configuration({
  apiKey: process.env.OPENAI_API_KEY,
});

const openai = new OpenAIApi(configuration);

//config express and cors
const app = express();
app.use(cors());
app.use(express.json());

// make the dimmy route for check if its working
app.get('/', async (req, res) => {
  res.status(200).send({
    message: 'Hello from Vitor Santos , api is fully working',
  })
});

// real route to bring back all datas from open api to catch in front end
app.post('/', async (req, res) => {
  try {
    //get the request from front-end
    const prompt = req.body.prompt;

    // make api call with that request
    const response = await openai.createCompletion({
      model: "text-davinci-003",
      prompt: `${prompt}`,
      temperature: 0.5,
      max_tokens: 3000,
      top_p: 1,
      frequency_penalty: 0.5,
      presence_penalty: 0,
    });
    // return that request for the front end
    res.status(200).send({
      bot: response.data.choices[0].text
    })
  } catch (error) {
      console.log(error);
      res.status(500).send({ error })
  }
})

// bring our server to live
app.listen(5000, () => console.log('Server is running on port http://localhost:5000'));