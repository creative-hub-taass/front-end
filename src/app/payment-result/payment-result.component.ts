import {Component, OnInit} from '@angular/core';
import {ActivatedRoute} from "@angular/router";
import * as utility from "../../_shared/functions";
import {EventBusService} from "../../_shared/event-bus.service";

@Component({
  selector: 'app-payment-result',
  templateUrl: './payment-result.component.html',
  styleUrls: ['./payment-result.component.css']
})
export class PaymentResultComponent implements OnInit{
  motivation: string = "";
  errorMessage: string = "";

  constructor(private route: ActivatedRoute,
              private eventBusService: EventBusService) {
  }

  ngOnInit(){
    this.route.params.subscribe({
      next: (param) => {
        this.motivation = param['motivation'];
      },
      error: (error) => {
        this.errorMessage = utility.onError(error, this.eventBusService);
        console.log(this.errorMessage);
      }
      });
  }

}

