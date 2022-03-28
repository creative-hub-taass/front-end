import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { JwtHelperService } from '@auth0/angular-jwt';
import { lastValueFrom } from 'rxjs';
import {TokenStorageService} from "../_services/token-storage.service";

const AUTH_PORT = "30001"
const AUTH_API = 'https://192.168.49.2:'+AUTH_PORT+'/api/v1/access/';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {

  public jwtHelper: JwtHelperService = new JwtHelperService();


  constructor(private router: Router, private http: HttpClient, private tokenStorageService: TokenStorageService) {
  }
  async canActivate() {
    const token = this.tokenStorageService.getToken();

    if (token && !this.jwtHelper.isTokenExpired(token)) {
      return true;
    }

    const isRefreshSuccess = await this.refreshingTokens(token);
    if (!isRefreshSuccess) {
      await this.router.navigate(["login"]);
    }

    return isRefreshSuccess;
  }

  private async refreshingTokens(token: string | null): Promise<boolean> {
    const refreshToken: string | null = this.tokenStorageService.getRefresh();

    if (!token || !refreshToken) {
      return false;
    }


    let isRefreshSuccess: boolean;
    try {

      const response = await lastValueFrom(this.http.post( AUTH_API+ "/refresh", refreshToken));
      const newToken = (<any>response).accessToken;
      this.tokenStorageService.saveToken(newToken);
      isRefreshSuccess = true;
    }
    catch (ex) {
      isRefreshSuccess = false;
    }
    return isRefreshSuccess;
  }

}
