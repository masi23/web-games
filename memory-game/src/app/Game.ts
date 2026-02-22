import { Application, Text, Container } from "pixi.js";
import { gsap } from "gsap/gsap-core";
import Button from "../view/Button";
import Card from "../view/Card";
import CardsInitializer from "../service/CardsInitializer";

export default class Game {
  private app!: Application;
  private cards: Card[] = [];
  private solvedCount: number = 0;
  private maxScore: number = 5;
  private selectedCards: Card[] = [];
  private scoreText: Text = new Text();

  constructor(app: Application) {
    this.app = app;
    this.init();
  }

  private async init(): Promise<void> {
    console.log("ℹ️ Memory game started.");
    const cardsInitializer = new CardsInitializer(this.cardOnClick);
    this.cards = await cardsInitializer.init();

    this.startScreen();
  }

  private startScreen() {
    const text = new Text({
      text: "Memory Game 🧠",
      style: {
        fontSize: 40,
        fill: "white",
      },
    });

    const button = new Button(
      "Start",
      this.app.screen.width / 2,
      this.app.screen.height / 2 + 60,
      () => this.startGame(),
    );

    text.x = this.app.screen.width / 2 - text.width / 2;
    text.y = this.app.screen.height / 2 - text.height / 2;
    this.app.stage.addChild(text, button);
  }

  private initBoard() {
    if (this.cards.length === 0) return;
    this.scoreText.text = `${this.solvedCount}/${this.maxScore}`;
    this.scoreText.style = {
      fill: "white",
      fontSize: 35,
    };
    this.scoreText.x = 100;
    this.scoreText.y = 50;
    this.app.stage.addChild(this.scoreText);

    const cardsWrapper = new Container();
    this.app.stage.addChild(cardsWrapper);
    this.cards.forEach((card, i) => {
      card.x = 500 + (i % 5) * (card.width + 30);
      card.y = 300 + Math.floor(i / 5) * (card.height + 30);
      cardsWrapper.addChild(card);
    });
  }

  private startGame() {
    this.app.stage.removeChildren();
    this.initBoard();
  }

  public setCards(cards: Card[]) {
    this.cards = cards;
  }

  private updateScoreText() {
    this.scoreText.text = `${this.solvedCount}/${this.maxScore}`;
  }

  private cardOnClick = (card: Card) => {
    if (this.selectedCards.length < 2) {
      this.selectedCards.push(card);
    }

    if (this.selectedCards.length >= 2) {
      if (this.selectedCards[0].imageId === this.selectedCards[1].imageId) {
        this.solvedCount += 1;
        this.updateScoreText();
        this.selectedCards.forEach((card) => {
          card.disappear();
        });
        if (this.solvedCount === this.maxScore) {
          setTimeout(() => {
            this.finishScreen();
          }, 600);
        }
      }
      setTimeout(() => {
        this.selectedCards.forEach((card) => {
          card.flip();
        });
        this.selectedCards = [];
      }, 500);
    }
  };

  private async playAgain() {
    this.solvedCount = 0;
    this.selectedCards = [];
    const cardsInitializer = new CardsInitializer(this.cardOnClick);
    this.cards = await cardsInitializer.init();
    // this.init();
    this.startGame();
  }

  private finishScreen() {
    this.app.stage.removeChildren();
    const finishText = new Text({
      text: "Congratulations! 🎉",
      style: {
        fontSize: 50,
        fill: "white",
      },
    });
    finishText.alpha = 0;
    finishText.x = this.app.canvas.width / 2 - finishText.width / 2;
    finishText.y = this.app.canvas.height / 2 - finishText.height / 2 - 150;

    const playAgainButton = new Button(
      "Play again ▶️",
      this.app.canvas.width / 2,
      this.app.canvas.height / 2,
      () => this.playAgain(),
    );

    this.app.stage.addChild(finishText, playAgainButton);

    gsap.to(finishText, {
      alpha: 1,
      duration: 0.5,
    });
  }
}
