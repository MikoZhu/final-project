import styles from "../navbar/navbar.module.css";
import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import { Logo } from "../../components/logo/Logo";
import down from "../../assets/icons/icons8-down-64.png";
import hamburgerIcon from "../../assets/icons/hamburger.png";

export const Navbar = () => {
  const { t } = useTranslation();
  const [showOptions, setShowOptions] = useState(false);
  const [showMobileMenu, setShowMobileMenu] = useState(false);
  const navigate = useNavigate();

  // Retrieve user ID from local storage
  const userId = localStorage.getItem("userID");

  const handleCartClick = (event) => {
    // Prevent default Link behavior
    event.preventDefault();
    if (userId) {
      navigate(`/cart/${userId}`);
    } else {
      navigate("/login");
    }
  };

  const toggleOptions = () => {
    setShowOptions(!showOptions);
  };
  const toggleMobileMenu = () => {
    setShowMobileMenu(!showMobileMenu);
  };
  return (
    <section className={styles.section}>
      <div className={styles.header}>
        <div className={styles.logo}>
          <Logo />
        </div>
        {/* mobile menu */}

        <nav className={styles.navbar}>
          <div className={styles.mobileNavbar}>
            <img
              src={hamburgerIcon}
              alt="hamburger icon"
              className={styles.hamburgerIcon}
              onClick={toggleMobileMenu}
            />
            {showMobileMenu && (
              <div className={styles.mobile}>
                <li className={styles.flower}>
                  <span onClick={toggleOptions}>
                    {t("navbar.weeklyBouquet")}
                  </span>
                  <img
                    src={down}
                    alt="down arrow"
                    className={styles.down}
                    onClick={toggleOptions}
                  />
                  {showOptions && (
                    <ul className={styles.mobile_options}>
                      <li>
                        <Link to="/flowers/basic">
                          {t("bouquetType.basic")}
                        </Link>
                      </li>
                      <li>
                        <Link to="/flowers/standard">
                          {t("bouquetType.standard")}
                        </Link>
                      </li>
                      <li>
                        <Link to="/flowers/large">
                          {t("bouquetType.large")}
                        </Link>
                      </li>
                    </ul>
                  )}
                </li>

                <Link to="/login" className={styles.linkContainer}>
                  {t("navbar.myAccount")}
                </Link>
                <Link
                  to={`/cart/${userId}`}
                  onClick={handleCartClick}
                  className={styles.linkContainer}
                >
                  {t("navbar.cart")}
                </Link>
              </div>
            )}
          </div>

          {/* Desktop menu */}
          {/* {!showMobileMenu && ( */}
          <ul className={styles.ul}>
            <li className={styles.flower}>
              <span onClick={toggleOptions}>{t("navbar.weeklyBouquet")}</span>
              <img
                src={down}
                alt="down arrow"
                className={styles.down}
                onClick={toggleOptions}
              />
              {showOptions && (
                <ul className={styles.options}>
                  <li>
                    <Link to="/flowers/basic">{t("bouquetType.basic")}</Link>
                  </li>
                  <li>
                    <Link to="/flowers/standard">
                      {t("bouquetType.standard")}
                    </Link>
                  </li>
                  <li>
                    <Link to="/flowers/large">{t("bouquetType.large")}</Link>
                  </li>
                </ul>
              )}
            </li>

            <Link to="/login" className={styles.linkContainer}>
              {t("navbar.myAccount")}
            </Link>
            <Link
              to={`/cart/${userId}`}
              onClick={handleCartClick}
              className={styles.linkContainer}
            >
              {t("navbar.cart")}
            </Link>
          </ul>
          {/* )} */}
        </nav>
      </div>
    </section>
  );
};
