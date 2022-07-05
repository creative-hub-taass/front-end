import {Component, OnInit} from "@angular/core";
import {AuthService} from "../_services/auth.service";
import {FacebookLoginProvider, SocialAuthService, SocialUser} from "@abacritt/angularx-social-login";
import {TokenStorageService} from "../_services/token-storage.service";

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
  errorMessage = "";
  isLoggedIn = false;
  isLoginFailed = false;
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
              window.location.replace("/");
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

  loginWithFacebook() {
    this.socialAuthService.signIn(FacebookLoginProvider.PROVIDER_ID);
  }
}
