import { useState, useEffect } from "react";
import { userStore } from "../../stores/userStore";
import { useNavigate, Link } from "react-router-dom";
import { Logo } from "../../components/logo/Logo";
import styles from "./profileForm.module.css";
const apiEnv = import.meta.env.VITE_BACKEND_API;
export const ProfileForm = () => {
  const navigate = useNavigate();
  const id = userStore.getState().id;
  const [profileState, setProfileState] = useState({
    firstName: "",
    lastName: "",
    phone: "",
    color: "",
    flower: "",
    important: "",
    image: "",
  });

  const { lastName, firstName, phone, color, flower, important, image } =
    profileState;
  const [hasProfile, setHasProfile] = useState(false);
  const storeHandleLogout = userStore((state) => state.handleLogout);
  // check if the user has the profile
  const checkProfileStatus = async () => {
    try {
      const response = await fetch(`${apiEnv}/profile/${id}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
        },
      });

      const data = await response.json();
      if (data.success) {
        setProfileState(data.response);
        setHasProfile(true);
      } else {
        setHasProfile(false);
      }
    } catch (error) {
      console.error("Fetch profile error:", error);
    }
  };

  // Call the checkProfileStatus when the component mounts
  useEffect(() => {
    checkProfileStatus();
  }, []);
  const addProfile = async () => {
    if (!lastName || !firstName || !phone) {
      alert("Please enter last name, first name, and phone");
      return;
    }

    const formData = new FormData();
    formData.append("firstName", firstName);
    formData.append("lastName", lastName);
    formData.append("phone", phone);
    formData.append("color", color);
    formData.append("flower", flower);
    formData.append("important", important);
    formData.append("image", image);

    try {
      // console.log(formData);
      // for (const [key, value] of formData.entries()) {
      //   console.log(`${key}: ${value}`);
      // }

      const response = await fetch(`${apiEnv}/profile/${id}`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
          //"Content-Type": "application/json",
          //"Content-Type": "multipart/form-data",
        },
        body: formData,
      });

      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }

      const data = await response.json();
      console.log(data);
      if (data.success) {
        setProfileState((prevState) => ({
          ...prevState,
          firstName,
          lastName,
          phone,
          color,
          flower,
          important,
          image: image,
        }));
        setHasProfile(true);
        alert("Add profile successful!");
        navigate(`/profile/${id}`);
      } else {
        console.log(data.response);
      }
    } catch (error) {
      console.error("Add profile error:", error);
      alert("An error occurred during adding profile process");
    }
  };

  const updateProfile = async () => {
    const formData = new FormData();
    formData.append("firstName", firstName);
    formData.append("lastName", lastName);
    formData.append("phone", phone);
    formData.append("color", color);
    formData.append("flower", flower);
    formData.append("important", important);
    formData.append("image", image);

    try {
      const response = await fetch(`${apiEnv}/profile/${id}`, {
        method: "PATCH",
        headers: {
          Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
        },
        body: formData,
      });

      const data = await response.json();
      console.log(data);
      if (data.success) {
        // Handle the successful update in your component state
        setProfileState((prevState) => ({
          ...prevState,
          firstName,
          lastName,
          phone,
          color,
          flower,
          important,
          image: image,
        }));
        console.log("Update profile successful!");

        navigate(`/profile/${id}`);
      } else {
        console.log(data.response);
      }
    } catch (error) {
      console.error("Update profile error:", error);
    }
  };

  return (
    <div className={styles.profileForm}>
      <nav>
        <ul className={styles.back}>
          <Link to={`/profile/${id}`}>Back</Link>
        </ul>
        <ul className={styles.logo}>
          <Logo />
        </ul>
      </nav>
      <div className={styles.formContainer}>
        <form
          onSubmit={(e) => {
            e.preventDefault();
            hasProfile ? updateProfile() : addProfile();
          }}
          className={styles.form}
        >
          <input
            type="file"
            id="image"
            accept="image/*"
            className={styles.file_image}
            onChange={(e) =>
              setProfileState((prevState) => ({
                ...prevState,
                image: e.target.files[0],
              }))
            }
          />

          <label htmlFor="lastName">Last Name:</label>
          <input
            type="text"
            id="lastName"
            value={profileState.lastName}
            onChange={(e) =>
              setProfileState((prevState) => ({
                ...prevState,
                lastName: e.target.value,
              }))
            }
          />

          <label htmlFor="firstName">First Name:</label>
          <input
            type="text"
            id="firstName"
            value={profileState.firstName}
            onChange={(e) =>
              setProfileState((prevState) => ({
                ...prevState,
                firstName: e.target.value,
              }))
            }
          />

          <label htmlFor="phone">Phone Number:</label>
          <input
            type="tel"
            id="phone"
            value={profileState.phone}
            onChange={(e) =>
              setProfileState((prevState) => ({
                ...prevState,
                phone: e.target.value,
              }))
            }
          />

          <label htmlFor="color">Favorite Color:</label>
          <input
            type="text"
            id="color"
            value={profileState.color}
            onChange={(e) =>
              setProfileState((prevState) => ({
                ...prevState,
                color: e.target.value,
              }))
            }
          />

          <label htmlFor="flower">Favorite Flower:</label>
          <input
            type="text"
            id="flower"
            value={profileState.flower}
            onChange={(e) =>
              setProfileState((prevState) => ({
                ...prevState,
                flower: e.target.value,
              }))
            }
          />

          <label htmlFor="important">Important Date</label>
          <input
            type="text"
            id="important"
            value={profileState.important}
            onChange={(e) =>
              setProfileState((prevState) => ({
                ...prevState,
                important: e.target.value,
              }))
            }
            placeholder="MM-DD"
          />
          <div className={styles.updateBt}>
            <button type="submit">
              {hasProfile ? "Update Profile" : "Add New Profile"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
