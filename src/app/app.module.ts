import {NgModule} from "@angular/core";
import {BrowserModule} from "@angular/platform-browser";
import {HttpClientModule} from "@angular/common/http";
import {AppRoutingModule} from "./app-routing.module";
import {AppComponent} from "./app.component";
import {LoginComponent} from "./login/login.component";
import {RegisterComponent} from "./register/register.component";
import {authInterceptorProviders} from "src/_helpers/auth.interceptor";
import {FormsModule} from "@angular/forms";
import {
  FacebookLoginProvider,
  GoogleLoginProvider,
  SocialAuthServiceConfig,
  SocialLoginModule
} from "@abacritt/angularx-social-login";
import {CoolSocialLoginButtonsModule} from "@angular-cool/social-login-buttons";
import {ProfileComponent} from "./profile/profile.component";

import {HomeComponent} from "./home/home.component";
import {ArtworkComponent} from "./artwork/artwork.component";
import {EventComponent} from "./event/event.component";
import {PostComponent} from "./post/post.component";
import {ModifyArtworkComponent} from "./modify-artwork/modify-artwork.component";
import {ModifyEventComponent} from "./modify-event/modify-event.component";
import {ModifyPostComponent} from "./modify-post/modify-post.component";
import {AboutComponent} from "./about/about.component";
import {PortfolioComponent} from "./portfolio/portfolio.component";
import {EventsComponent} from "./events/events.component";
import {ShopComponent} from "./shop/shop.component";
import {CollabsComponent} from "./collabs/collabs.component";
import {NgbModule} from "@ng-bootstrap/ng-bootstrap";
import {OwnCollabsComponent} from "./own-collabs/own-collabs.component";
import {RequestUpgradeComponent} from "./request-upgrade/request-upgrade.component";
import {RequestCollabComponent} from "./request-collab/request-collab.component";
import {PaymentResultComponent} from "./payment-result/payment-result.component";
import {OwnUpgradesComponent} from "./own-upgrades/own-upgrades.component";
import {OwnOrdersComponent} from "./own-orders/own-orders.component";
import {OwnDonationsComponent} from "./own-donations/own-donations.component";
import {NgxMasonryModule} from "ngx-masonry";
import {BrowserAnimationsModule} from "@angular/platform-browser/animations";
import {MarkdownModule} from "ngx-markdown";


@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    RegisterComponent,
    ProfileComponent,
    HomeComponent,
    ArtworkComponent,
    EventComponent,
    PostComponent,
    ModifyArtworkComponent,
    ModifyEventComponent,
    ModifyPostComponent,
    AboutComponent,
    PortfolioComponent,
    EventsComponent,
    ShopComponent,
    CollabsComponent,
    OwnCollabsComponent,
    RequestUpgradeComponent,
    RequestCollabComponent,
    OwnUpgradesComponent,
    OwnOrdersComponent,
    OwnDonationsComponent,
    RequestCollabComponent,
    PaymentResultComponent

  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FormsModule,
    HttpClientModule,
    SocialLoginModule,
    CoolSocialLoginButtonsModule,
    NgbModule,
    BrowserAnimationsModule,
    NgxMasonryModule,
    MarkdownModule.forRoot()
  ],
  providers: [authInterceptorProviders,
    PaymentResultComponent,
    {
      provide: "SocialAuthServiceConfig",
      useValue: {
        autoLogin: false,
        providers: [
          {
            id: FacebookLoginProvider.PROVIDER_ID,
            provider: new FacebookLoginProvider("560270769175115")
          },
          {
            id: GoogleLoginProvider.PROVIDER_ID,
            provider: new GoogleLoginProvider("420683265133-6d5kfiedo8shhorjhi3du2ia8ue210un.apps.googleusercontent.com")
          }
        ]
      } as SocialAuthServiceConfig
    },
    LoginComponent],
  bootstrap: [AppComponent]
})

export class AppModule {
}
