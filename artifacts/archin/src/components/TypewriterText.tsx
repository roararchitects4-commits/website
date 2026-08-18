import React, { useEffect, useRef, useState } from 'react';

interface TypewriterTextProps {
  text: string;
  className?: string;
  speed?: number;
  delay?: number;
  tag?: 'p' | 'span' | 'div' | 'h2' | 'h3' | 'h4';
  once?: boolean;
  /* When set, the first character is split out into a span of its own carrying
     these classes — an initial cap. It has to happen in here rather than at the
     call site: the text arrives one character at a time, so the caller has no
     element to style until the animation has already run. */
  initialClassName?: string;
}

export function TypewriterText({
  text,
  className = '',
  speed = 30,
  delay = 150,
  tag = 'p',
  once = true,
  initialClassName,
}: TypewriterTextProps) {
  const [displayed, setDisplayed] = useState('');
  const [isAnimated, setIsAnimated] = useState(false);
  const elementRef = useRef<HTMLElement | null>(null);

  useEffect(() => {
    const element = elementRef.current;
    if (!element) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting && !isAnimated) {
            setIsAnimated(true);
          }
        });
      },
      { threshold: 0.25, rootMargin: '0px 0px -10% 0px' },
    );

    observer.observe(element);

    return () => observer.disconnect();
  }, [isAnimated]);

  useEffect(() => {
    if (!isAnimated) return;

    let currentIndex = 0;
    let intervalId: number | null = null;

    const timeoutId = window.setTimeout(() => {
      intervalId = window.setInterval(() => {
        if (currentIndex < text.length) {
          setDisplayed(text.slice(0, currentIndex + 1));
          currentIndex += 1;
        }

        if (currentIndex >= text.length && intervalId !== null) {
          window.clearInterval(intervalId);
        }
      }, speed);
    }, delay);

    return () => {
      window.clearTimeout(timeoutId);
      if (intervalId !== null) {
        window.clearInterval(intervalId);
      }
    };
  }, [isAnimated, delay, speed, text]);

  const Tag = tag as keyof JSX.IntrinsicElements;

  return (
    <Tag
      ref={(node) => {
        if (node) {
          elementRef.current = node as HTMLElement;
        }
      }}
      className={className}
      style={{ whiteSpace: 'pre-wrap' }}
    >
      {initialClassName && displayed.length > 0 ? (
        <>
          <span className={initialClassName}>{displayed.charAt(0)}</span>
          {displayed.slice(1)}
        </>
      ) : (
        displayed
      )}
    </Tag>
  );
}
