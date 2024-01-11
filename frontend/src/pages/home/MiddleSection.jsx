import styles from "../home/middleSection.module.css";
import basic from "../../assets/images/flower1.png";
import standard from "../../assets/images/flower2.png";
import large from "../../assets/images/flower3.png";
import arrow from "../../assets/icons/right-arrow.png";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
export const MiddleSection = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();

  return (
    <section className={styles.middle}>
      <div className={styles.greenBg}></div>

      <div className={styles.flowers}>
        <img src={basic} alt="Basic image" className={styles.image} />
        <div className={styles.box}>
          <h3>{t("bouquetType.basic")}</h3>
          <img
            src={arrow}
            alt="right arrow"
            className={styles.arrow}
            aria-label="button"
            onClick={() => navigate("/flowers/basic")}
          />
        </div>
      </div>
      <div className={styles.flowers}>
        <img src={standard} alt="Standard image" />
        <div className={styles.box}>
          <h3>{t("bouquetType.standard")}</h3>
          <img
            src={arrow}
            alt="right arrow"
            className={styles.arrow}
            aria-label="button"
            onClick={() => navigate("/flowers/standard")}
          />
        </div>
      </div>
      <div className={styles.flowers}>
        <img src={large} alt="Large image" />
        <div className={styles.box}>
          <h3>{t("bouquetType.large")}</h3>
          <img
            src={arrow}
            alt="right arrow"
            className={styles.arrow}
            aria-label="button"
            onClick={() => navigate("/flowers/large")}
          />
        </div>
      </div>
    </section>
  );
};
