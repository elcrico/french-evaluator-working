const { Configuration, OpenAIApi } = require("openai");

module.exports = async (req, res) => {
  const configuration = new Configuration({
    apiKey: process.env.OPENAI_API_KEY,
  });
  const openai = new OpenAIApi(configuration);

  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const { text } = req.body;

  if (!text) {
    return res.status(400).json({ error: "Missing input text" });
  }

  try {
    const completion = await openai.createCompletion({
      model: "text-davinci-003",
      prompt: `Evaluate the following French writing and assign a level (A1, A2, B1, B2, C1, C2):\n\n${text}`,
      max_tokens: 150,
    });

    const output = completion.data.choices[0].text.trim();
    res.status(200).json({ proficiency: output });
  } catch (error) {
    console.error("OpenAI error:", error.message);
    res.status(500).json({ error: "OpenAI error", details: error.message });
  }
};
