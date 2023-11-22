import { createApp } from "vue";

import App from "./App.vue";
import * as LR from "@uploadcare/blocks";

LR.registerBlocks(LR);

createApp(App).mount("#app");
