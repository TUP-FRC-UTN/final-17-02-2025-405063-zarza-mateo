import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, map } from 'rxjs';
import { AuthService } from './auth.service';
import { Score } from '../models/interfaces';


@Injectable({
  providedIn: 'root'
})
export class ScoreService {
  private apiUrl = 'https://671fe287e7a5792f052fdf93.mockapi.io/scores';

  constructor(
    private http: HttpClient,
    private authService: AuthService
  ) {}

  getScores(): Observable<Score[]> {
    const user = this.authService.getCurrentUser();
    if (user?.role === 'admin') {
      return this.http.get<Score[]>(this.apiUrl);
    } else {
      return this.http.get<Score[]>(`${this.apiUrl}?playerName=${user?.username}`);
    }
  }

  async generateGameId(account: string, playerName: string): Promise<string> {
    console.log('Generating game ID for:', playerName);
    
    const result = await this.http.get<Score[]>(`${this.apiUrl}`).pipe(
      map(scores => {
        const playerScores = scores.filter(score => score.playerName === account);
        const gamesPlayed = playerScores.length;
        
        const initials = playerName
          .split(' ')
          .map(word => word.charAt(0))
          .join('')
          .toUpperCase();
        
        return `P${gamesPlayed + 1}${initials}`;
      })
    ).toPromise();
  
    return result || `P1${playerName.charAt(0).toUpperCase()}`;
  }

  calculateScore(attemptsLeft: number): number {
    const scoreMap: { [key: number]: number } = {
      6: 100,
      5: 80,
      4: 60,
      3: 40,
      2: 20,
      1: 10,
      0: 0
    };
    return scoreMap[attemptsLeft] || 0;
  }

  saveScore(score: Omit<Score, 'id'>): Observable<Score> {
    console.log('Saving score:', score);
    return this.http.post<Score>(this.apiUrl, score);
  }
}