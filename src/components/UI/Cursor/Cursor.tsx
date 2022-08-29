import { useEffect, useRef, useState } from "react";

import cl from "./cursor.module.scss";

function Cursor() {
  const TAIL_LENGTH = 20;

  const cursor = useRef<HTMLDivElement>(null);
  const [cursorCircles, setCursorCircle] = useState<JSX.Element[]>([]);
  const dots = useRef<DOT[]>([]);
  const mouse = useRef({ x: 0, y: 0 });
  const frameCounter = useRef(0);

  const cursorHistory = useRef<{ x: number; y: number }[]>(
    Array(TAIL_LENGTH).fill({ x: 0, y: 0 })
  );

  function onMouseMove(event: MouseEvent) {
    mouse.current.x = event.clientX;
    mouse.current.y = event.clientY;
  }

  class DOT {
    idle = true;
    coords = { x: 0, y: 0 };
    ind: number;
    el;
    directionIdle = {
      x: Math.sin((Math.PI * Math.random()) / 2),
      y: Math.sin((Math.PI * Math.random()) / 2),
    };
    framesIdle = Math.floor(Math.random() * 20);
    constructor(ind: number) {
      this.idle = false;
      this.ind = ind;
      this.el = (
        <div
          key={this.ind}
          className={cl["cursor-circle"]}
          style={{
            transform: `translate(${this.coords.x}px, ${
              this.coords.y
            }px) scale(${this.ind / TAIL_LENGTH})`,
          }}
        ></div>
      );
    }

    update() {
      if (!this.idle) this.coords = cursorHistory.current[this.ind];
      let next =
        cursorHistory.current[this.ind + 1] ||
        cursorHistory.current[TAIL_LENGTH - 1];

      let xDiff = next.x - cursorHistory.current[this.ind].x;
      let yDiff = next.y - cursorHistory.current[this.ind].y;
      if (xDiff === 0 && yDiff === 0 && this.ind !== TAIL_LENGTH - 1) {
        if (frameCounter.current % 3 === 0) {
          this.idle = true;
          const step = Math.random() * 1;
          if (
            (this.coords.x - cursorHistory.current[this.ind].x >
              Math.random() * 40 &&
              this.directionIdle.x > 0) ||
            (this.coords.x - cursorHistory.current[this.ind].x <
              -Math.random() * 40 &&
              this.directionIdle.x < 0)
          )
            this.directionIdle.x *= -1;
          if (
            (this.coords.y - cursorHistory.current[this.ind].y >
              Math.random() * 40 &&
              this.directionIdle.y > 0) ||
            (this.coords.y - cursorHistory.current[this.ind].y <
              -Math.random() * 40 &&
              this.directionIdle.y < 0)
          )
            this.directionIdle.y *= -1;
          this.coords.x += step * this.directionIdle.x;
          this.coords.y += step * this.directionIdle.y;

          return (
            <div
              id={this.ind.toString()}
              key={this.ind}
              className={cl["cursor-circle"]}
              style={{
                transform: `translate(${this.coords.x}px, ${
                  this.coords.y
                }px) scale(${this.ind / TAIL_LENGTH})`,
              }}
            ></div>
          );
        } else {
          return (
            <div
              key={this.ind}
              className={cl["cursor-circle"]}
              style={{
                transform: `translate(${this.coords.x}px, ${
                  this.coords.y
                }px) scale(${this.ind / TAIL_LENGTH})`,
              }}
            ></div>
          );
        }
      }

      this.idle = false;
      this.coords.x += xDiff * 0.3;
      this.coords.y += yDiff * 0.3;

      return (
        <div
          key={this.ind}
          className={cl["cursor-circle"]}
          style={{
            transform: `translate(${this.coords.x}px, ${
              this.coords.y
            }px) scale(${this.ind / TAIL_LENGTH})`,
          }}
        ></div>
      );
    }
  }

  function updateCursor() {
    frameCounter.current++;
    cursorHistory.current.shift();
    cursorHistory.current.push({ x: mouse.current.x, y: mouse.current.y });
    const temp: JSX.Element[] = [];
    for (let i = 0; i < TAIL_LENGTH; i++) {
      temp[i] = dots.current[i].update();
    }
    setCursorCircle(temp);
    requestAnimationFrame(updateCursor);
  }

  useEffect(() => {
    for (let i = 0; i < TAIL_LENGTH; i++) dots.current.push(new DOT(i));

    document.removeEventListener("mousemove", onMouseMove, false);
    updateCursor();
    return document.addEventListener("mousemove", onMouseMove, false);
  }, []);

  return (
    <div>
      <svg
        xmlns="http://www.w3.org/2000/svg"
        className="goo"
        version="1.1"
        width="100%"
      >
        <defs>
          <filter id="goo">
            <feGaussianBlur
              in="SourceGraphic"
              stdDeviation="6"
              result="blur"
            ></feGaussianBlur>
            <feColorMatrix
              in="blur"
              mode="matrix"
              values="1 0 0 0 0  0 1 0 0 0  0 0 1 0 0  0 0 0 35 -15"
              result="goo"
            ></feColorMatrix>
            <feComposite
              in="SourceGraphic"
              in2="goo"
              operator="atop"
            ></feComposite>
          </filter>
        </defs>
      </svg>

      <div ref={cursor} className={cl.cursor}>
        {[...cursorCircles]}
      </div>
    </div>
  );
}

export default Cursor;
