// Test API endpoint to see what format it expects
export async function testAuthEndpoint() {
  const API_URL = process.env.NEXT_PUBLIC_API_URL || 'https://mysidomuncul.sidomuncul.co.id';
  
  try {
    // First, let's try to get the API spec or documentation
    const response = await fetch(`${API_URL}/v1/api/web/auth`, {
      method: 'OPTIONS',
    });
    
    console.log('OPTIONS response:', response);
    console.log('Allowed methods:', response.headers.get('Allow'));
    
    // Let's also try a simple GET request to see if we can get any information
    const getResponse = await fetch(`${API_URL}/v1/api/web/auth`, {
      method: 'GET',
      headers: {
        'Accept': 'application/json',
      },
    });
    
    console.log('GET response status:', getResponse.status);
    console.log('GET response headers:', [...getResponse.headers.entries()]);
    
    if (getResponse.ok) {
      const data = await getResponse.json();
      console.log('GET response data:', data);
    }
  } catch (error) {
    console.error('Test error:', error);
  }
}