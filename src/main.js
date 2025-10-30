import { createApp } from "vue";
import App from "./App.vue";
import "./assets/main.css";
import "./assets/scroll.css";

import { library } from "@fortawesome/fontawesome-svg-core";
import { FontAwesomeIcon } from "@fortawesome/vue-fontawesome";

// Solid icons
import {
  faUser,
  faBriefcase,
  faCode,
  faImage,
  faLayerGroup,
} from "@fortawesome/free-solid-svg-icons";

// Brands icons (for GitHub)
import { faGithub, faCodepen } from "@fortawesome/free-brands-svg-icons";
import { faEnvelope } from "@fortawesome/free-solid-svg-icons";
library.add(
  faUser,
  faBriefcase,
  faCode,
  faImage,
  faGithub,
  faCodepen,
  faEnvelope,
  faLayerGroup
);
import AOS from "aos";
import "aos/dist/aos.css";
AOS.init({
  duration: 900, // 動畫時間
  easing: "ease-out",
  once: true, // 只在第一次滾動時觸發
});

createApp(App).component("font-awesome-icon", FontAwesomeIcon).mount("#app");
