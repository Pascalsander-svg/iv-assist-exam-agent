exports.handler = async (event) => {
  const headers = { 
    'Content-Type': 'application/json',
    'Access-Control-Allow-Origin': '*'
  };

  if (event.httpMethod !== 'POST') {
    return { statusCode: 405, body: 'Method Not Allowed' };
  }

  const models = [
    'claude-sonnet-4-6',
    'claude-haiku-4-5-20251001',
    'claude-opus-4-6',
    'claude-3-5-sonnet-20241022',
    'claude-3-5-haiku-20241022',
    'claude-3-haiku-20240307',
    'claude-3-sonnet-20240229',
    'claude-3-opus-20240229',
  ];

  try {
    const body = JSON.parse(event.body);

    for (const model of models) {
      const response = await fetch('https://api.anthropic.com/v1/messages', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-api-key': process.env.ANTHROPIC_API_KEY,
          'anthropic-version': '2023-06-01',
        },
        body: JSON.stringify({ ...body, model }),
      });

      const data = await response.json();
      
      if (data.type !== 'error' || data.error?.type !== 'not_found_error') {
        console.log('Working model:', model);
        return { statusCode: 200, headers, body: JSON.stringify(data) };
      }
      console.log('Model not found:', model);
    }

    return { 
      statusCode: 200, 
      headers, 
      body: JSON.stringify({ type: 'error', error: { type: 'no_model', message: 'No working model found' }}) 
    };
  } catch (err) {
    return { statusCode: 500, headers, body: JSON.stringify({ error: err.message }) };
  }
};
