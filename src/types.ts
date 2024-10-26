import { Application, Container } from "pixi.js";

interface GameOptions {
  container: Container;
  run: (app: Application, container: Container) => void;
  stop: (app: Application, container: Container) => void;
}

export type { GameOptions };
