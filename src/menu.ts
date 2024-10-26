import { Application, Container, Text } from "pixi.js";
import { useAce } from "./games/ace";
import { usePhoenix } from "./games/phoenix";
import { createButton } from "./util/button";
import { useMagic } from "./games/magic";
import { setNeutralCursor } from "./util/cursor";

const { ace } = useAce();
const { phoenix } = usePhoenix();
const { magic, updatePosition: updateMagicImagePosition } = useMagic();

const FULLSCREEN_SWITCH_TIMEOUT_MS = 200;

let fullscreen = false;
const menuContainer = new Container();

const useMenu = (
  app: Application,
  globalContainer: Container,
  mainContainer: Container,
) => {
  const backButtonX = () => app.renderer.width - 96;
  const backButtonY = () => app.renderer.height - 32;

  const openMainMenu = () => {
    setNeutralCursor();

    ace.stop(app, mainContainer);
    phoenix.stop(app, mainContainer);
    magic.stop(app, mainContainer);

    backButton.visible = false;
    mainContainer.addChild(menuContainer);
    mainContainer.addChild(fullscreenButton);
  };

  const backButton = createButton({
    label: "Main Menu",
    x: backButtonX(),
    y: backButtonY(),
    callback: openMainMenu,
  });

  backButton.visible = false;

  globalContainer.addChild(backButton);

  const requestFullScreen = () => {
    if (fullscreen) {
      document.exitFullscreen();
      fullscreenButton.visible = false;
      fullscreen = false;
      setTimeout(() => {
        fullscreenButton.visible = true;
        updatePosition();
      }, FULLSCREEN_SWITCH_TIMEOUT_MS);
      return;
    }

    document.documentElement.requestFullscreen().then(() => {
      fullscreen = true;
      fullscreenButton.visible = false;

      setTimeout(() => {
        fullscreenButton.visible = true;
        updatePosition();
      }, FULLSCREEN_SWITCH_TIMEOUT_MS);
    });
  };

  const fullscreenButton = createButton({
    label: "Toggle Fullscreen",
    x: 128,
    y: backButtonY(),
    callback: requestFullScreen,
  });

  const prepareGameStart = () => {
    setNeutralCursor();
    mainContainer.removeChildren();
    backButton.visible = true;
  };

  const startAceOfShadows = () => {
    prepareGameStart();
    ace.run(app, mainContainer);
  };

  const startPhoenix = () => {
    prepareGameStart();
    phoenix.run(app, mainContainer);
  };

  const startMagic = () => {
    prepareGameStart();
    magic.run(app, mainContainer);
  };

  const title = new Text("Main Menu", {
    fill: 0xffffff,
    fontSize: 36,
    fontWeight: "bold",
  });

  title.anchor.set(0.5);
  title.x = 0;
  title.y = 0;

  menuContainer.addChild(title);

  menuContainer.addChild(
    createButton({
      label: "Ace Of Shadows",
      x: 0,
      y: 60,
      callback: startAceOfShadows,
    }),
  );

  menuContainer.addChild(
    createButton({
      label: "Magic Words",
      x: 0,
      y: 120,
      callback: startMagic,
    }),
  );

  menuContainer.addChild(
    createButton({
      label: "Phoenix Flame",
      x: 0,
      y: 180,
      callback: startPhoenix,
    }),
  );

  mainContainer.addChild(fullscreenButton);

  const updatePosition = () => {
    menuContainer.x = app.renderer.width / 2;
    menuContainer.y = app.renderer.height / 2 - menuContainer.height / 2;

    backButton.x = backButtonX();
    backButton.y = backButtonY();
    fullscreenButton.y = backButtonY();

    updateMagicImagePosition(app.renderer.width, app.renderer.height);
  };

  updatePosition();

  mainContainer.addChild(menuContainer);

  return {
    updatePosition,
  };
};

export { useMenu };
