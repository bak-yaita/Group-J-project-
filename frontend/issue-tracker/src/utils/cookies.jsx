// Function to get a specific cookie by name
export function getCookie(name) {
    const cookieValue = document.cookie
      .split("; ")
      .find((row) => row.startsWith(name + "="));
    return cookieValue ? decodeURIComponent(cookieValue.split("=")[1]) : "";
  }
  
  // Function to get the session ID cookie
  export function getSessionIdFromCookies() {
    return getCookie("sessionid");
  }
  