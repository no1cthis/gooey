import gsap, { Linear } from "gsap";
import { useEffect, useRef, useState } from "react";
import cl from "./wiseWords.module.scss";

interface WiseWordsProps {}

const WiseWords: React.FC<WiseWordsProps> = () => {
  const authorRef = useRef<(HTMLDivElement | null)[]>([]);
  const quoteRef = useRef<(HTMLParagraphElement | null)[]>([]);

  let authors: (string | JSX.Element)[] = ["TEST NAME1", "TEST NAME2"];
  let quotes: (string | JSX.Element)[] = [
    "Lorem ipsum dolor, sit amet consectetur adipisicing elit. Sequi hic fuga, rerum odio in suscipit voluptatem? Tenetur impedit voluptas omnis.",
    "Lorem ipsum dolor sit amet consectetur adipisicing elit. Unde excepturi voluptas ullam rem aspernatur dicta id eos a natus ipsa.",
  ];

  authors = authors.map((author, i) => (
    <div
      className={cl.author}
      key={author.toString()}
      ref={(el) => (authorRef.current[i] = el)}
    >
      {author}
    </div>
  ));

  quotes = quotes.map((quote, i) => (
    <p
      className={cl.quote}
      key={quote.toString()}
      ref={(el) => (quoteRef.current[i] = el)}
    >
      {quote}
    </p>
  ));
  useEffect(() => {
    const tlAuthor1 = gsap.timeline();
    const tlAuthor2 = gsap.timeline();
    const tlQuote1 = gsap.timeline();
    const tlQuote2 = gsap.timeline();
    if (!quoteRef.current[1] || !authorRef.current[1]) return;

    gsap.to(authorRef.current[0], { yPercent: 50 });
    gsap.to(authorRef.current[1], { y: 200 });
    gsap.to(quoteRef.current[0], { yPercent: 50 });
    gsap.to(quoteRef.current[1], { y: 200 });

    tlAuthor1
      .to(authorRef.current[0], { opacity: 0, duration: 0.3, delay: 3 })
      .to(authorRef.current[0], { y: -200, duration: 1 })
      .to(authorRef.current[0], { opacity: 1, duration: 0.3, delay: 3 })
      .to(authorRef.current[0], {
        y: 0,
        duration: 1,
      })
      .repeat(-1);
    tlAuthor2
      .to(authorRef.current[1], { opacity: 1, duration: 0.3, delay: 3 })
      .to(authorRef.current[1], {
        y: 0 - authorRef.current[1].clientHeight / 2,
        duration: 1,
      })
      .to(authorRef.current[1], { opacity: 0, duration: 0.3, delay: 3 })
      .to(authorRef.current[1], { y: 200, duration: 1 })
      .repeat(-1);

    tlQuote1
      .to(quoteRef.current[0], {
        y: -200,
        duration: 1,
        delay: 3.3,
      })
      .to(quoteRef.current[0], {
        y: 0,
        duration: 1,
        delay: 3.3,
      })
      .repeat(-1);
    tlQuote2

      .to(quoteRef.current[1], {
        y: 0 - quoteRef.current[1].clientHeight / 2,
        duration: 1,
        delay: 3.3,
      })
      .to(quoteRef.current[1], {
        y: 200,
        duration: 1,
        delay: 3.3,
      })
      .repeat(-1);
  }, []);
  return (
    <div className={cl.wrapper}>
      <div className={cl.author__wrapper}>{authors}</div>
      <div className={cl.quote__wrapper}>{quotes}</div>
    </div>
  );
};

export default WiseWords;
