import gsap, { Linear } from "gsap";
import { useEffect, useRef } from "react";

import cl from "./sliderY.module.scss";

interface SliderYProps {
  loaded: boolean;
}

const SliderY: React.FC<SliderYProps> = ({ loaded }) => {
  const isPressed = useRef(false);
  const ref1 = useRef<HTMLDivElement>(null);
  const innerRef1 = useRef<HTMLDivElement>(null);
  const ref2 = useRef<HTMLDivElement>(null);
  const innerRef2 = useRef<HTMLDivElement>(null);
  const images = useRef<HTMLImageElement[]>([]);
  const startY = useRef(0);
  const top1 = useRef(0);
  const top2 = useRef(0);
  const yHistory = useRef<number[]>([]);
  const speed = useRef(-1);
  const direction = useRef(0);
  const smoothId = useRef(0);
  const observerId = useRef(0);
  const animation = useRef<gsap.core.Tween[]>([]);
  const sliderReturning = useRef<boolean[]>([]);

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
      ref={(el) => {
        if (el) images.current[i] = el;
      }}
      onDragStart={(e) => e.preventDefault()}
      key={typeof src === "string" ? src : ""}
      className={cl.item}
      src={typeof src === "string" ? src : ""}
      alt={`image${i}`}
    ></img>
  ));

  images2 = images2.map((src, i) => {
    const ind = i + images1.length;
    return (
      <img
        ref={(el) => {
          if (el) images.current[ind] = el;
        }}
        onDragStart={(e) => e.preventDefault()}
        key={typeof src === "string" ? src : ""}
        className={cl.item}
        src={typeof src === "string" ? src : ""}
        alt={`image${ind}`}
      ></img>
    );
  });

  const start = (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
    if (!ref1.current || !innerRef1.current) return;

    sliderReturning.current[0] = false;
    sliderReturning.current[1] = false;

    cancelAnimationFrame(smoothId.current);
    animation.current[0].kill();
    if (innerRef2.current) animation.current[1].kill();
    sliderReturning.current[0] = false;
    sliderReturning.current[1] = false;

    isPressed.current = true;
    top1.current = parseInt(innerRef1.current.style.top);

    const rect = ref1.current.getBoundingClientRect();
    startY.current = e.nativeEvent.clientY - rect.top;
    if (!ref2.current || !innerRef2.current) return;
    top2.current = parseInt(innerRef2.current.style.top);
  };
  const onMove = (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
    e.preventDefault();

    if (!isPressed.current || !ref1.current || !innerRef1.current) return;
    const rect1 = ref1.current.getBoundingClientRect();

    yHistory.current.shift();
    yHistory.current.push(startY.current - (e.nativeEvent.clientY - rect1.top));

    const newTop1 =
      top1.current -
      (startY.current - (e.nativeEvent.clientY - rect1.top)) * 1.5;
    innerRef1.current.style.top = `${
      top1.current - (top1.current - newTop1)
    }px`;

    if (!ref2.current || !innerRef2.current) return;
    const newTop2 =
      top2.current -
      (startY.current - (e.nativeEvent.clientY - rect1.top)) * 1.5;
    innerRef2.current.style.top = `${
      top2.current + (top2.current - newTop2)
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
    if (!sliderReturning.current.includes(false)) return;
    else if (sliderReturning.current[0]) animationStart(2);
    else if (sliderReturning.current[1]) animationStart(1);
    else animationStart();
  };

  const smooth = () => {
    if (!innerRef1.current || !ref1.current) return;

    yHistory.current.shift();
    yHistory.current.push(0);
    speed.current -= 2;
    top1.current = parseInt(innerRef1.current.style.top);

    const newTop1 =
      direction.current < 0
        ? top1.current + speed.current * 0.05
        : top1.current - speed.current * 0.05;
    innerRef1.current.style.top = `${newTop1}px`;

    if (innerRef2.current && ref2.current) {
      top2.current = parseInt(innerRef2.current.style.top);
      const newTop2 =
        direction.current < 0
          ? top2.current - speed.current * 0.05
          : top2.current + speed.current * 0.05;
      innerRef2.current.style.top = `${newTop2}px`;
    }

    smoothId.current = requestAnimationFrame(smooth);
    if (speed.current <= 0) cancelSmooth();
  };

  const animationStart = (option: number = 0) => {
    if (!innerRef1.current) return;

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
        if (!innerRef2.current) return;
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
        if (!innerRef2.current) return;
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
    if (!innerRef1.current) return;
    const top1 = parseInt(innerRef1.current.style.top);
    let top2 = 0;
    if (innerRef2.current) top2 = parseInt(innerRef2.current.style.top);

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
      innerRef2.current &&
      (top2 >= 0 ||
        top2 <= -innerRef2.current?.clientHeight + window.innerHeight) &&
      !isPressed.current &&
      !sliderReturning.current[1]
    ) {
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

    observerId.current = requestAnimationFrame(observer);
  };

  const init = () => {
    if (innerRef1.current)
      innerRef1.current.style.top = `${-innerRef1.current.clientHeight / 2}px`;
    if (innerRef2.current)
      innerRef2.current.style.top = `${-innerRef2.current.clientHeight / 2}px`;
    animationStart();
  };

  useEffect(() => {
    if (loaded) {
      observer();
      init();
    }
  }, [loaded]);

  useEffect(() => {
    for (let i = 0; i < 20; i++) yHistory.current.push(0);
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
          {window.innerWidth > 660 ? images1 : [...images1, ...images2]}
        </div>
      </div>

      {window.innerWidth > 660 && (
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
      )}
    </div>
  );
};

export default SliderY;
