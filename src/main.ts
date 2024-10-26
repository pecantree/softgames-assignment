import * as PIXI from "pixi.js";
import { gsap } from "gsap";
import PixiPlugin from "gsap/PixiPlugin";

import { loadAssets } from "./asset";
import { useMenu } from "./menu";
import { useFpsCounter } from "./util/fpsCounter";

const MOBILE_BREAKPOINT = 480;

const app = new PIXI.Application<HTMLCanvasElement>({
  width: window.innerWidth,
  height: window.innerHeight,
});

gsap.registerPlugin(PixiPlugin);
PixiPlugin.registerPIXI(PIXI);

await loadAssets();

document.body.appendChild(app.view);

const mainContainer = new PIXI.Container();
const globalContainer = new PIXI.Container();

app.stage.addChild(mainContainer);
app.stage.addChild(globalContainer);

const { updatePosition } = useMenu(app, globalContainer, mainContainer);
useFpsCounter(app, globalContainer);

const isMobileBreakpoint = () => {
  return app.renderer.width <= MOBILE_BREAKPOINT;
};

window.addEventListener("resize", () => {
  app.renderer.resize(window.innerWidth, window.innerHeight);
  updatePosition();
});

export { isMobileBreakpoint };
