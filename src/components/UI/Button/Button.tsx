import { useEffect, useRef } from "react";
import cl from "./button.module.scss";

interface ButtonProps {
  rotateDisabled?: boolean;
  text?: string;
  left?: boolean;
}

const Button: React.FC<ButtonProps> = ({ text, rotateDisabled, left }) => {
  const arrow = useRef<HTMLDivElement>(null);
  const circle = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (left && arrow.current) arrow.current.style.rotate = "180deg";
  }, []);

  return (
    <a href="#!" className={cl.wrapper}>
      <p className={cl.text}>{text}</p>
      <div
        ref={circle}
        className={cl.circle}
        onMouseEnter={() => {
          if (!arrow.current || !circle.current) return;
          if (!rotateDisabled) arrow.current.style.rotate = "360deg";
          circle.current.style.transform = rotateDisabled
            ? "scale(1.1)"
            : "scale(1.3)";
        }}
        onMouseLeave={() => {
          if (!arrow.current || !circle.current) return;
          if (!rotateDisabled || !left) arrow.current.style.rotate = "0deg";
          circle.current.style.transform = "scale(1)";
        }}
      >
        <div ref={arrow} className={cl.arrow}></div>
      </div>
    </a>
  );
};

export default Button;
