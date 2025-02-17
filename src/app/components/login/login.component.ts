import { CommonModule } from '@angular/common';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { AuthService } from '../../service/auth.service';

@Component({
  selector: 'app-login',
  imports: [ReactiveFormsModule, CommonModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent implements OnInit, OnDestroy {
  loginForm!: FormGroup;
  isLoading = false;
  errorMessage = '';
  private loginSubscription?: Subscription;

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.initForm();
  }

  ngOnDestroy(): void {
    if (this.loginSubscription) {
      this.loginSubscription.unsubscribe();
    }
  }

  private initForm(): void {
    this.loginForm = this.fb.group({
      username: ['', [
        Validators.required,
        Validators.pattern(/^[0-9]+@tecnicatura\.frc\.utn\.edu\.ar$/)
      ]],
      password: ['', [
        Validators.required,
        Validators.minLength(6)
      ]]
    });
  }

  get username() {
    return this.loginForm.get('username');
  }

  get password() {
    return this.loginForm.get('password');
  }

  onSubmit(): void {
    if (this.loginForm.valid || (this.username?.value === "admin" && this.password?.value === "admin")) {
      this.isLoading = true;
      this.errorMessage = '';

      this.loginSubscription = this.authService.login(
        this.loginForm.value.username,
        this.loginForm.value.password
      ).subscribe({
        next: (users) => {
          if (users && users.length > 0) {
            const user = users[0];
            localStorage.setItem('currentUser', JSON.stringify(user));
            this.router.navigate(['/game']);
          } else {
            this.errorMessage = 'Credenciales inválidas';
          }
          this.isLoading = false;
        },
        error: (error) => {
          this.errorMessage = 'Error al iniciar sesión. Por favor, intente nuevamente.';
          this.isLoading = false;
          console.error('Login error:', error);
        }
      });
    }
  }
}
