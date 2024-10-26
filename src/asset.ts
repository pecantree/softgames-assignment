import { Assets } from "pixi.js";
import { CARD_BACK_PNG, FLAME_PARTICLE_PNG, INSPIRATION_PNGS } from "./urls";

const loadAssets = async () => {
  Assets.load(CARD_BACK_PNG);
  Assets.load(FLAME_PARTICLE_PNG);

  INSPIRATION_PNGS.forEach((png) => {
    Assets.load(png);
  });
};

export { loadAssets };
