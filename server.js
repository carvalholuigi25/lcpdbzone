import express from "express";
import cors from "cors";
import OpenAI from "openai";
import dotenv from "dotenv";

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

app.post("/chat", async (req, res) => {
  try {
    const { model, messages } = req.body;

    const completion = await openai.chat.completions.create({
      model: model ?? "gpt-5-nano",
      messages,
    });

    res.json(completion.choices[0].message);
  } catch (error) {
    res.status(500).json({ error: "Erro ao gerar resposta " + error });
  }
});

app.post("/achat", async (req, res) => {
  try {
    const { model, messages } = req.body;

    const completion = await openai.chat.completions.create({
      model: model ?? "gpt-5-nano",
      messages,
      stream: true
    });

    res.setHeader('Content-Type', 'text/event-stream');
    res.setHeader('Cache-Control', 'no-cache');
    res.setHeader('Connection', 'keep-alive');

    for await (const chunk of completion) {
      const content = chunk.choices[0]?.delta?.content || '';
      res.write(content);
    }

    res.end();
  } catch (error) {
    res.status(500).json({ error: "Erro ao gerar resposta " + error });
  }
});

app.listen(3000, () => {
  console.log("Servidor rodando na porta 3000");
});
