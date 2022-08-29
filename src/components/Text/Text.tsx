import gsap, { Circ } from "gsap";
import ScrollTrigger from "gsap/src/ScrollTrigger";
import { useEffect, useRef } from "react";
import cl from "./text.module.scss";

interface TextProps {}

const Text: React.FC<TextProps> = () => {
  const linesRef = useRef<(HTMLParagraphElement | null)[]>([]);
  let lines: (string | JSX.Element)[] = [
    "Lorem ipsum dolor sit amet.",
    "A numquam eius eum commodi aspernatur",
    "eos, laborum dolorem placeat distinctio dicta",
    "corrupti doloremque, voluptate pariatur sint",
    "nobis?",
  ];

  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger);
    linesRef.current.forEach((el, i) => {
      gsap.from(el, {
        scrollTrigger: linesRef.current[0],
        opacity: 0,
        y: el?.clientHeight,
        duration: 0.6,
        delay: i * 0.2,
        ease: Circ.easeOut,
      });
    });
  }, []);

  lines = lines.map((line, i) => (
    <div key={line.toString()} className={cl.line__wrapper}>
      <p
        className={`${cl.line} ${i === 0 ? cl.firstline : null}`}
        ref={(el) => (linesRef.current[i] = el)}
      >
        {line}
      </p>
    </div>
  ));
  return <div className={cl.text}>{[lines]}</div>;
};

export default Text;
