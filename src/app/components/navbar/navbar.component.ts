import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { NavigationEnd, Router, RouterLink } from '@angular/router';
import { AuthService } from '../../service/auth.service';

@Component({
  selector: 'app-navbar',
  imports: [RouterLink, CommonModule],
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.css'
})
export class NavbarComponent implements OnInit {
  username: string = '';
  isLoginPath: boolean = false;

  constructor(
    private authService: AuthService,
    private router: Router
  ) {}

  ngOnInit(): void {
    const user = this.authService.getCurrentUser();
    console.log(user);
    this.router.events.subscribe(event => {
      if (event instanceof NavigationEnd) {
        this.isLoginPath = event.url === '/login';
      }
    });
    if(user?.name === "admin") {
      this.username = user.name;
      console.log(this.username);
    }
    else if (user) {
      this.username = user.name.split(' ')[2];
      console.log(this.username);

    }
  }
  logout(): void {
    this.authService.logout();
    this.router.navigate(['/login']);
    
  }
}
