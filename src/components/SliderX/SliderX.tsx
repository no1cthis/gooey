import gsap, { Back, Elastic } from "gsap";
import Draggable from "gsap/Draggable";
import { useCallback, useEffect, useRef } from "react";
import { useResizeDetector } from "react-resize-detector";
import Button from "../UI/Button/Button";
import cl from "./sliderX.module.scss";

interface SliderXProps {}

type SliderInfo = {
  direction: number;
  width: number;
  offsetFrame: number;
  offsetSliderEnd: number;
};

const SliderX: React.FC<SliderXProps> = () => {
  const slider = useRef<HTMLDivElement>(null);
  const offsetSlider = useRef(0);
  const currentIndex = useRef(0);
  const frame = useRef<HTMLDivElement>(null);
  const items = useRef<(HTMLDivElement | null)[]>([]);
  const line = useRef<HTMLDivElement>(null);

  const { ref: wrapper, width: wrapperWidth } = useResizeDetector();

  let images: (string | JSX.Element)[] = [
    "https://i.pinimg.com/736x/54/5a/2b/545a2bbe89ea845d385ab7c6111b70aa.jpg",
    "https://i.pinimg.com/564x/9d/e6/e0/9de6e0392088ecd7bd882f273caf75d1.jpg",
    "https://i.pinimg.com/564x/3e/3f/e5/3e3fe569746b00469bd38e261e8fb5a6.jpg",
    "https://i.pinimg.com/564x/cd/77/06/cd770680b7cf717edb31b3c11e487718.jpg",
    "https://i.pinimg.com/564x/eb/8b/e3/eb8be33fbb735b7717f559f29b6f94b2.jpg",
    "https://i.pinimg.com/564x/de/e4/b8/dee4b8de3fe6c1e4c9d456fe6a28e11f.jpg",
    "https://i.pinimg.com/564x/f5/8e/73/f58e73747dab077d4c94484dd6b541d9.jpg",
    "https://i.pinimg.com/564x/30/85/64/308564fcbbff547c6a0e970c2ddbd774.jpg",
  ];
  const elements: JSX.Element[] = [];

  images = images.map((src, i) => (
    <img
      key={typeof src === "string" ? src : null}
      className={cl.item}
      ref={(el) => (items.current[i] = el)}
      src={typeof src === "string" ? src : ""}
    />
  ));

  const getInfo: (
    setDirection?: "calc" | "left" | "right"
  ) => SliderInfo | void = useCallback((setDirection = "calc") => {
    const item = items.current[currentIndex.current];
    if (!item?.style || !frame.current || !slider.current) return;

    const offsetFrame = frame.current?.getBoundingClientRect().x;

    const width = parseInt(
      window.getComputedStyle(item, null).getPropertyValue("width")
    );

    const offsetSliderEnd = parseInt(
      slider.current.style.transform.replace(/translate3d\(/g, "")
    );

    let direction = offsetSliderEnd - offsetSlider.current;

    switch (setDirection) {
      case "calc":
        direction = offsetSliderEnd - offsetSlider.current;
        break;
      case "right":
        direction = width * -0.5;
        break;
      case "left":
        direction = width * 0.5;
        break;
    }

    return { direction, width, offsetFrame, offsetSliderEnd };
  }, []);

  const changeBySwipe: (arg: SliderInfo) => void = useCallback(
    ({ direction, width, offsetFrame, offsetSliderEnd }) => {
      let nextItemOffset: number | undefined;
      if (
        direction < -width * 0.3 &&
        currentIndex.current < items.current.length - 1
      )
        nextItemOffset =
          items.current[++currentIndex.current]?.getBoundingClientRect().x;
      else if (direction > width * 0.3 && currentIndex.current > 0)
        nextItemOffset =
          items.current[--currentIndex.current]?.getBoundingClientRect().x;
      else
        nextItemOffset =
          items.current[currentIndex.current]?.getBoundingClientRect().x;
      if (!nextItemOffset) return;

      gsap.to(slider.current, {
        left: 0,
        transform: `translate3d(${
          offsetSliderEnd + offsetFrame - nextItemOffset
        }px, 0px, 0px)`,
        duration: 1,
        ease: Elastic.easeOut.config(1, 0.5),
      });
      changeLine();
    },
    []
  );

  const changeByBtnRight = useCallback(() => {
    let info = getInfo("right");
    if (info) changeBySwipe(info);
    changeLine();
  }, []);
  const changeByBtnLeft = useCallback(() => {
    let info = getInfo("left");
    if (info) changeBySwipe(info);
    changeLine();
  }, []);

  const changeLine = useCallback(() => {
    if (line.current)
      line.current.style.width = `${
        (currentIndex.current / (items.current.length - 1)) * 100
      }%`;
  }, []);

  useEffect(() => {
    const id = setTimeout(() => {
      const info = getInfo();
      if (info) {
        info.direction = 0;
        changeBySwipe(info);
      }
    }, 200);

    return () => {
      clearTimeout(id);
    };
  }, [wrapperWidth]);

  const keyboardButtons = (e: KeyboardEvent) => {
    switch (e.code) {
      case "ArrowLeft":
        changeByBtnLeft();
        break;
      case "ArrowRight":
        changeByBtnRight();
        break;
    }
  };

  useEffect(() => {
    gsap.registerPlugin(Draggable);
    Draggable.create(slider.current, {
      type: "x",
      onDragStart: () => {
        if (!slider.current) return;
        offsetSlider.current = parseInt(
          slider.current.style.transform.replace(/translate3d\(/g, "")
        );
      },
      onDragEnd: () => {
        const info = getInfo();
        if (info) changeBySwipe(info);
      },
    });
    if (slider.current)
      slider.current.style.transform = "translate3d(0px, 0px, 0px)";
    let info = getInfo("right");
    if (info) changeBySwipe(info);

    window.addEventListener("keydown", keyboardButtons);

    return () => {
      window.removeEventListener("keydown", keyboardButtons);
    };
  }, []);
  return (
    <>
      <div className={cl.wrapper} ref={wrapper}>
        <div ref={slider} className={cl.wrapper__inner}>
          {images}
        </div>
        <div ref={frame} className={cl.frame}></div>
      </div>
      <div className={cl.line}>
        <div className={cl.line__inner} ref={line}></div>
      </div>
      <div className={cl.buttons}>
        <div onClick={changeByBtnLeft}>
          <Button left rotateDisabled />
        </div>
        <div onClick={changeByBtnRight}>
          <Button rotateDisabled />
        </div>
      </div>
    </>
  );
};

export default SliderX;
