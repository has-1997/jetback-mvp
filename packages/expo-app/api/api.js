// The base URL of our backend server
const API_URL = "http://192.168.0.28:3000/api";

export const signUpUser = async (email, password) => {
  try {
    const response = await fetch(`${API_URL}/auth/signup`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ email, password }),
    });

    const data = await response.json();

    if (!response.ok) {
      // If server responds with an error, throw an error to be caught by the component
      throw new Error(data.error || "Something went wrong");
    }

    return data; // This should be { token: "..." }
  } catch (error) {
    // Re-throw the error to be handled by the calling function
    throw error;
  }
};

export const getFlights = async (token) => {
  try {
    const response = await fetch(`${API_URL}/flights`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        // This is how we prove to the backend that we are authorized
        Authorization: `Bearer ${token}`,
      },
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.error || "Failed to fetch flights");
    }

    return data; // This will be the array of flight objects
  } catch (error) {
    throw error;
  }
};

export const getFlightById = async (token, flightId) => {
  try {
    // Note the URL now includes the flightId at the end
    const response = await fetch(`${API_URL}/flights/${flightId}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.error || "Failed to fetch flight details");
    }

    return data; // This will be the single flight object
  } catch (error) {
    throw error;
  }
};