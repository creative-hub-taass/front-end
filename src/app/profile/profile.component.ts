import {Component, OnInit} from "@angular/core";
import {UserService} from "../_services/user.service";
import {EventBusService} from "../../_shared/event-bus.service";
import {EventData} from "../../_shared/event";


@Component({
  selector: "app-profile",
  templateUrl: "./profile.component.html",
  styleUrls: ["./profile.component.css"]
})
export class ProfileComponent implements OnInit {

  content?: string;

  constructor(private UserService: UserService, private eventBusService: EventBusService) { }

  ngOnInit(): void {

    this.UserService.getUserBoard().subscribe(
      (users) => {
        console.log(users);
      },
      (error) => {
        this.content = error.error.message || error.error || error.message;
        if (error.status == 403)
          this.eventBusService.emit(new EventData("logout", null));
      }
    );
  }


}
