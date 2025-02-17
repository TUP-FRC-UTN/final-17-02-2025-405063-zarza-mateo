// interfaces/user.ts
export interface User {
    id: number;
    username: string;
    password: string;
    name: string;
    role: 'admin' | 'student';
  }
  
  // interfaces/score.ts
  export interface Score {
    playerName: string;
    word: string;
    attemptsLeft: number;
    score: number;
    date: string;
    idGame: string;
    id?: string;
  }
  
  // interfaces/word.ts
  export interface Word {
    id: string;
    word: string;
    category: string;
  }