import {Component, OnInit} from '@angular/core';
import {TokenStorageService} from "./_services/token-storage.service";
import {JwtHelperService} from "@auth0/angular-jwt";
import {Router, RouterModule} from "@angular/router";

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})

export class AppComponent implements OnInit {
  isLoggedIn = false;
  nickname?: string;
  title: string | undefined;

  public jwtHelper: JwtHelperService = new JwtHelperService();

  constructor(private tokenStorageService: TokenStorageService, private router: Router) {
  }

  ngOnInit(): void {
  }

  isUserAuthenticated() {
    const token: string | null = this.tokenStorageService.getToken();
    if (token && !this.jwtHelper.isTokenExpired(token)) {
      const user = this.tokenStorageService.getUser();
      this.nickname = user.nickname;
      return true;
    }
    else {
      return false;
    }
  }

  logout(): void {
    this.tokenStorageService.logout();
    this.router.navigate(["/login"]);
  }
}
