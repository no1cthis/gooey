import gsap, { Linear } from "gsap";
import { useEffect, useRef } from "react";
import cl from "./lineText.module.scss";

interface LineTextProps {}

const LineText: React.FC<LineTextProps> = () => {
  const textRef = useRef<HTMLDivElement>(null);

  const text1 = "keep scrolling";
  const text2 = "text sample";
  let text = "";
  for (let i = 0; i < 10; i++) {
    text += `  ${text1}  ·  ${text2}  ·`;
  }

  useEffect(() => {
    if (textRef.current)
      gsap
        .to(textRef.current, {
          x: -textRef.current.clientWidth * 0.7,
          duration: 30,
          ease: Linear.easeNone,
        })
        .repeat(Infinity);
  }, []);

  return (
    <div className={cl.line}>
      <div ref={textRef} className={cl.line__text}>
        {text}
      </div>
    </div>
  );
};

export default LineText;
