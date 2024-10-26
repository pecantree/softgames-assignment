import { Application, Container, ParticleContainer, Sprite } from "pixi.js";
import { FLAME_PARTICLE_PNG } from "../urls";
import { GameOptions } from "../types";
import { isMobileBreakpoint } from "../main";

const COLORS = [0xff4500, 0xff8c00, 0xffd700, 0xffa500];

const MAX_FLAMES = 10;
const MAX_ROTATION = 5 * (Math.PI / 180);

const PARTICLE_ALPHA_REDUCE_FACTOR = 0.01;
const PARTICLE_BASE_ALPHA = 0.9;
const PARTICLE_BASE_SCALE = 3;
const PARTICLE_BASE_SCALE_MOBILE = 2;
const PARTICLE_SPEED = 7;

const SPAWN_AREA_WIDTH = 200;
const SPAWN_INTERVAL = 150;
const SPAWN_OFFSET_Y = -100;
const SPAWN_OFFSET_Y_MOBILE = 0;
const SPAWN_TIMER_MULTIPLIER = 1.1;

const flames: Sprite[] = [];

const usePhoenix = () => {
  let appWidth = 0;
  let appHeight = 0;

  const fireParticles = new ParticleContainer(MAX_FLAMES, {
    scale: true,
    position: true,
    rotation: true,
    uvs: true,
    alpha: true,
  });

  const spawnFlameParticle = () => {
    const flame = Sprite.from(FLAME_PARTICLE_PNG);

    const scale = isMobileBreakpoint()
      ? PARTICLE_BASE_SCALE_MOBILE
      : PARTICLE_BASE_SCALE;

    const offsetY = isMobileBreakpoint()
      ? SPAWN_OFFSET_Y_MOBILE
      : SPAWN_OFFSET_Y;

    flame.anchor.set(0.5);

    flame.x =
      appWidth / 2 - SPAWN_AREA_WIDTH / 2 + Math.random() * SPAWN_AREA_WIDTH;

    flame.y = appHeight + offsetY;

    flame.scale.set(scale + Math.random() * 0.5);

    flame.alpha = PARTICLE_BASE_ALPHA;

    flame.tint = COLORS[Math.floor(Math.random() * COLORS.length)];

    flame.rotation = (Math.random() - 0.5) * 2 * MAX_ROTATION;

    flames.push(flame);
    fireParticles.addChild(flame);
    fireParticles.setChildIndex(flame, 0);
  };

  let spawnTimer = 0;

  const updateParticle = (delta: number) => {
    const fps = 60 / delta;
    spawnTimer += delta * (1000 / fps) * SPAWN_TIMER_MULTIPLIER;

    if (spawnTimer >= SPAWN_INTERVAL && flames.length < MAX_FLAMES) {
      spawnFlameParticle();
      spawnTimer = 0;
    }

    for (let i = flames.length - 1; i >= 0; --i) {
      const flame = flames[i];

      flame.y -= PARTICLE_SPEED * delta;
      flame.alpha -= PARTICLE_ALPHA_REDUCE_FACTOR * delta;

      if (flame.alpha <= 0) {
        fireParticles.removeChild(flame);
        flames.splice(i, 1);
      }
    }
  };

  const gameLoop = (delta: number) => {
    updateParticle(delta);
  };

  const startGame = (app: Application, container: Container) => {
    appWidth = app.renderer.width;
    appHeight = app.renderer.height;

    container.addChild(fireParticles);

    app.ticker.add(gameLoop);
  };

  const stopGame = (app: Application, container: Container) => {
    fireParticles.removeChildren();
    app.ticker.remove(gameLoop);
    container.removeChild(fireParticles);
  };

  const phoenix: GameOptions = {
    container: fireParticles,
    run: startGame,
    stop: stopGame,
  };

  return { phoenix };
};

export { usePhoenix };
