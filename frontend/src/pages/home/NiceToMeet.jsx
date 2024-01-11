import styles from "./niceTomeet.module.css";
import data from "../../translation/english.json";
import { useTranslation } from "react-i18next";
export const NiceToMeet = () => {
  const { t } = useTranslation();
  return (
    <section className={styles.nice_to_meet}>
      {data.meet && (
        <div key={data.meet.title} className={styles.wrapper}>
          <div className={styles.img_wrapper}>
            <img src={data.meet.image} alt={data.meet.title} />
          </div>
          <div className={styles.content}>
            <h1>{t("meet.title")}</h1>
            <h2>{t("meet.name")}</h2>
            <p>{t("meet.content1")}</p>
            <p>{t("meet.content2")}</p>
            <p>{t("meet.content3")}</p>
            <button type="button" className={styles.contact}>
              {t("landingPage.button.contactUs")}
            </button>
          </div>
        </div>
      )}
    </section>
  );
};
