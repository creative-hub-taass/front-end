import {NgModule} from "@angular/core";
import {RouterModule, Routes} from "@angular/router";
import {LoginComponent} from "./login/login.component";
import {RegisterComponent} from "./register/register.component";
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
import {OwnCollabsComponent} from "./own-collabs/own-collabs.component";
import {RequestUpgradeComponent} from "./request-upgrade/request-upgrade.component";
import {RequestCollabComponent} from "./request-collab/request-collab.component";
import {OwnUpgradesComponent} from "./own-upgrades/own-upgrades.component";
import {OwnOrdersComponent} from "./own-orders/own-orders.component";
import {OwnDonationsComponent} from "./own-donations/own-donations.component";

const routes: Routes = [
  {path: "", component: HomeComponent},
  {path: "home", component: HomeComponent},
  {path: "registration", component: RegisterComponent},
  {path: "login", component: LoginComponent},
  {path: "users", component: ProfileComponent},
  {path: "artwork/:id", component: ArtworkComponent},
  {path: "event/:id", component: EventComponent},
  {path: "post/:id", component: PostComponent},
  {path: "modify-artwork/:id", component: ModifyArtworkComponent},
  {path: "modify-artwork", component: ModifyArtworkComponent},
  {path: "modify-event/:id", component: ModifyEventComponent},
  {path: "modify-event", component: ModifyEventComponent},
  {path: "modify-post/:id", component: ModifyPostComponent},
  {path: "modify-post", component: ModifyPostComponent},
  {path: "about/:id", component: AboutComponent},
  {path: "portfolio/:id", component: PortfolioComponent},
  {path: "events/:id", component: EventsComponent},
  {path: "shop/:id", component: ShopComponent},
  {path: "collaborations/:id", component: CollabsComponent},
  {path: "collaborations-requests", component: OwnCollabsComponent},
  {path: "upgrade-requests", component: OwnUpgradesComponent},
  {path: "upgrade-request", component: RequestUpgradeComponent},
  {path: "collaboration-request", component: RequestCollabComponent},
  {path: "orders", component: OwnOrdersComponent},
  {path: "donations", component: OwnDonationsComponent},
  {path: "profile", component: ProfileComponent},
  {path: "**", redirectTo: "/home"}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {
}
