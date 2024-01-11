import styles from "../home/home.module.css";
import hero from "../../assets/images/bg.jpeg";
import half from "../../assets/images/half_circle.png";
import { Navbar } from "../../components/navbar/Navbar";
import { MiddleSection } from "./MiddleSection";
import { Stories } from "./Stories";
import { NiceToMeet } from "./NiceToMeet";
import { useNavigate } from "react-router-dom";
import { Footer } from "../../components/footer/Footer";
import { useTranslation } from "react-i18next";
export const Home = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const linkToFlower = () => {
    navigate("/flowers/basic");
  };
  return (
    <>
      <Navbar />
      <section className={styles.hero}>
        <div className={styles.hero_text}>
          <div className={styles.text}>
            <h1>{t("landingPage.header")}</h1>
            <p>{t("landingPage.content1")}</p>
            <p>{t("landingPage.content2")}</p>

            <button
              type="button"
              className={styles.weekly}
              onClick={linkToFlower}
            >
              {t("landingPage.button.weeklyBouquet")}
            </button>
          </div>
        </div>
        <div className={styles.half_container}>
          <img src={half} alt="half circle image" className={styles.half} />
        </div>
        <div className={styles.hero_img}>
          <img src={hero} alt="hero image" />
        </div>
      </section>
      <MiddleSection />
      <Stories />
      <NiceToMeet />
      <Footer />
    </>
  );
};
