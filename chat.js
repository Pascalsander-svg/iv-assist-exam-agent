exports.handler = async (event) => {
  if (event.httpMethod !== 'POST') {
    return { statusCode: 405, body: 'Method Not Allowed' };
  }

  try {
    const body = JSON.parse(event.body);
    
    console.log('Calling Anthropic API...');
    console.log('API Key set:', !!process.env.ANTHROPIC_API_KEY);
    console.log('API Key prefix:', process.env.ANTHROPIC_API_KEY?.substring(0, 10));

    const response = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': process.env.ANTHROPIC_API_KEY,
        'anthropic-version': '2023-06-01',
      },
      body: JSON.stringify(body),
    });

    const data = await response.json();
    console.log('Response status:', response.status);
    console.log('Response body:', JSON.stringify(data).substring(0, 300));

    return {
      statusCode: 200,
      headers: { 
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*'
      },
      body: JSON.stringify(data),
    };
  } catch (err) {
    console.log('Error:', err.message);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: err.message }),
    };
  }
};
