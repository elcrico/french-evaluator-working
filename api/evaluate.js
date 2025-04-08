const { Configuration, OpenAIApi } = require("openai");

const configuration = new Configuration({
  apiKey: process.env.OPENAI_API_KEY,
});
const openai = new OpenAIApi(configuration);

module.exports = async (req, res) => {
  if (req.method !== 'POST') {
    res.status(405).json({ error: 'Method not allowed' });
    return;
  }

  const { text } = req.body;
  if (!text) {
    res.status(400).json({ error: 'Missing text input' });
    return;
  }

  try {
    const completion = await openai.createCompletion({
      model: 'text-davinci-003',
      prompt: `Evaluate the following French student writing and assign a level: Novice, Emerging, Developing, Proficient, or Advanced. Explain why.\n\n${text}`,
      max_tokens: 150,
    });

    const output = completion.data.choices[0].text.trim();
    res.status(200).json({ proficiency: output });
  } catch (err) {
    res.status(500).json({ error: 'OpenAI error', details: err.message });
  }
};
