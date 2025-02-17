import { Routes } from '@angular/router';
import { authGuard } from './auth.guard';

export const routes: Routes = [
  {
    path: 'login',
    loadComponent: () =>
      import('./components/login/login.component').then(
        (m) => m.LoginComponent
      ),
  },
  {
    path: 'game',
    loadComponent: () =>
      import('./components/game/game.component').then(
        (m) => m.GameComponent
      ),     canActivate: [authGuard]

  },
  {
    path: 'scores',
    loadComponent: () =>
      import('./components/scores/scores.component').then(
        (m) => m.ScoresComponent
      ),     canActivate: [authGuard]

  },
  {
    path: '', redirectTo: 'login', pathMatch: 'full'
  }
];
