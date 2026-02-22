import { Text, Graphics, Container } from "pixi.js";

export default class Button extends Container {
  private text: Text;
  private background: Graphics;
  private bgColor: string;
  private hoverColor: string;

  constructor(text: string, x: number, y: number, onClick: () => void) {
    super();
    this.bgColor = "#463ec0";
    this.hoverColor = "#5147e2";
    this.text = new Text({
      text: text,
      style: {
        fontSize: 30,
        fill: "white",
      },
    });

    const buttonWidth = this.text.width + 30;
    const buttonHeight = this.text.height + 30;

    this.background = new Graphics();

    this.background
      .roundRect(0, 0, buttonWidth, buttonHeight, 50)
      .fill(this.bgColor);

    this.text.x = this.background.width / 2 - this.text.width / 2;
    this.text.y = this.background.height / 2 - this.text.height / 2;

    this.addChild(this.background, this.text);
    this.x = x - this.width / 2;
    this.y = y;

    this.eventMode = "static";
    this.on("pointerover", () => {
      this.background.clear();
      this.background
        .roundRect(0, 0, buttonWidth, buttonHeight, 50)
        .fill(this.hoverColor);
    });

    this.on("pointerout", () => {
      this.background.clear();
      this.background
        .roundRect(0, 0, buttonWidth, buttonHeight, 50)
        .fill(this.bgColor);
    });

    this.on("pointerdown", onClick);
  }
}
