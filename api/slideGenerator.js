const axios = require('axios');

async function getSlidesFromTranscription(transcription) {
  const OPENAI_API_KEY = process.env.OPENAI_API_KEY;
  const OPENAI_API_URL = 'https://api.openai.com/v1/chat/completions';

  const messages = [
    {
      role: 'system',
      content: 'You are an AI that converts text into PowerPoint slides with headers and bullet points.',
    },
    {
      role: 'user',
      content: `Turn the following text into slides:

${transcription}

EXAMPLE:

[
  {
    "Header": "Seattle, Washington",
    "BulletPoints": [
      "Seat of King County, Washington",
      "Population of 737,015 (2020)",
      "Largest city in Washington and the Pacific Northwest"
    ]
  },
  {
    "Header": "Geography and Trade",
    "BulletPoints": [
      "Located between Puget Sound & Lake Washington",
      "Major gateway for trade with East Asia"
    ]
  }
]`,
    },
  ];

  try {
    const response = await axios.post(
      OPENAI_API_URL,
      {
        model: 'gpt-3.5-turbo',
        messages: messages,
        temperature: 0.7,
      },
      {
        headers: {
          Authorization: `Bearer ${OPENAI_API_KEY}`,
          'Content-Type': 'application/json',
        },
      }
    );

    const parsedResponse = JSON.parse(response.data.choices[0].message.content.trim());
    return parsedResponse;
  } catch (error) {
    console.error('Error getting slides:', error);
    throw new Error('Error getting slides');
  }
}

module.exports = {
  getSlidesFromTranscription,
};
