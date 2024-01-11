import { useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { userStore } from "../../stores/userStore";
import { useParams } from "react-router-dom";
import { profileStore } from "../../stores/profileStore";
import styles from "./profile.module.css";
import { Logo } from "../../components/logo/Logo";
import { format } from "date-fns";
import { useTranslation } from "react-i18next";
export const Profile = () => {
  const { t } = useTranslation();
  const { id } = useParams();
  const { isLoggedIn, accessToken } = userStore();
  const { firstName, lastName, phone, color, flower, important, image } =
    profileStore();
  const navigate = useNavigate();
  const fetchData = profileStore((state) => state.fetchProfile);
  const storeHandleLogout = userStore((state) => state.handleLogout);
  useEffect(() => {
    if (!isLoggedIn || !accessToken) {
      alert("You don't have permission, please log in first!");
      navigate("/login");
    }
  }, [isLoggedIn, accessToken, navigate]);
  useEffect(() => {
    fetchData();
  }, []);
  const onLogoutClick = async () => {
    alert("Log out successfull");
    storeHandleLogout();
    navigate("/login");
  };
  const backClick = async () => {
    navigate("/");
  };

  if (!isLoggedIn) {
    return null;
  }
  return (
    <div className={styles.profile}>
      <nav>
        <ul className={styles.title}>
          <Link to="/" onClick={backClick}>
            {t("profile.back")}
          </Link>
          <Logo />
          <li type="button" onClick={onLogoutClick}>
            {t("profile.logOut")}
          </li>
        </ul>
        <img src={image} alt="profile image" className={styles.profile_image} />
        <ul className={styles.cart_profile}>
          <Link to={`/cart/${id}`}>{t("profile.cart")}</Link>
          <br />
          <Link to={`/profile/${id}/edit`}>{t("profile.edit")}</Link>
        </ul>
      </nav>
      <div className={styles.info}>
        <h1>{t("profile.personal")}</h1>
        <div className={styles.text}>
          <p>
            {t("profile.lastName")} <span>{lastName}</span>
          </p>

          <p>
            {t("profile.firstName")} <span>{firstName}</span>
          </p>

          <p>
            {t("profile.phone")} <span>{phone}</span>
          </p>
          <p>
            {t("profile.color")} <span>{color}</span>
          </p>

          <p>
            {t("profile.flower")} <span>{flower}</span>
          </p>
          <p>
            {t("profile.date")}{" "}
            <span>{format(new Date(important), "dd-MM")}</span>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Profile;
