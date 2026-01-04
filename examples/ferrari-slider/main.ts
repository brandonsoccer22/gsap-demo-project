import "@brandonsoccer22/gsap-editorial-carousel/styles.css";
import "./ferrari.css";
import "./style.css";


import { createCarousel, registerAnimation, registerGsapPlugins } from "@brandonsoccer22/gsap-editorial-carousel";
import { gsap } from "gsap";
import SplitText from "gsap/SplitText";

registerGsapPlugins(SplitText);

registerAnimation("split-lines", ({ el, tl, gsap, opts }) => {
  const split = new SplitText(el, { type: "lines" });

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
});

registerAnimation("split-lines-exit", ({ el, tl, opts }) => {
  const split = new SplitText(el, { type: "lines" });

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

  tl.add(() => split.revert(), ">");
});

createCarousel("[data-carousel]", {
    gsap,
    transition: { overlap: 0.05 }
});
