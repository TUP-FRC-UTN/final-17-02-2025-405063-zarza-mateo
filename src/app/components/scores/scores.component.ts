import { CommonModule } from '@angular/common';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { map } from 'rxjs';
import { Subscription } from 'rxjs/internal/Subscription';
import { Score } from '../../models/interfaces';
import { AuthService } from '../../service/auth.service';
import { ScoreService } from '../../service/score.service';

@Component({
  selector: 'app-scores',
  imports: [CommonModule],
  templateUrl: './scores.component.html',
  styleUrl: './scores.component.css'
})
export class ScoresComponent implements OnInit, OnDestroy{
  scores: Score[] = [];
  isAdmin = false;
  private scoresSubscription?: Subscription;

  constructor(
    private scoreService: ScoreService,
    private authService: AuthService
  ) {
    this.isAdmin = this.authService.getUserRole() === 'admin';
  }

  ngOnInit(): void {
    this.loadScores();
  }

  ngOnDestroy(): void {
    if (this.scoresSubscription) {
      this.scoresSubscription.unsubscribe();
    }
  }

  private loadScores(): void {
    this.scoresSubscription = this.scoreService.getScores()
      .pipe(
        map(scores => scores.sort((a, b) => b.score - a.score))
      )
      .subscribe({
        next: (scores) => {
          this.scores = scores;
        },
        error: (error) => {
          console.error('Error al cargar los scores:', error);
        }
      });
  }


}
