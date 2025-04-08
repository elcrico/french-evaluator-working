const { Configuration, OpenAIApi } = require("openai");

module.exports = async (req, res) => {
  console.log("API route hit ✅");

  if (req.method !== 'POST') {
    console.log("❌ Invalid method");
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const apiKey = process.env.OPENAI_API_KEY;

  if (!apiKey) {
    console.log("❌ No API key found in environment variables");
    return res.status(500).json({ error: 'Missing OpenAI API key' });
  }

  const configuration = new Configuration({ apiKey });
  const openai = new OpenAIApi(configuration);

  const { text } = req.body;

  if (!text) {
    console.log("❌ No text received in request body");
    return res.status(400).json({ error: 'Missing text input' });
  }

  console.log("✅ Calling OpenAI with student text...");

  try {
    const completion = await openai.createCompletion({
      model: 'text-davinci-003',
      prompt: `Evaluate the following French student writing and assign a level: Novice, Emerging, Developing, Proficient, or Advanced. Explain why:\n\n${text}`,
      max_tokens: 150,
    });

    const output = completion.data.choices[0].text.trim();
    console.log("✅ OpenAI response:", output);
    res.status(200).json({ proficiency: output });
  } catch (err) {
    console.error("❌ OpenAI error:", err.message);
    res.status(500).json({ error: 'OpenAI error', details: err.message });
  }
};
