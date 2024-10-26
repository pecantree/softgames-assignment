import { Application, Container, Text } from "pixi.js";

const useFpsCounter = (app: Application, container: Container) => {
  const fpsText = new Text("0", { fill: 0xffffff, fontSize: 32 });

  container.addChild(fpsText);

  app.ticker.add(() => {
    fpsText.text = `${app.ticker.FPS.toFixed()}`;
  });
};

export { useFpsCounter };
