import {Component, OnInit} from '@angular/core';
import {TokenStorageService} from "./_services/token-storage.service";

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})

export class AppComponent implements OnInit {
  private role: string = '';
  isLoggedIn = false;
  nickname?: string;

  constructor(private tokenStorageService: TokenStorageService) {
  }

  ngOnInit(): void {
    this.isLoggedIn = !!this.tokenStorageService.getToken();
    if (this.isLoggedIn) {
      const user = this.tokenStorageService.getUser();
      this.role = user.role;
      this.nickname = user.nickname;
    }
  }

  logout(): void {
    this.tokenStorageService.logout();
    window.location.reload();
  }
}
