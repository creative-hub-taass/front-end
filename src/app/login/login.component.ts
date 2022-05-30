import {Component, OnInit} from "@angular/core";
import {AuthService} from "../_services/auth.service";
import {TokenStorageService} from "../_services/token-storage.service";

import {
  FacebookLoginProvider,
  GoogleLoginProvider,
  SocialAuthService,
  SocialUser
} from "@abacritt/angularx-social-login";

@Component({
  selector: "app-login",
  templateUrl: "./login.component.html",
  styleUrls: ["./login.component.css"]
})

export class LoginComponent implements OnInit {
  form: { password: string; email: string } = {
    email: "",
    password: ""
  };
  isLoggedIn = false;
  isLoginFailed = false;
  errorMessage = "";
  socialUser !: SocialUser;

  constructor(
    private authService: AuthService,
    private tokenStorage: TokenStorageService,
    private socialAuthService: SocialAuthService) {
  }

  ngOnInit(): void {
    this.socialAuthService.authState.subscribe({
      next: (userSocial) => {
        if (userSocial != null) {
          this.socialUser = userSocial;
          this.authService.loginSocial(this.socialUser.firstName + " " + this.socialUser.lastName, this.socialUser.email, this.socialUser.authToken).subscribe({
            next: (userCreative) => {
              this.tokenStorage.saveUser(userCreative.body);
              this.tokenStorage.saveToken(userCreative.headers.get("X-ACCESS-TOKEN"));
              this.tokenStorage.saveRefresh(userCreative.headers.get("X-REFRESH-TOKEN"));
              this.isLoginFailed = false;
              this.isLoggedIn = true;
            },
            error: (error) => {
              this.isLoginFailed = true;
              this.errorMessage = error.error;
            }
          });
        }
      },
      error: (error) => {
        this.isLoginFailed = true;
        this.errorMessage = error.errorMessage;
      }
    });
  }

  onSubmit(): void {
    const {email, password} = this.form;
    this.authService.login(email, password).subscribe({
      next: (data) => {
        this.tokenStorage.saveUser(data.body);
        this.tokenStorage.saveToken(data.headers.get("X-ACCESS-TOKEN"));
        this.tokenStorage.saveRefresh(data.headers.get("X-REFRESH-TOKEN"));
        this.isLoginFailed = false;
        this.isLoggedIn = true;
        window.location.replace("/");
      },
      error: (error) => {
        this.isLoginFailed = true;
        this.errorMessage = error.error;
      }
    });
  }

  loginWithGoogle() {
    this.socialAuthService.signIn(GoogleLoginProvider.PROVIDER_ID).finally(() => {window.location.replace("/")});
  }

  loginWithFacebook() {
    this.socialAuthService.signIn(FacebookLoginProvider.PROVIDER_ID).finally(() => {window.location.replace("/")});
  }

}
