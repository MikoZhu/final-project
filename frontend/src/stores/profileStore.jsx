import { create } from "zustand";
const apiEnv = import.meta.env.VITE_BACKEND_API;
// import { userStore } from "../stores/userStore";

export const profileStore = create((set) => ({
  //  set the initial data
  lastName: "",
  setLastName: (lastName) => set({ lastName }),
  firstName: "",
  setFirstName: (firstName) => set({ firstName }),
  phone: "",
  setPhone: (phone) => set({ phone }),
  important: "",
  setImportant: (important) => set({ important }),
  color: "",
  setColor: (color) => set({ color }),
  flower: "",
  setFlower: (flower) => set({ flower }),

  handleAddprofile: async () => {
    if (!lastName || !firstName || !phone) {
      alert("Please enter last name, first name and phone");
      return;
    }
    try {
      const response = await fetch(
        `${apiEnv}/profile/${localStorage.getItem("user_id")}`,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
            // Authorization: localStorage.getItem("accessToken"), note: not working
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            firstName,
            lastName,
            phone,
            important,
            flower,
            color,
          }),
        }
      );

      const data = await response.json();

      if (data.success) {
        set({ firstName, lastName, phone, important, flower, color });
        // Redirect or update UI
        alert("Adding profile successful!");
      } else {
        // Display error message from server
        alert(data.response || "Adding profile not successful!");
      }
    } catch (error) {
      console.error("Add profile error:", error);
      alert("An error occurred during add profile process.");
    }
  },
  handleUpdateprofile: async () => {
    if (!lastName || !firstName || !phone) {
      alert("Please enter last name, first name and phone");
      return;
    }
    try {
      const response = await fetch(
        `${apiEnv}/profile/${localStorage.getItem("user_id")}`,
        {
          method: "PUT",
          headers: {
            Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            firstName,
            lastName,
            phone,
            important,
            flower,
            color,
          }),
        }
      );

      const data = await response.json();

      if (data.success) {
        set({ firstName, lastName, phone, important, flower, color });
        // Redirect or update UI
        alert("Updating profile successful!");
      } else {
        // Display error message from server
        alert(data.response || "Updating profile not successful!");
      }
    } catch (error) {
      console.error("Updating profile error:", error);
      alert("An error occurred during add profile process.");
    }
  },
  handleGetProfile: async () => {
    try {
      console.log("Entering the try catch");
      const response = await fetch(
        `${apiEnv}/profile/${localStorage.getItem("user_id")}`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
            "Content-type": "application/json",
          },
        }
      );
      if (!response.ok) {
        console.error("Failed to fetch user profile:", response);
        return;
      }
      const data = await response.json();
      console.log(data);
      if (data.response._id) {
        const { firstName, lastName, phone, important, flower, color } =
          data.response;
        console.log("handleGetProfile check");
        set({ firstName, lastName, phone, important, flower, color });
        alert("Fetching user profile successful");
      } else {
        // Display error message from the server
        alert(data.response || "Fetching profile not successful");
      }
    } catch (error) {
      console.error("Error fetching user profile:", error);
      alert("An error occurred during profile fetch process");
    }
  },
}));
