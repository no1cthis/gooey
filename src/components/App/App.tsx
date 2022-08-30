import { useEffect, useRef, useState } from "react";
import cl from "./app.module.scss";
import ErasableImage from "../UI/ErasableImage/ErasableImage";
import Cursor from "../UI/Cursor/Cursor";
import Button from "../UI/Button/Button";
import LineText from "../UI/LineText/LineText";
import gsap from "gsap";
import Text from "../Text/Text";
import RightImage from "../RightImage/RightImage";
import WiseWords from "../WiseWords/WiseWords";
import SliderY from "../SliderY/SliderY";
import SliderX from "../SliderX/SliderX";
import { useResizeDetector } from "react-resize-detector";
import LoadingScreen from "../UI/Loading/LoadingScreen";

import photo1 from "../../assets/photo1.jpg";
import back1 from "../../assets/back1.jpg";
import photo2 from "../../assets/photo2.jpg";
import back2 from "../../assets/back2.jpg";
import MobileDetect from "mobile-detect";

function App() {
  let firtsLine: string | JSX.Element[] = "sample";
  let secondLine: string | JSX.Element[] = "text";
  const [loaded, setLoaded] = useState(false);
  const [textArray, setTextArray] = useState<boolean[]>([]);
  const [widthImage, setWidthImage] = useState(100);
  const images = useRef<(HTMLDivElement | null)[]>([]);
  const letters = useRef<(HTMLSpanElement | null)[]>([]);
  const loadingScreen = useRef<HTMLDivElement>(null);
  const loadingID = useRef(0);

  const { ref: container, width: widthContainer } = useResizeDetector();

  const isMobile = new MobileDetect(window.navigator.userAgent);

  const letterSpansFromString = (str: string, shift: number = 0) => {
    return Array.from(str).map((letter, i) => (
      <span
        ref={(el) => (letters.current[i] = el)}
        key={`span${letter + i.toString()}`}
        className={`${cl.title__letter} ${
          textArray[i + shift] ? null : cl.title__hidden
        }`}
        onMouseEnter={() => {
          if (textArray[i + shift] === true) return;
          const tempTextArray = [...textArray];
          tempTextArray[i + shift] = true;
          setTextArray(tempTextArray);
        }}
      >
        {letter}
      </span>
    ));
  };
  firtsLine = letterSpansFromString(firtsLine);
  secondLine = letterSpansFromString(secondLine, firtsLine.length);

  useEffect(() => {
    if (widthContainer)
      setWidthImage(
        window.innerWidth > 550 ? widthContainer * 0.4 : widthContainer
      );
  }, [widthContainer]);

  const init = () => {
    document.body.style.overflowY = "auto";
    const tempTextArray = [];
    for (let i = 0; i < firtsLine.length + secondLine.length; i++) {
      if (i === 0 || i === firtsLine.length) tempTextArray.push(true);
      else tempTextArray.push(false);
    }

    setTextArray(tempTextArray);
    images.current.forEach((el, i) => {
      gsap.fromTo(
        el,
        {
          y: 300,
          opacity: 0,
          duration: 1,
          delay: i * 0.3,
        },
        {
          y: 0,
          opacity: 1,
          duration: 1,
        }
      );
    });
  };

  useEffect(() => {
    if (!loaded || !loadingScreen.current) return;
    document.body.style.height = "auto";
    gsap
      .to(loadingScreen.current, {
        opacity: 0,
        duration: 1,
        zIndex: -1000,
      })
      .then(() => init());
  }, [loaded]);

  useEffect(() => {
    loading();
  }, []);

  const loading = () => {

    if (document.readyState === "complete") {
      setLoaded(true);
      cancelAnimationFrame(loadingID.current);
      return;
    }

    loadingID.current = requestAnimationFrame(loading);
  };

  return (
    <div>
      <div className={cl.container} ref={container}>
        <div className={cl.title}>
          <div className={cl.title__up}>{firtsLine}</div>
          <div className={cl.title__down}>{secondLine}</div>
        </div>

        <div className={cl.images}>
          <div
            className={cl.images__item}
            ref={(el) => (images.current[0] = el)}
          >
            <ErasableImage
              height={widthImage * (12 / 9)}
              width={widthImage}
              imageSource={photo1}
              // "http://i.share.pho.to/3f8db35a_o.jpeg"
              backgroundImageSource={back1}
              //"https://i.pinimg.com/564x/9d/e6/e0/9de6e0392088ecd7bd882f273caf75d1.jpg"
              radius={20}
            />
          </div>
          <div
            className={cl.images__item}
            ref={(el) => (images.current[1] = el)}
          >
            <ErasableImage
              height={widthImage * (12 / 9)}
              width={widthImage}
              backgroundImageSource={back2}
              // "http://i.share.pho.to/f936131f_o.jpeg"
              imageSource={photo2}
              // "https://i.pinimg.com/564x/cd/77/06/cd770680b7cf717edb31b3c11e487718.jpg"
            />
          </div>
        </div>

        <div className={cl.button__wrapper}>
          <Button text="do nothing" />
        </div>
      </div>
      <LineText />
      <div className={cl.container}>{loaded && <Text />}</div>

      <RightImage />
      <div className={cl.container}>
        <div className={cl.button__wrapper}>
          <Button text="do nothing" />
        </div>
        <WiseWords />
      </div>

      <SliderY loaded={loaded} />
      <SliderX />
      <LoadingScreen ref={loadingScreen} />

      {!isMobile.mobile() && <Cursor />}
    </div>
  );
}

export default App;
