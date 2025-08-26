// Helper functions for working with cookies
export const setCookie = (name: string, value: string, days: number = 7) => {
  if (typeof document === 'undefined') return; // Don't run on server
  
  const expires = new Date();
  expires.setTime(expires.getTime() + days * 24 * 60 * 60 * 1000);
  document.cookie = `${name}=${value};expires=${expires.toUTCString()};path=/`;
};

export const getCookie = (name: string): string | undefined => {
  if (typeof document === 'undefined') return undefined; // Don't run on server
  
  const nameEQ = name + "=";
  const ca = document.cookie.split(';');
  for(let i = 0; i < ca.length; i++) {
    let c = ca[i];
    while (c.charAt(0) === ' ') c = c.substring(1, c.length);
    if (c.indexOf(nameEQ) === 0) return c.substring(nameEQ.length, c.length);
  }
  return undefined;
};

export const removeCookie = (name: string) => {
  if (typeof document === 'undefined') return; // Don't run on server
  
  document.cookie = `${name}=;expires=Thu, 01 Jan 1970 00:00:00 GMT;path=/`;
};

export const isAuth = () => !!getCookie('token');

export const userLogin = () => {
  const user_id = getCookie('user_id');
  const token = getCookie('token');
  const email = getCookie('email');
  
  if (user_id && token) {
    return { user_id, token, email };
  }
  return null;
};