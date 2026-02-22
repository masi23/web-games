import { Sprite, Texture } from "pixi.js";
import gsap from "gsap";

export default class Card extends Sprite {
  public id: number;
  public imageId: number;
  private flipped: boolean = false;
  private frontImage: Texture;
  private backImage: Texture;
  private targetWidth: number = 200;
  private targetHeight: number = 300;

  constructor(
    id: number,
    imageId: number,
    frontImage: Texture,
    backImage: Texture,
    onClick: (card: Card) => void,
  ) {
    super(backImage);
    this.id = id;
    this.imageId = imageId;
    this.frontImage = frontImage;
    this.backImage = backImage;
    this.anchor = 0.5;
    this.scale = 0.5;
    this.eventMode = "static";

    this.on("pointerdown", () => {
      console.log("pointerdown");
      this.flip();
      onClick(this);
    });
  }

  public flip(toBackside?: boolean) {
    if (toBackside !== undefined && toBackside === true && !this.flipped)
      return;
    gsap.to(this.scale, {
      x: 0,
      duration: 0.2,
      onComplete: () => {
        this.flipped = !this.flipped;
        this.texture = this.flipped ? this.frontImage : this.backImage;
        this.scale.y = this.targetHeight / this.texture.height;
        gsap.to(this.scale, {
          x: this.targetWidth / this.texture.width,
          y: this.targetHeight / this.texture.height,
          duration: 0.2,
        });
      },
    });
  }

  public disappear() {
    this.eventMode = "none";
    setTimeout(() => {
      gsap.to(this, {
        rotation: 0.3,
        alpha: 0,
        duration: 0.7,
        onComplete: () => {
          this.parent?.removeChild(this);
          this.destroy();
        },
      });
    }, 500);
    // szybkie powiększenie (pop)
  }
}
