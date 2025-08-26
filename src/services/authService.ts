// services/authService.ts
import { setCookie } from '@/helpers/cookies';

// Replace with your actual API URL
const API_URL = process.env.NEXT_PUBLIC_API_URL || 'https://mysidomuncul.sidomuncul.co.id';

interface LoginCredentials {
  email: string;
  password: string;
}

interface UserData {
  user_id: string;
  token: string;
  expired_date: string;
  role_list: string[];
  refresh_token: string;
  role_group_id: string;
}

interface LoginResponse {
  data: UserData;
}

export const loginUser = async (credentials: LoginCredentials): Promise<LoginResponse> => {
  try {
    const response = await fetch(`${API_URL}/v1/api/web/auth`, {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        email: credentials.email,
        password: credentials.password,
      }),
    });

    // Try to read the response body regardless of status
    const textResponse = await response.text();
    
    // Try to parse as JSON
    let jsonResponse;
    try {
      jsonResponse = JSON.parse(textResponse);
    } catch (parseError) {
      // If parsing fails, we'll handle it below
    }

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}, body: ${textResponse}`);
    }

    // If we got here, the response should be JSON
    const data: LoginResponse = jsonResponse || JSON.parse(textResponse);

    return data;
  } catch (error) {
    console.error('Error in loginUser:', error);
    throw error;
  }
};