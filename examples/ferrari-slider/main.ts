import "@brandonsoccer22/gsap-editorial-carousel/styles.css";
import "./ferrari.css";
import "./style.css";


// @ts-ignore
import { createCarousel, registerAnimation, registerGsapPlugins } from "@brandonsoccer22/gsap-editorial-carousel";
import { gsap } from "gsap";
import SplitText from "gsap/SplitText";

registerGsapPlugins(SplitText);

// const domReady =
//   typeof document !== "undefined" && document.readyState !== "complete"
//     ? new Promise<void>((resolve) => {
//         window.addEventListener("load", () => resolve(), { once: true });
//       })
//     : Promise.resolve();
// const fontsReady =
//   typeof document !== "undefined" && "fonts" in document ? document.fonts.ready : Promise.resolve();
// const ready = Promise.all([domReady, fontsReady]);

registerAnimation("split-lines", ({ el, tl, gsap, opts }) => {
  new SplitText(el, {
    type: "lines",
    autoSplit: true,
    onSplit: (split) => {
      gsap.set(el, { autoAlpha: 1 });
      gsap.set(split.lines, { yPercent: -120, opacity: 0 });

      tl.to(
        split.lines,
        {
          yPercent: 0,
          opacity: 1,
          duration: opts.dur,
          ease: opts.ease,
          stagger: 0.06
        },
        opts.at
      );

      tl.add(() => split.revert(), ">");
    }
  });
});

registerAnimation("split-lines-exit", ({ el, tl, opts }) => {
  new SplitText(el, {
    type: "lines",
    autoSplit: true,
    onSplit: (split) => {
      tl.to(
        split.lines,
        {
          yPercent: 40,
          opacity: 0,
          duration: Math.min(opts.dur, 0.55),
          ease: opts.ease,
          stagger: 0.05
        },
        opts.at
      );

      tl.set(el, { autoAlpha: 0 }, ">");
      tl.add(() => split.revert(), ">");
    }
  });
});

const addSplitClass = (list: Element[], className: string): void => {
  list.forEach((node) => node.classList.add(className));
};

registerAnimation("split-lines-v2", ({ el, tl, gsap, opts }) => {
  const splitLines = new SplitText(el, { type: "lines", autoSplit: true });
  addSplitClass(splitLines.lines, "line");

  const perLine = splitLines.lines.map((lineEl) => {
    const splitWords = new SplitText(lineEl, { type: "words", autoSplit: true });
    addSplitClass(splitWords.words, "word");
    return splitWords;
  });

  gsap.set(el, { autoAlpha: 1 });

  splitLines.lines.forEach((_, i) => {
    const words = perLine[i]?.words ?? [];
    const lineStart = (opts.at ?? 0) + i * 0.06;

    tl.fromTo(
      words,
      { yPercent: 120, opacity: 0 },
      {
        yPercent: 0,
        opacity: 1,
        duration: Math.max(opts.dur, 0.5),
        ease: opts.ease ?? "power4.inOut",
        stagger: { each: 0.03, from: "start" }
      },
      lineStart
    );
  });

  tl.add(() => {
    perLine.forEach((split) => split.revert());
    splitLines.revert();
  }, ">");
});

registerAnimation("split-lines-v2-exit", ({ el, tl, opts }) => {
  const splitLines = new SplitText(el, { type: "lines", autoSplit: true });

  const perLine = splitLines.lines.map((lineEl) => new SplitText(lineEl, { type: "words", autoSplit: true }));

  splitLines.lines.forEach((_, i) => {
    const words = perLine[i]?.words ?? [];
    const lineStart = (opts.at ?? 0) + i * 0.06;

    tl.to(
      words,
      {
        yPercent: 90,
        opacity: 0,
        duration: Math.min(opts.dur, 0.5),
        ease: opts.ease ?? "power3.inOut",
        stagger: { each: 0.03, from: "start" }
      },
      lineStart
    );
  });

  tl.set(el, { autoAlpha: 0 }, ">");
  tl.add(() => {
    perLine.forEach((split) => split.revert());
    splitLines.revert();
  }, ">");
});

registerAnimation("media-wipe-in", ({ el, tl, opts }) => {
  const media = el as HTMLElement;
  const img = media.querySelector<HTMLImageElement>(".media-img");
  const bg = media.querySelector<HTMLElement>(".media-bg");
  if (!img || !bg) return;

  const start = opts.at ?? 0;
  const total = Math.max(0.6, opts.dur);
  const expandDur = total * 0.55;
  const imgInDur = total * 0.35;
  const bgOutDur = total * 0.25;

  tl.set(bg, { opacity: 1, scaleX: 0, transformOrigin: "left center" }, start);
  tl.set(img, { opacity: 0 }, start);

  tl.to(bg, { scaleX: 1, duration: expandDur, ease: "power3.out" }, start);
  tl.to(img, { opacity: 1, duration: imgInDur, ease: "power2.out" }, start + total * 0.4);
  tl.to(bg, { opacity: 0, duration: bgOutDur, ease: "power4.out" }, start + total * 0.6);
});

registerAnimation("media-wipe-out", ({ el, tl, opts }) => {
  const media = el as HTMLElement;
  const img = media.querySelector<HTMLImageElement>(".media-img");
  const bg = media.querySelector<HTMLElement>(".media-bg");
  if (!img || !bg) return;

  const start = opts.at ?? 0;
  const total = Math.max(0.4, opts.dur);
  const fadeOutDur = total * 0.25;
  const bgInDur = total * 0.2;
  const wipeDur = total * 0.55;

  tl.set(bg, { opacity: 0, scaleX: 1, transformOrigin: "left center" }, start);
  tl.set(img, { opacity: 1 }, start);

  tl.to(img, { opacity: 0, duration: fadeOutDur, ease: "power2.out" }, start);
  tl.to(bg, { opacity: 1, duration: bgInDur, ease: "power2.out" }, start + total * 0.1);
  tl.to(bg, { scaleX: 0, opacity: 0, duration: wipeDur, ease: "power3.inOut" }, start + total * 0.2);
});

// ready.then(() => {
//   createCarousel("[data-carousel]", {
//     gsap,
//     transition: { overlap: 0.05 }
//   });
// });

const setupUniformSlideHeight = (carouselEl: HTMLElement): (() => void) | undefined => {
  const stack = carouselEl.querySelector<HTMLElement>(".gsap-carousel__stack");
  if (!stack) return;

  const slides = Array.from(stack.querySelectorAll<HTMLElement>("[data-carousel-slide]"));
  if (!slides.length) return;

  const mediaQuery = window.matchMedia("(max-width: 960px)");
  let rafId = 0;

  const updateHeight = () => {
    if (!mediaQuery.matches) {
      stack.style.height = "";
      return;
    }

    const maxHeight = slides.reduce((max, slide) => Math.max(max, slide.offsetHeight), 0);
    if (maxHeight > 0) {
      stack.style.height = `${maxHeight}px`;
    }
  };

  const schedule = () => {
    if (rafId) {
      cancelAnimationFrame(rafId);
    }
    if (mediaQuery.matches) {
      stack.style.height = "";
    }
    rafId = requestAnimationFrame(() => {
      rafId = 0;
      updateHeight();
    });
  };

  const resizeObserver = new ResizeObserver(schedule);
  slides.forEach((slide) => resizeObserver.observe(slide));

  window.addEventListener("resize", schedule);
  mediaQuery.addEventListener("change", schedule);
  schedule();

  return () => {
    resizeObserver.disconnect();
    window.removeEventListener("resize", schedule);
    mediaQuery.removeEventListener("change", schedule);
  };
};

document.fonts.ready.then(() => {
  createCarousel("[data-carousel]", {
    gsap,
    transition: { overlap: 0.2, exitOverlap: 0.2 }
  });
});

const setupFerrariSliderHeight = () => {
  const ferrariSlider = document.querySelector<HTMLElement>("#ferrari-slider");
  if (ferrariSlider) {
    setupUniformSlideHeight(ferrariSlider);
  }
};

if (document.readyState === "loading") {
  window.addEventListener("DOMContentLoaded", setupFerrariSliderHeight, { once: true });
} else {
  setupFerrariSliderHeight();
}
