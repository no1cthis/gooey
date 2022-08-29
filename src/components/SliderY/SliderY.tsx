import gsap, { Linear } from "gsap";
import { useCallback, useEffect, useRef, useState } from "react";

import cl from "./sliderY.module.scss";

interface SliderYProps {
  setLoaded: React.Dispatch<React.SetStateAction<boolean>>;
  loaded: boolean;
}

const SliderY: React.FC<SliderYProps> = ({ setLoaded, loaded }) => {
  const isPressed = useRef(false);
  const ref1 = useRef<HTMLDivElement>(null);
  const innerRef1 = useRef<HTMLDivElement>(null);
  const ref2 = useRef<HTMLDivElement>(null);
  const innerRef2 = useRef<HTMLDivElement>(null);
  const startY = useRef(0);
  const top1 = useRef(0);
  const top2 = useRef(0);
  const yHistory = useRef<number[]>([]);
  const speed = useRef(-1);
  const direction = useRef(0);
  const smoothId = useRef(0);
  const observerId = useRef(0);
  const animation = useRef<gsap.core.Tween[]>([]);
  const loadedRef = useRef<boolean[]>([]);
  const sliderReturning = useRef<boolean[]>([]);

  // const [loaded, setLoaded] = useState(false);

  let images1: (string | JSX.Element)[] = [
    "https://i.redd.it/tlq6lrfkzak51.png",
    "https://c0.wallpaperflare.com/preview/900/707/759/shinjuku-japan-night-tokyo.jpg",
    "https://i.pinimg.com/originals/81/4d/bf/814dbf1f482606f6d7d61365f6fb4d51.jpg",
    "https://images-wixmp-ed30a86b8c4ca887773594c2.wixmp.com/f/287eab66-0f73-4b97-8e74-849c5f06d542/ddnitzs-a6c16223-5940-400a-9a8e-7845cdd519f6.jpg/v1/fill/w_1096,h_729,q_70,strp/bursts_of_ambient_color_by_anthonypresley_ddnitzs-pre.jpg?token=eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJzdWIiOiJ1cm46YXBwOjdlMGQxODg5ODIyNjQzNzNhNWYwZDQxNWVhMGQyNmUwIiwiaXNzIjoidXJuOmFwcDo3ZTBkMTg4OTgyMjY0MzczYTVmMGQ0MTVlYTBkMjZlMCIsIm9iaiI6W1t7ImhlaWdodCI6Ijw9Nzk5IiwicGF0aCI6IlwvZlwvMjg3ZWFiNjYtMGY3My00Yjk3LThlNzQtODQ5YzVmMDZkNTQyXC9kZG5pdHpzLWE2YzE2MjIzLTU5NDAtNDAwYS05YThlLTc4NDVjZGQ1MTlmNi5qcGciLCJ3aWR0aCI6Ijw9MTIwMCJ9XV0sImF1ZCI6WyJ1cm46c2VydmljZTppbWFnZS5vcGVyYXRpb25zIl19.MjIB5xtwDL7_vaJufBCgjXW7JJei7m4Mc44kKyCznvc",
    "https://i.pinimg.com/originals/f9/30/7e/f9307e11fd69652b0ef3eda840776451.jpg",
    "https://i.pinimg.com/originals/2d/ae/63/2dae6371626025d70cb690f3b7e1b89b.jpg",
  ];
  let images2: (string | JSX.Element)[] = [
    "https://i.pinimg.com/564x/7d/39/0d/7d390ddfe36d4e3fd8d6eab4e0ba3adf.jpg",
    "https://i.pinimg.com/originals/d6/4e/37/d64e378c7445b02c53e0ce04cfb30971.jpg",
    "https://i.pinimg.com/originals/7f/fe/a0/7ffea0d1d40026600e1087ad34e30837.jpg",
    "https://i.pinimg.com/originals/5c/61/3e/5c613ec7537bc3f211c9406f514ac5a5.jpg",
    "https://i.pinimg.com/originals/5a/34/2b/5a342bd8df05802b7c7c59bd358276af.jpg",
    "https://i.pinimg.com/originals/1b/6a/f7/1b6af732116c2ccacfd30d61fd3c2bff.jpg",
  ];

  images1 = images1.map((src, i) => (
    <img
      key={typeof src === "string" ? src : ""}
      className={cl.item}
      src={typeof src === "string" ? src : ""}
      onLoad={() => {
        loadedRef.current[i] = true;
      }}
    ></img>
  ));
  images2 = images2.map((src, i) => (
    <img
      key={typeof src === "string" ? src : ""}
      className={cl.item}
      src={typeof src === "string" ? src : ""}
      onLoad={() => {
        loadedRef.current[i + images1.length] = true;
      }}
    ></img>
  ));

  const start = (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
    if (
      !ref1.current ||
      !innerRef1.current ||
      !ref2.current ||
      !innerRef2.current
      // (sliderReturning.current[0] && sliderReturning.current[1])
    )
      return;

    console.log(sliderReturning.current[0], sliderReturning.current[1]);

    sliderReturning.current[0] = false;
    sliderReturning.current[1] = false;

    cancelAnimationFrame(smoothId.current);
    animation.current[0].kill();
    animation.current[1].kill();
    sliderReturning.current[0] = false;
    sliderReturning.current[1] = false;

    isPressed.current = true;
    top1.current = parseInt(innerRef1.current.style.top);
    top2.current = parseInt(innerRef2.current.style.top);
    const rect = ref1.current.getBoundingClientRect();
    startY.current = e.nativeEvent.clientY - rect.top;
  };
  const onMove = (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
    e.preventDefault();

    if (
      !isPressed.current ||
      !ref1.current ||
      !ref2.current ||
      !innerRef1.current ||
      !innerRef2.current
    )
      return;
    const rect1 = ref1.current.getBoundingClientRect();

    yHistory.current.shift();
    yHistory.current.push(startY.current - (e.nativeEvent.clientY - rect1.top));

    const newTop1 =
      top1.current -
      (startY.current - (e.nativeEvent.clientY - rect1.top)) * 1.5;

    innerRef1.current.style.top = `${
      top1.current - (top1.current - newTop1)
    }px`;
    innerRef2.current.style.top = `${
      top2.current + (top1.current - newTop1)
    }px`;
  };

  const finish = () => {
    const last = yHistory.current.length - 1;
    direction.current = yHistory.current[last] - yHistory.current[0];
    speed.current = Math.abs(direction.current);
    if (
      isPressed.current &&
      (!sliderReturning.current[0] || !sliderReturning.current[1])
    )
      smooth();
    isPressed.current = false;
  };

  const cancelSmooth = () => {
    cancelAnimationFrame(smoothId.current);
    yHistory.current = yHistory.current.map(() => 0);
    console.log("stop Smooth", yHistory.current);
    if (!sliderReturning.current.includes(false)) return;
    else if (sliderReturning.current[0]) animationStart(2);
    else if (sliderReturning.current[1]) animationStart(1);
    else animationStart();
  };

  const smooth = () => {
    if (
      !innerRef1.current ||
      !innerRef2.current ||
      !ref1.current ||
      !ref2.current
    )
      return;

    console.log("smooth");
    yHistory.current.shift();
    yHistory.current.push(0);
    speed.current -= 2;
    top1.current = parseInt(innerRef1.current.style.top);
    top2.current = parseInt(innerRef2.current.style.top);
    const newTop1 =
      direction.current < 0
        ? top1.current + speed.current * 0.05
        : top1.current - speed.current * 0.05;
    const newTop2 =
      direction.current < 0
        ? top2.current - speed.current * 0.05
        : top2.current + speed.current * 0.05;

    innerRef1.current.style.top = `${newTop1}px`;
    innerRef2.current.style.top = `${newTop2}px`;

    //borders 1
    // if (
    //   window.innerHeight - top1.current < window.innerHeight / 2 ||
    //   (speed.current < 0 &&
    //     window.innerHeight - top1.current < window.innerHeight)
    // ) {
    //   animation.current[0].kill();
    //   animation.current[0] = gsap.to(innerRef1.current, {
    //     top: -innerRef1.current.clientHeight / 2,
    //     duration: 3,
    //   });
    // }

    // if (
    //   window.innerHeight - top1.current >
    //     innerRef1.current.clientHeight + window.innerHeight / 2 ||
    //   (speed.current < 0 &&
    //     window.innerHeight - top1.current > innerRef1.current.clientHeight)
    // ) {
    //   animation.current[0].kill();
    //   animation.current[0] = gsap.to(innerRef1.current, {
    //     top: -innerRef1.current.clientHeight / 2,
    //     duration: 3,
    //   });
    // }

    //borders 2
    // if (
    //   window.innerHeight - top2.current < window.innerHeight / 2 ||
    //   (speed.current < 0 &&
    //     window.innerHeight - top2.current < window.innerHeight)
    // ) {
    //   animation.current[1].kill();
    //   animation.current[1] = gsap.to(innerRef2.current, {
    //     top: -innerRef2.current.clientHeight / 2,
    //     duration: 3,
    //   });
    // }

    // if (
    //   window.innerHeight - top2.current >
    //     innerRef2.current.clientHeight + window.innerHeight / 2 ||
    //   (speed.current < 0 &&
    //     window.innerHeight - top2.current > innerRef2.current.clientHeight)
    // ) {
    //   animation.current[1].kill();
    //   animation.current[1] = gsap.to(innerRef2.current, {
    //     top: -innerRef2.current.clientHeight / 2,
    //     duration: 3,
    //   });
    // }

    smoothId.current = requestAnimationFrame(smooth);
    if (speed.current <= 0) cancelSmooth();
  };

  const animationStart = (option: number = 0) => {
    if (!innerRef2.current || !innerRef1.current) return;

    switch (option) {
      case 0: {
        animation.current[0] = gsap.to(innerRef1.current, {
          top: 0,
          duration:
            (parseInt(innerRef1.current?.style.top) /
              (-innerRef1.current?.clientHeight + window.innerHeight)) *
            60,
          ease: Linear.easeNone,
        });

        animation.current[1] = gsap.to(innerRef2.current, {
          top: -(innerRef2.current.clientHeight - window.innerHeight),
          duration:
            (1 -
              parseInt(innerRef2.current?.style.top) /
                (-innerRef2.current?.clientHeight + window.innerHeight)) *
            60,
          ease: Linear.easeNone,
        });
        break;
      }
      case 1: {
        console.log(
          "1",

          parseInt(innerRef1.current?.style.top) /
            (-innerRef1.current?.clientHeight + window.innerHeight)
        );
        animation.current[0] = gsap.to(innerRef1.current, {
          top: 0,
          duration:
            (parseInt(innerRef1.current?.style.top) /
              (-innerRef1.current?.clientHeight + window.innerHeight)) *
            60,
          ease: Linear.easeNone,
        });

        break;
      }
      case 2: {
        console.log("2");
        animation.current[1] = gsap.to(innerRef2.current, {
          top: -(innerRef2.current.clientHeight - window.innerHeight),
          duration:
            (1 -
              parseInt(innerRef2.current?.style.top) /
                (-innerRef2.current?.clientHeight + window.innerHeight)) *
            45,
          ease: Linear.easeNone,
        });
        break;
      }
    }
  };

  const observer = () => {
    if (!innerRef2.current || !innerRef1.current) return;
    const top1 = parseInt(innerRef1.current.style.top);
    const top2 = parseInt(innerRef2.current.style.top);

    console.log(top2, -innerRef2.current?.clientHeight + window.innerHeight);

    if (
      (top1 >= 0 ||
        top1 <= -innerRef1.current?.clientHeight + window.innerHeight) &&
      !isPressed.current &&
      !sliderReturning.current[0]
    ) {
      sliderReturning.current[0] = true;
      animation.current[0].kill();
      animation.current[0] = gsap.to(innerRef1.current, {
        top: -innerRef1.current.clientHeight / 2,
        duration: 2,
      });
      animation.current[0].then(() => {
        sliderReturning.current[0] = false;
        animationStart(1);
      });
    }
    if (
      (top2 >= 0 ||
        top2 <= -innerRef2.current?.clientHeight + window.innerHeight) &&
      !isPressed.current &&
      !sliderReturning.current[1]
    ) {
      // finish();
      console.log("2");
      sliderReturning.current[1] = true;
      animation.current[1].kill();
      animation.current[1] = gsap.to(innerRef2.current, {
        top: -innerRef2.current.clientHeight / 2,
        duration: 2,
      });
      animation.current[1].then(() => {
        sliderReturning.current[1] = false;
        animationStart(2);
      });
    }

    if (
      (innerRef1.current.style.top >= "0px" ||
        innerRef2.current?.style.top >=
          `${-innerRef2.current?.clientHeight + window.innerHeight}px`) &&
      !isPressed.current
    ) {
      console.log("if");
      innerRef1.current.style.pointerEvents = "none";
      innerRef2.current.style.pointerEvents = "none";
      speed.current = 0;
    } else {
      if (!innerRef1.current || !innerRef2.current) return;
      innerRef1.current.style.pointerEvents = "all";
      innerRef2.current.style.pointerEvents = "all";
    }
    observerId.current = requestAnimationFrame(observer);
  };

  const init = () => {
    if (!innerRef1.current || !innerRef2.current) return;
    innerRef1.current.style.top = `${-innerRef1.current.clientHeight / 2}px`;
    innerRef2.current.style.top = `${-innerRef2.current.clientHeight / 2}px`;
    animationStart();
  };

  const isLoaded = () => {
    const id = requestAnimationFrame(isLoaded);

    if (!loadedRef.current.includes(false)) {
      setLoaded(true);
      observer();
      init();
      cancelAnimationFrame(id);
    }
  };

  useEffect(() => {
    for (let i = 0; i < 20; i++) yHistory.current.push(0);

    for (let i = 0; i < images1.length + images2.length; i++)
      loadedRef.current[i] = false;

    isLoaded();
    return () => {
      cancelAnimationFrame(observerId.current);
    };
  }, []);

  return (
    <div className={cl.container}>
      <div className={cl.wrapper} ref={ref1}>
        <div
          className={cl.wrapper__inner}
          onMouseDown={start}
          onMouseUp={finish}
          onMouseMove={onMove}
          onMouseLeave={(e) => {
            e.preventDefault();
            finish();
          }}
          ref={innerRef1}
        >
          {images1}
        </div>
      </div>

      <div className={cl.wrapper} ref={ref2}>
        <div
          className={cl.wrapper__inner}
          onMouseDown={start}
          onMouseUp={finish}
          onMouseMove={onMove}
          onMouseLeave={finish}
          ref={innerRef2}
        >
          {images2}
        </div>
      </div>
    </div>
  );
};

export default SliderY;
