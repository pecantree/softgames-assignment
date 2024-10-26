import { Text } from "pixi.js";
import { setNeutralCursor, setPointerCursor } from "./cursor";

interface CreateButtonOptions {
  label: string;
  x: number;
  y: number;
  callback: () => void;
}

const BUTTON_ACTIVE_COLOR = 0xaaaaaa;
const BUTTON_DEFAULT_COLOR = 0xffffff;
const BUTTON_HOVER_COLOR = 0xaaaaaa;

const FONT_SIZE = 24;

const createButton = (options: CreateButtonOptions) => {
  const button = new Text(options.label, {
    fill: BUTTON_DEFAULT_COLOR,
    fontSize: FONT_SIZE,
  });

  button.interactive = true;
  button.anchor.set(0.5);
  button.x = options.x;
  button.y = options.y;

  button.on("pointerdown", () => {
    button.tint = BUTTON_ACTIVE_COLOR;
  });

  button.on("mouseenter", () => {
    setPointerCursor();
    button.tint = BUTTON_HOVER_COLOR;
  });

  button.on("mouseleave", () => {
    setNeutralCursor();
    button.tint = BUTTON_DEFAULT_COLOR;
  });

  button.on("pointerup", () => {
    button.tint = BUTTON_DEFAULT_COLOR;
    options.callback();
  });

  return button;
};

export { createButton };
