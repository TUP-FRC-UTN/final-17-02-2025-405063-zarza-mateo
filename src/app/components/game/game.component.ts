import { CommonModule } from '@angular/common';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { Subscription } from 'rxjs';
import { GameService } from '../../service/game.service';
import { AuthService } from '../../service/auth.service';
import { ScoreService } from '../../service/score.service';

@Component({
  selector: 'app-game',
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './game.component.html',
  styleUrl: './game.component.css',
})
export class GameComponent implements OnInit, OnDestroy {
  currentWord: string = '';
  displayWord: string[] = [];
  usedLetters: string[] = [];
  wrongLetters: string[] = [];
  errors: number = 0;
  gameStatus: 'playing' | 'won' | 'lost' = 'playing';
  alphabet: string[] = 'ABCDEFGHIJKLMNÑOPQRSTUVWXYZ'.split('');

  private gameSubscription?: Subscription;

  constructor(
    private gameService: GameService,
    private authService: AuthService,
    private scoreService: ScoreService
  ) {}

  ngOnInit(): void {
    this.newGame();
  }

  ngOnDestroy(): void {
    if (this.gameSubscription) {
      this.gameSubscription.unsubscribe();
    }
  }

  newGame(): void {
    this.gameSubscription = this.gameService
      .getRandomWord()
      .subscribe((wordData) => {
        this.currentWord = wordData.word.toUpperCase();
        this.displayWord = Array(this.currentWord.length).fill('_');
        this.usedLetters = [];
        this.wrongLetters = [];
        this.errors = 0;
        this.gameStatus = 'playing';
      });
  }

  guessLetter(letter: string): void {
    if (this.gameStatus !== 'playing' || this.usedLetters.includes(letter)) {
      return;
    }

    this.usedLetters.push(letter);

    if (this.currentWord.includes(letter)) {
      for (let i = 0; i < this.currentWord.length; i++) {
        if (this.currentWord[i] === letter) {
          this.displayWord[i] = letter;
        }
      }

      if (!this.displayWord.includes('_')) {
        this.gameStatus = 'won';
        this.saveScore();
      }
    } else {
      this.wrongLetters.push(letter);
      this.errors++;

      if (this.errors >= 6) {
        this.gameStatus = 'lost';
        this.saveScore();

      }
    }
  }

  private async saveScore(): Promise<void> {
    const user = this.authService.getCurrentUser();
    if (!user) return;

    const attemptsLeft = 6 - this.errors;
    const score = this.scoreService.calculateScore(attemptsLeft);
    const idGame = await this.scoreService.generateGameId(user.username, user.name);

    const scoreData = {
      playerName: user.username,
      word: this.currentWord,
      attemptsLeft,
      score,
      date: new Date().toISOString().split('T')[0],
      idGame,
    };

    this.scoreService.saveScore(scoreData).subscribe({
      next: () => {
        console.log('Score saved successfully');
      },
      error: (error) => {
        console.error('Error saving score:', error);
      },
    });
  }
}
