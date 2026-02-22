import { Application } from "pixi.js";
import "./style.css";
import Game from "./app/Game";

const main = async () => {
  const app = new Application();
  await app.init({
    resizeTo: window,
    background: "#242f53",
  });
  document.getElementById("app")?.appendChild(app.canvas);

  new Game(app);
};

main();
