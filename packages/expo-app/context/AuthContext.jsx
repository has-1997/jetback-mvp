import React, { createContext, useState, useContext, useEffect } from "react";
import * as SecureStore from "expo-secure-store";

// 1. Create the context
const AuthContext = createContext(null);

// 2. Create the AuthProvider component
export function AuthProvider({ children }) {
  const [userToken, setUserToken] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  // This effect runs ONCE when the app starts
  useEffect(() => {
    async function loadTokenFromStorage() {
      try {
        const storedToken = await SecureStore.getItemAsync("userToken");
        if (storedToken) {
          setUserToken(storedToken);
        }
      } catch (e) {
        console.error("Failed to load token from storage", e);
      } finally {
        // We are done trying to load the token
        setIsLoading(false);
      }
    }
    loadTokenFromStorage();
  }, []); // The empty array means this effect only runs on mount

  const authContextValue = {
    signIn: async (token) => {
      await SecureStore.setItemAsync("userToken", token);
      setUserToken(token);
    },
    signOut: async () => {
      await SecureStore.deleteItemAsync("userToken");
      setUserToken(null);
    },
    userToken,
    // We expose the isLoading state so our layout can use it
    isLoading,
  };

  return (
    <AuthContext.Provider value={authContextValue}>
      {children}
    </AuthContext.Provider>
  );
}

// 3. Create a custom hook for easy access to the context
export function useAuth() {
  return useContext(AuthContext);
}
