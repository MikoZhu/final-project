import styles from "./stories.module.css";
import left_arrow from "../../assets/icons/left-arrow-black.png";
import right_arrow from "../../assets/icons/right-arrow-black.png";
import { Slide } from "react-slideshow-image";
import "react-slideshow-image/dist/styles.css";
import data from "../../translation/english.json";
import { useTranslation } from "react-i18next";

const buttonStyle = {
  border: "none",
  background: "none",
  width: "30px",
  margin: "0 2px 0 -7px",
};
const properties = {
  prevArrow: (
    <button style={{ ...buttonStyle }}>
      <img src={left_arrow} alt="left arrow" style={{ width: "30px" }} />
    </button>
  ),
  nextArrow: (
    <button style={{ ...buttonStyle }}>
      <img src={right_arrow} alt="right arrow" style={{ width: "30px" }} />
    </button>
  ),
};

export const Stories = () => {
  const { t } = useTranslation();
  const slideImages = data.stories.map((story) => story.image);

  return (
    <section className={styles.stories}>
      <h1>{t("landingPage.storiesTitle")}</h1>
      <Slide
        images={slideImages}
        slidesToScroll={1}
        slidesToShow={1}
        indicators={true}
        autoplay={false}
        {...properties}
      >
        {data.stories.map((story) => (
          <div key={story.id} className={styles.wrapper}>
            <img
              src={story.image}
              alt="wither image"
              className={styles.image}
            />
            <h3>{t(`stories.${story.id - 1}.title`)}</h3>

            {/* <img src={left_arrow} alt="left arrow" className={styles.arrow} /> */}
            <p>{t(`stories.${story.id - 1}.content`)}</p>
            {/* <img
                src={right_arrow}
                alt="right arrow"
                className={styles.arrow}
              /> */}
          </div>
        ))}
      </Slide>
    </section>
  );
};
