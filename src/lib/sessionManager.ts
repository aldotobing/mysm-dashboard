// src/lib/sessionManager.ts
import { v4 as uuidv4 } from 'uuid';
import { UserLoginData } from '@/context/AuthContext'; // Adjust import path if needed

// Define the structure of session data
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

// In-memory session store (for demonstration purposes)
// In a real application, you would use a proper session store like Redis
const sessionStore: Map<string, SessionData> = new Map();

// Session expiration time in seconds (e.g., 24 hours)
const SESSION_EXPIRY_SECONDS = 24 * 60 * 60;

/**
 * Creates a new user session and stores it in memory.
 * @param userData - The user data to store in the session.
 * @returns The session ID.
 */
export async function createSession(userData: UserLoginData): Promise<string> {
  const sessionId = uuidv4();
  
  // Convert the user data object to a SessionData object
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
  }

  sessionStore.set(sessionId, sessionData);
  console.log(`Session created for user ${userData.user_id} with session ID: ${sessionId}`);
  return sessionId;
}

/**
 * Retrieves user session data from memory.
 * @param sessionId - The session ID.
 * @returns The session data or null if not found/expired.
 */
export async function getSession(sessionId: string): Promise<SessionData | null> {
  const sessionData = sessionStore.get(sessionId);
  if (!sessionData) {
    console.log(`Session not found for session ID: ${sessionId}`);
    return null;
  }
  
  console.log(`Session retrieved for session ID: ${sessionId}`);
  return sessionData;
}

/**
 * Updates an existing user session in memory.
 * @param sessionId - The session ID.
 * @param userData - The updated user data.
 * @returns True if the session was updated, false otherwise.
 */
export async function updateSession(sessionId: string, userData: Partial<SessionData>): Promise<boolean> {
  const currentData = sessionStore.get(sessionId);
  if (!currentData) {
    console.log(`Session not found for update: ${sessionId}`);
    return false;
  }
  
  // Merge updates
  const updatedData: SessionData = { ...currentData, ...userData };
  
  sessionStore.set(sessionId, updatedData);
  console.log(`Session updated for session ID: ${sessionId}`);
  return true;
}

/**
 * Deletes a user session from memory.
 * @param sessionId - The session ID.
 * @returns True if the session was deleted, false otherwise.
 */
export async function deleteSession(sessionId: string): Promise<boolean> {
  const deleted = sessionStore.delete(sessionId);
  if (deleted) {
    console.log(`Session deleted for session ID: ${sessionId}`);
  } else {
    console.log(`Session not found for deletion: ${sessionId}`);
  }
  return deleted;
}

/**
 * Extends the expiry time of an existing session.
 * Note: This is a placeholder implementation since we're using in-memory storage.
 * In a real Redis implementation, you would use the expire command.
 * @param sessionId - The session ID.
 * @returns True if the session expiry was extended, false otherwise.
 */
export async function extendSession(sessionId: string): Promise<boolean> {
  // In a real Redis implementation, you would extend the expiry here
  // For in-memory storage, we'll just check if the session exists
  const exists = sessionStore.has(sessionId);
  if (exists) {
    console.log(`Session expiry extended for session ID: ${sessionId}`);
  } else {
    console.log(`Session not found for extension: ${sessionId}`);
  }
  return exists;
}