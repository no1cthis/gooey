import gsap from "gsap";
import ScrollTrigger from "gsap/ScrollTrigger";
import { useEffect, useRef } from "react";
import cl from "./rightImage.module.scss";

interface RightImageProps {}

const RightImage: React.FC<RightImageProps> = () => {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {

    gsap.registerPlugin(ScrollTrigger);
    gsap.from(ref.current, {
      xPercent: ref.current?.clientWidth,
      opacity: 0,
      scrollTrigger: {
        trigger: ref.current,
        start: `top center`,
        end: "+=500",
        scrub: true,
      },
    });
  }, []);

  return (
    <div className={cl.wrapper} ref={ref}>
      <img
        className={cl.image}
        src="https://fashionfav.com/wp-content/uploads/2016/03/Georgia-Hilmer-By-Hans-Neumann-For-Models-14.jpg"
        alt="model photo"
      />

      <p className={cl.text}>
        <span>
          {`MODEL: GEORGIA HILMER / PHOTOGRAPHER: HANS NEUMANN STYLIST: ASHLEY
          OWENS / HAIR STYLIST: NICOLAS ELDIN MAKEUP ARTIST: YACINE DIALLO /
          NAIL ARTIST: KAYO DIRECTOR OF PHOTOGRAPHY AND EDITING: ALAIN AGUILAR
          ART DIRECTION: STEPHAN MOSKOVIC / SET DESIGNER: CHRIS MURDOCH
          `}
          <br />
        </span>
        Lorem ipsum dolor sit amet consectetur adipisicing elit. Quas enim quam
        magni nostrum quidem, et sequi quod a. Fuga dolore quis, ipsa dolorem
        expedita eveniet quae ducimus ex, vero ad hic officia quia natus.
        Quaerat corporis voluptas magni quisquam accusantium, expedita id vel
        sint architecto impedit suscipit ad fuga, culpa repudiandae vero ipsa
        illo quos eligendi!
      </p>
    </div>
  );
};

export default RightImage;
