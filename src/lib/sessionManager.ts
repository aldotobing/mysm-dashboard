// src/lib/sessionManager.ts
import { v4 as uuidv4 } from 'uuid';
import redisClient from '@/lib/redis';
import { UserLoginData } from '@/context/AuthContext'; // Adjust import path if needed

// Define the structure of session data stored in Redis
// This should match the structure of your `userLogin` cookie object
export interface SessionData {
  user_id: string;
  token: string;
  email: string;
  expired_date: string;
  refresh_token: string;
  refresh_expired_date: string;
  latest_action: string;
  otp: string;
  role_list: string;
  role_group_id: string;
  customer_id: string;
  customer_name: string;
  customer_code: string | null;
  customer_phone: string;
  price_list_id: string | null;
  price_list_version_id: string | null;
  customer_type_id: string | null;
  customer_level_name: string | null;
  customer_address: string | null;
  salesman_id: string | null;
  salesman_name: string | null;
  salesman_code: string | null;
  logincode: string | null;
  // Add other fields as needed
}

// Session expiration time in seconds (e.g., 24 hours)
const SESSION_EXPIRY_SECONDS = 24 * 60 * 60;

/**
 * Creates a new user session and stores it in Redis.
 * @param userData - The user data to store in the session.
 * @returns The session ID.
 */
export async function createSession(userData: UserLoginData): Promise<string> {
  const sessionId = uuidv4();
  const sessionKey = `session:${sessionId}`;
  
  // Convert the user data object to a JSON string
  const sessionData: SessionData = {
    user_id: userData.user_id,
    token: userData.token,
    email: userData.email || '',
    expired_date: userData.expired_date || '',
    refresh_token: userData.refresh_token || '',
    refresh_expired_date: userData.refresh_expired_date || '',
    latest_action: userData.latest_action || '',
    otp: userData.otp || '',
    role_list: userData.role_list || '',
    role_group_id: userData.role_group_id || '',
    customer_id: userData.customer_id || '',
    customer_name: userData.customer_name || '',
    customer_code: userData.customer_code || null,
    customer_phone: userData.customer_phone || '',
    price_list_id: userData.price_list_id || null,
    price_list_version_id: userData.price_list_version_id || null,
    customer_type_id: userData.customer_type_id || null,
    customer_level_name: userData.customer_level_name || null,
    customer_address: userData.customer_address || null,
    salesman_id: userData.salesman_id || null,
    salesman_name: userData.salesman_name || null,
    salesman_code: userData.salesman_code || null,
    logincode: userData.logincode || null,
  };

  try {
    await redisClient.setex(
      sessionKey,
      SESSION_EXPIRY_SECONDS,
      JSON.stringify(sessionData)
    );
    console.log(`Session created for user ${userData.user_id} with session ID: ${sessionId}`);
    return sessionId;
  } catch (error) {
    console.error('Error creating session in Redis:', error);
    throw new Error('Failed to create session');
  }
}

/**
 * Retrieves user session data from Redis.
 * @param sessionId - The session ID.
 * @returns The session data or null if not found/expired.
 */
export async function getSession(sessionId: string): Promise<SessionData | null> {
  const sessionKey = `session:${sessionId}`;
  
  try {
    const sessionDataString = await redisClient.get(sessionKey);
    if (!sessionDataString) {
      console.log(`Session not found or expired for session ID: ${sessionId}`);
      return null;
    }
    
    const sessionData: SessionData = JSON.parse(sessionDataString);
    console.log(`Session retrieved for session ID: ${sessionId}`);
    return sessionData;
  } catch (error) {
    console.error('Error retrieving session from Redis:', error);
    // It's often better to treat errors as "session not found" to avoid leaking information
    // or causing cascading failures. You might want to log the error internally.
    return null; 
  }
}

/**
 * Updates an existing user session in Redis.
 * @param sessionId - The session ID.
 * @param userData - The updated user data.
 * @returns True if the session was updated, false otherwise.
 */
export async function updateSession(sessionId: string, userData: Partial<SessionData>): Promise<boolean> {
  const sessionKey = `session:${sessionId}`;
  
  try {
    // Check if session exists
    const exists = await redisClient.exists(sessionKey);
    if (!exists) {
      console.log(`Session not found for update: ${sessionId}`);
      return false;
    }
    
    // Get current session data
    const currentDataString = await redisClient.get(sessionKey);
    if (!currentDataString) {
      return false; // Should not happen if exists, but be safe
    }
    const currentData: SessionData = JSON.parse(currentDataString);
    
    // Merge updates
    const updatedData: SessionData = { ...currentData, ...userData };
    
    // Update in Redis with the same expiry
    await redisClient.setex(
      sessionKey,
      SESSION_EXPIRY_SECONDS,
      JSON.stringify(updatedData)
    );
    console.log(`Session updated for session ID: ${sessionId}`);
    return true;
  } catch (error) {
    console.error('Error updating session in Redis:', error);
    return false;
  }
}

/**
 * Deletes a user session from Redis.
 * @param sessionId - The session ID.
 * @returns True if the session was deleted, false otherwise.
 */
export async function deleteSession(sessionId: string): Promise<boolean> {
  const sessionKey = `session:${sessionId}`;
  
  try {
    const result = await redisClient.del(sessionKey);
    const deleted = result > 0;
    if (deleted) {
      console.log(`Session deleted for session ID: ${sessionId}`);
    } else {
      console.log(`Session not found for deletion: ${sessionId}`);
    }
    return deleted;
  } catch (error) {
    console.error('Error deleting session from Redis:', error);
    return false;
  }
}

/**
 * Extends the expiry time of an existing session.
 * @param sessionId - The session ID.
 * @returns True if the session expiry was extended, false otherwise.
 */
export async function extendSession(sessionId: string): Promise<boolean> {
  const sessionKey = `session:${sessionId}`;
  
  try {
    // Check if session exists
    const exists = await redisClient.exists(sessionKey);
    if (!exists) {
      console.log(`Session not found for extension: ${sessionId}`);
      return false;
    }
    
    // Extend expiry using expire command
    const result = await redisClient.expire(sessionKey, SESSION_EXPIRY_SECONDS);
    const extended = result === 1;
    if (extended) {
      console.log(`Session expiry extended for session ID: ${sessionId}`);
    } else {
      console.log(`Failed to extend session expiry for session ID: ${sessionId}`);
    }
    return extended;
  } catch (error) {
    console.error('Error extending session expiry in Redis:', error);
    return false;
  }
}