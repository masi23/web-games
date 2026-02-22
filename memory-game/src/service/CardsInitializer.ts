import { Assets, Texture } from "pixi.js";
import cardImages from "../data/data";
import Card from "../view/Card";

type textureArray = {
  id: number;
  texture: Texture;
}[];

export default class CardsInitializer {
  private textures: textureArray = [];
  private backTexture!: Texture;
  private cardOnClick: (card: Card) => void;

  constructor(cardOnClick: (card: Card) => void) {
    this.cardOnClick = cardOnClick;
  }

  public async init(): Promise<Card[]> {
    await this.loadTextures();
    return this.generateCards();
  }

  private async loadTextures() {
    const imagesCopy = [...cardImages];
    const backImage = imagesCopy.shift();
    let images = imagesCopy;
    images = images.filter((_, i) => i < 5);
    if (!backImage) throw new Error("Cards images array is empty");

    this.backTexture = await Assets.load(backImage.src);

    this.textures = await Promise.all(
      images.map((img) =>
        Assets.load(img.src).then((texture) => ({ id: img.id, texture })),
      ),
    );
  }

  private generateCards(): Card[] {
    const paired = [...this.textures, ...this.textures];
    const shuffled = this.shuffle(paired);

    return shuffled.map((tex, index) => {
      return new Card(
        index,
        tex.id,
        tex.texture,
        this.backTexture,
        this.cardOnClick,
      );
    });
  }

  private shuffle<T>(array: T[]): T[] {
    const arr = [...array];

    for (let i = arr.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [arr[i], arr[j]] = [arr[j], arr[i]];
    }

    return arr;
  }
}
