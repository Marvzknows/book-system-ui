export const token = window.localStorage.getItem('access_token');
export const baseURL = 'http://localhost/system-be';

export function checkSession() {
  if (!token) {
    return (window.location.href = "../login.html");
  }
}