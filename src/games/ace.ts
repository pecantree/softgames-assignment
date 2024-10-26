import { gsap } from "gsap";
import { Application, Container, Sprite } from "pixi.js";
import { CARD_BACK_PNG } from "../urls";
import { GameOptions } from "../types";

const ANIMATION_DURATION_SEC = 2;
const CARD_AMOUNT = 144;
const CARD_MOVE_INTERVAL_MILLISEC = 60;
const CARD_STACK_Y = 20;
const OFFSET = 3;
const START_STACK_X = 32;
const TARGET_SACK_X_OFFSET = -110;

const aceContainer = new Container();

const startStack: Sprite[] = [];
const targetStack: Sprite[] = [];

const useAce = () => {
  let fromStack = startStack;
  let toStack = targetStack;

  let targetStackX = 0;

  const moveTopCard = () => {
    if (fromStack.length === 0) {
      return true;
    }

    const topCard = fromStack.pop()!;
    toStack.push(topCard);

    const currentIndex = toStack.length - 1;

    const y = CARD_STACK_Y + currentIndex * OFFSET;

    // Animate.
    gsap.to(topCard, {
      ease: "expo.inOut",
      x: toStack === targetStack ? targetStackX : START_STACK_X,
      y,
      duration: ANIMATION_DURATION_SEC,
      onComplete: () => {
        aceContainer.setChildIndex(topCard, currentIndex);
      },
    });
  };

  let elapsedSeconds = 0;

  const gameLoop = (delta: number) => {
    elapsedSeconds += delta;

    if (elapsedSeconds >= CARD_MOVE_INTERVAL_MILLISEC) {
      // If stack is empty, wait for animation to end and reverse stack roles.
      if (moveTopCard()) {
        if (elapsedSeconds >= ANIMATION_DURATION_SEC * 60) {
          const temp = fromStack;
          fromStack = toStack;
          toStack = temp;
          elapsedSeconds = 0;
        }
      } else {
        elapsedSeconds = 0;
      }
    }
  };

  const startGame = (app: Application, container: Container) => {
    startStack.length = 0;
    targetStack.length = 0;

    targetStackX = app.renderer.width + TARGET_SACK_X_OFFSET;

    for (let i = 0; i < CARD_AMOUNT; ++i) {
      const card = Sprite.from(CARD_BACK_PNG);
      card.scale = { x: 2, y: 2 };
      card.x = START_STACK_X;
      card.y = CARD_STACK_Y + i * OFFSET;
      startStack.push(card);
      aceContainer.addChild(card);
    }

    container.addChild(aceContainer);
    app.ticker.add(gameLoop);
  };

  const stopGame = (app: Application, container: Container) => {
    aceContainer.removeChildren();
    gsap.globalTimeline.clear();
    app.ticker.remove(gameLoop);
    container.removeChild(aceContainer);
  };

  const ace: GameOptions = {
    container: aceContainer,
    run: startGame,
    stop: stopGame,
  };

  return { ace };
};

export { useAce };
