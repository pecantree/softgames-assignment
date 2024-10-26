import { Application, Container, Sprite, Text } from "pixi.js";
import { INSPIRATION_PNGS } from "../urls";
import { BE_INSPIRED } from "../util/inspirations";
import { GameOptions } from "../types";
import { isMobileBreakpoint } from "../main";

const FONT_SIZE_MOD = 30;
const FONT_SIZE_MOD_MOBILE = 15;
const NEW_CONFIG_INTERVAL_MS = 120;

const TEXT_BOTTOM_OFFSET = -150;
const TEXT_TOP_OFFSET = 64;

const useMagic = () => {
  let appWidth = 0;
  let appHeight = 0;

  const magicContainer = new Container();

  let image: Sprite | null = null;
  let text: Text | null = null;

  const getRandomFontSize = () => {
    const mod = isMobileBreakpoint() ? FONT_SIZE_MOD_MOBILE : FONT_SIZE_MOD;
    return Math.floor(Math.random() * (20 - 5 + 1)) + mod;
  };

  const setImagePosition = (image: Sprite) => {
    image.position.set(
      appWidth / 2 - image.width / 2,
      appHeight / 2 - image.height / 2,
    );
  };

  const setTextPosition = (text: Text, y?: number) => {
    const textY = y
      ? y
      : Math.random() > 0.5
        ? TEXT_TOP_OFFSET
        : appHeight + TEXT_BOTTOM_OFFSET;

    text.position.set(appWidth / 2 - text.width / 2, textY);
  };

  const setTextWordWrapWidth = (text: Text) => {
    text.style.wordWrapWidth = appWidth - 32;
  };

  const updateContent = () => {
    magicContainer.removeChildren();

    // Add random image.
    const randomImageUrl =
      INSPIRATION_PNGS[Math.floor(Math.random() * INSPIRATION_PNGS.length)];

    image = Sprite.from(randomImageUrl);

    if (isMobileBreakpoint()) {
      image.scale.set(0.5);
    }

    setImagePosition(image);

    magicContainer.addChild(image);

    // Add random text.
    const randomText =
      BE_INSPIRED[Math.floor(Math.random() * BE_INSPIRED.length)];

    text = new Text(randomText, {
      fontSize: getRandomFontSize(),
      fill: 0xffffff,
      wordWrap: true,
    });

    setTextWordWrapWidth(text);
    setTextPosition(text);

    magicContainer.addChild(text);
  };

  let elapsedTime = 0;

  const gameLoop = (delta: number) => {
    elapsedTime += delta;

    if (elapsedTime >= NEW_CONFIG_INTERVAL_MS) {
      elapsedTime = 0;
      updateContent();
    }
  };

  const startGame = (app: Application, container: Container) => {
    appWidth = app.renderer.width;
    appHeight = app.renderer.height;

    container.addChild(magicContainer);

    updateContent();
    app.ticker.add(gameLoop);
  };

  const stopGame = (app: Application, container: Container) => {
    magicContainer.removeChildren();
    app.ticker.remove(gameLoop);
    container.removeChild(magicContainer);
  };

  const updatePosition = (width: number, height: number) => {
    if (!image || !text) {
      return;
    }

    appWidth = width;
    appHeight = height;

    setImagePosition(image);
    setTextWordWrapWidth(text);

    const textY =
      text.y < appHeight / 2 ? TEXT_TOP_OFFSET : appHeight + TEXT_BOTTOM_OFFSET;

    setTextPosition(text, textY);
  };

  const magic: GameOptions = {
    container: magicContainer,
    run: startGame,
    stop: stopGame,
  };

  return { magic, updatePosition };
};

export { useMagic };
