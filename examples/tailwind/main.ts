import "@brandonsoccer22/gsap-editorial-carousel/styles.css";
import "./style.css";

// @ts-ignore
import { createCarousel } from "@brandonsoccer22/gsap-editorial-carousel";

createCarousel("[data-carousel]", {
  loop: true,
  initialIndex: 0
});
