import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { Word } from '../models/interfaces';

@Injectable({
  providedIn: 'root'
})
export class GameService {
  private apiUrl = 'https://671fe287e7a5792f052fdf93.mockapi.io/words';

  constructor(private http: HttpClient) {}

  getRandomWord(): Observable<Word> {
    return this.http.get<Word[]>(this.apiUrl).pipe(
      map(words => words[Math.floor(Math.random() * words.length)])
    );
  }
}