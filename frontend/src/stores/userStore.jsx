import { create } from "zustand";
import { cartStore, retrieveCartFromStorage } from "../stores/cartStore";
const apiEnv = import.meta.env.VITE_BACKEND_API;

export const userStore = create((set, get) => ({
  username: "",
  setUsername: (username) => set({ username }),
  email: "",
  setEmail: (email) => set({ email }),
  password: "",
  setPassword: (password) => set({ password }),
  accessToken: localStorage.getItem("accessToken") || null,
  setAccessToken: (token) => set({ accessToken: token }),
  id: localStorage.getItem("userID") || null,
  setId: (id) => set({ id: id }),
  isLoggedIn: Boolean(localStorage.getItem("accessToken")),
  setIsLoggedIn: (isLoggedIn) => set({ isLoggedIn }),

  handleSignup: async (username, password, email) => {
    console.log("handleSignup invoked with:", { username, password, email });
    if (!username || !password || !email) {
      alert("Please enter username, email and password");
      return false;
    }

    try {
      const response = await fetch(`${apiEnv}/register`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, username, password }),
      });

      const data = await response.json();
      console.log("Signup response:", data);
      if (data.success) {
        console.log("Signup successful!");
        const loginSuccess = await get().handleLogin(username, password);
        if (loginSuccess) {
          const cartData = retrieveCartFromStorage();
          if (cartData) {
            cartStore
              .getState()
              .addToCart(
                cartData.type,
                cartData.subscriptionOption,
                cartData.quantity,
                cartData.price,
                true,
                get().id
              );
            localStorage.removeItem("tempCart"); // Clear the temporary cart data
          }
        }
        return loginSuccess;
      } else {
        alert(data.response || "Signup not successful!");
        return false;
      }
    } catch (error) {
      console.error("Signup error:", error);
      alert("An error occurred during signup");
      return false;
    }
  },

  handleLogin: async (username, password, redirectPath) => {
    console.log("handleLogin invoked with:", {
      username,
      password,
      redirectPath,
    });

    if (!username || !password) {
      alert("Please enter both username and password");
      return;
    }

    try {
      console.log("Sending login request to server");
      const response = await fetch(`${apiEnv}/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ username, password }),
      });

      const data = await response.json();
      console.log("Login response:", data);

      if (response.ok && data.success) {
        set({
          username: username,
          accessToken: data.response.accessToken,
          isLoggedIn: true,
          id: data.response.id,
        });
        localStorage.setItem("accessToken", data.response.accessToken);
        localStorage.setItem("userID", data.response.id);

        // New logic to update the cart store with data from local storage
        const cartData = retrieveCartFromStorage();
        if (cartData) {
          cartStore
            .getState()
            .addToCart(
              cartData.type,
              cartData.subscriptionOption,
              cartData.quantity,
              cartData.price,
              true,
              data.response.id
            );
          localStorage.removeItem("tempCart"); // Clear the temporary cart data
        }

        console.log("Login successful!");
        return true;
      } else {
        alert(data.message || "Login failed");
        return false;
      }
    } catch (error) {
      console.error("Login error:", error);
      alert(
        "An error occurred during login: " +
          (error.message || JSON.stringify(error))
      );
      return false;
    }
  },

  handleLogout: () => {
    set({ username: "", accessToken: null, isLoggedIn: false });
    localStorage.removeItem("accessToken");
    localStorage.removeItem("tempCart");
    localStorage.removeItem("flowerSubscriptionOptions");
    localStorage.removeItem("userID");
    localStorage.removeItem("cartData");
    cartStore.getState().emptyCart();
    console.log("Cleared tempCart from local storage");
  },
}));
