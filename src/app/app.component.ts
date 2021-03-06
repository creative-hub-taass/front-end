import {Component, OnDestroy, OnInit} from "@angular/core";
import {TokenStorageService} from "./_services/token-storage.service";
import {Subscription} from "rxjs";
import {EventBusService} from "../_shared/event-bus.service";
import {PublicUser} from "../_models/PublicUser";

@Component({
  selector: "app-root",
  templateUrl: "./app.component.html",
  styleUrls: ["./app.component.css"]
})

export class AppComponent implements OnInit, OnDestroy {
  showSideMenu = false;

  isLoggedIn = false;
  nickname?: string;
  title: string | undefined;
  eventBusSub?: Subscription;

  constructor(private tokenStorageService: TokenStorageService, private eventBusService: EventBusService) {
  }

  ngOnInit(): void {
    this.isLoggedIn = !!this.tokenStorageService.getToken();

    if (this.isLoggedIn) {
      const user = this.tokenStorageService.getUser();
      this.nickname = user.nickname;
    }
    /*
   * Possiamo mandare eventi al bus e se un listener è registrato con l'eventName,
   * eseguirà una callback alla funzione action
   */
    this.eventBusSub = this.eventBusService.on("logout", () => {
      this.logout();
    });
  }

  ngOnDestroy(): void {
    if (this.eventBusSub)
      this.eventBusSub.unsubscribe();
  }


  logout(): void {
    this.tokenStorageService.logout();
    this.isLoggedIn = false;
    window.location.replace("/");
  }

  toggleMenu() {
    this.showSideMenu = !this.showSideMenu;
  }

  getUserInfo(): PublicUser {
    return this.tokenStorageService.getUser();
  }
}
