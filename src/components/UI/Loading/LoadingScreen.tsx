import { forwardRef } from "react";
import cl from "./loadingScreen.module.scss";

interface LoadingScreenProps {}

const LoadingScreen = forwardRef<HTMLDivElement, LoadingScreenProps>(
  (props, ref) => {
    return (
      <div style={{ top: window.scrollY }} ref={ref} className={cl.wrapper}>
        Loading...
      </div>
    );
  }
);

export default LoadingScreen;
