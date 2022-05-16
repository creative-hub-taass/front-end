import {Component, OnInit} from "@angular/core";
import {AuthService} from "../_services/auth.service";

@Component({
  selector: "app-register",
  templateUrl: "./register.component.html",
  styleUrls: ["./register.component.css"]
})
export class RegisterComponent implements OnInit {

  form: any = {
    nickname: null,
    email: null,
    password: null
  };
  isSuccessful = false;
  isRegistrationFailed = false;
  errorMessage = "";

  constructor(private authService: AuthService) {
  }

  ngOnInit(): void {
  }

  onSubmit(): void {
    const {nickname, email, password} = this.form;
    this.authService.register(nickname, email, password).subscribe({
      next: () => {
        this.isSuccessful = true;
        this.isRegistrationFailed = false;
      },
      error: (error) => {
        this.errorMessage = error.error;
      }
    });
  }

}
