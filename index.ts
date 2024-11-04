import express from "express";
import dotenv from "dotenv";
import pkg from "civitai";
const { Civitai } = pkg;
import { Scheduler } from "civitai";
import cors from "cors";

// Load environment variables from .env
dotenv.config();

const app = express();

app.use(cors());
app.use(express.json());

if (!process.env.CIVITAI_API_TOKEN) {
  throw new Error("CIVITAI_API_TOKEN is not set");
}

const civitai = new Civitai({
  auth: process.env.CIVITAI_API_TOKEN,
});

app.get("/", (req, res) => {
  res.send("IMAGE GENERATOR SERVER IS RUNNING");
});

app.post("/generate", async (req, res) => {
  try {
    const { params } = req.body;

    const input = {
      model: "urn:air:sdxl:checkpoint:civitai:288584@324619",
      params: {
        prompt: params.prompt,
        negativePrompt: params.negativePrompt,
        scheduler: Scheduler.DPM2MKARRAS,
        steps: params.steps,
        cfgScale: params.cfgScale,
        width: params.width,
        height: params.height,
        clipSkip: 2,
      },
    };

    const response = await civitai.image.fromText(input, true);
    console.log("RESPONSE", response);
    const imageUrl = response.jobs[0].result.jobs[0].result.blobUrl;
    res.json({ imageUrl });
  } catch (error) {
    console.error("Generation error:", error);
    res.status(500).json({ error: "Failed to generate image" });
  }
});

app.listen(3000, () => {
  console.log("Server is running on port 3000");
});
