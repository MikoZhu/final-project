import { userStore } from "../../stores/userStore";
import { profileStore } from "../../stores/profileStore";
import { useNavigate } from "react-router-dom";
import { useEffect } from "react";

export const Profile = () => {
  const { isLoggedIn, accessToken } = userStore();
  const navigate = useNavigate();
  const storeHandleGetProfile = profileStore((state) => state.handleGetProfile);
  const storeHandleLogout = userStore((state) => state.handleLogout);
  useEffect(() => {
    if (!isLoggedIn || !accessToken) {
      alert("You don't have permission, please log in first!");
      navigate("/login");
    }
  }, [isLoggedIn, accessToken, navigate]);

  const onGetProfileClick = async () => {
    storeHandleGetProfile();
  };
  const onLogoutClick = async () => {
    storeHandleLogout();
    alert("Log out successfull");
    navigate("/login");
  };

  if (!isLoggedIn) {
    return null;
  }
  return (
    <div>
      <h1>We will continue to work with this profile page with private part</h1>
      <nav>
        <ul>
          <li type="button" onClick={onLogoutClick}>
            Sign Out
          </li>
          <li>
            <button onClick={onGetProfileClick}>Get user Profile</button>
          </li>
        </ul>
      </nav>
    </div>
  );
};
