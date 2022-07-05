import {EventEmitter} from "@angular/core";
import {BehaviorSubject, skip} from "rxjs";
import {BaseLoginProvider, SocialUser} from "@abacritt/angularx-social-login";
import jwt_decode from "jwt-decode";

export class GoogleLoginProvider extends BaseLoginProvider {
  public static readonly PROVIDER_ID: string = "GOOGLE";

  // @ts-ignore
  public override readonly changeUser = new EventEmitter<SocialUser | null>();

  private readonly _socialUser = new BehaviorSubject<SocialUser | null>(null);

  constructor(
    private clientId: string,
    private readonly initOptions?: Record<any, any>
  ) {
    super();
    // emit changeUser events but skip initial value from behaviorSubject
    this._socialUser.pipe(skip(1)).subscribe(this.changeUser);
  }

  private static createSocialUser(idToken: string) {
    const user = new SocialUser();
    user.idToken = idToken;
    const payload: Record<any, any> = jwt_decode(idToken);
    user.id = payload["sub"];
    user.name = payload["name"];
    user.email = payload["email"];
    user.photoUrl = payload["picture"];
    user.firstName = payload["given_name"];
    user.lastName = payload["family_name"];
    return user;
  }

  initialize(autoLogin?: boolean): Promise<void> {
    return new Promise((resolve, reject) => {
      try {
        this.loadScript(
          GoogleLoginProvider.PROVIDER_ID,
          "https://accounts.google.com/gsi/client",
          () => {
            // @ts-ignore
            google.accounts.id.initialize({
              client_id: this.clientId,
              callback: (response: any) => {
                const socialUser = GoogleLoginProvider.createSocialUser(response.credential);
                this._socialUser.next(socialUser);
              }
            });
            // @ts-ignore
            google.accounts.id.renderButton(document.getElementById("googleButton"), {
              shape: "pill",
              size: "large",
              text: "signin_with",
              theme: "outline",
              type: "standard"
            });
            // @ts-ignore
            google.accounts.id.prompt(); // also display the One Tap dialog
            resolve();
          }
        );
      } catch (err) {
        reject(err);
      }
    });
  }

  getLoginStatus(): Promise<SocialUser> {
    return new Promise((resolve, reject) => {
      if (this._socialUser.value) {
        resolve(this._socialUser.value);
      } else {
        reject(
          `No user is currently logged in with ${GoogleLoginProvider.PROVIDER_ID}`
        );
      }
    });
  }

  override refreshToken(): Promise<SocialUser | null> {
    return new Promise((resolve, reject) => {
      // @ts-ignore
      google.accounts.id.revoke(this._socialUser.value.id, (response: any) => {
        if (response.error) reject(response.error);
        else resolve(this._socialUser.value);
      });
    });
  }

  signIn(): Promise<SocialUser> {
    return Promise.reject(
      "You should not call this method directly for Google, use \"<asl-google-signin-button>\" wrapper " +
      "or generate the button yourself with \"google.accounts.id.renderButton()\" " +
      "(https://developers.google.com/identity/gsi/web/guides/display-button#javascript)"
    );
  }

  async signOut(): Promise<void> {
    // @ts-ignore
    google.accounts.id.disableAutoSelect();
    this._socialUser.next(null);
  }
}
