import { Component, OnInit } from '@angular/core';
import {EventBusService} from "../../_shared/event-bus.service";
import {ActivatedRoute} from "@angular/router";
import {PublicationService} from "../_services/publication.service";
import {PublicUser} from "../../_models/PublicUser";
import * as utility from "../../_shared/functions";
import {PublicCreator} from "../../_models/PublicCreator";
import {Artwork} from "../../_models/Artwork";
import {PaymentService} from "../_services/payment.service";
import {Order} from "../../_models/Order";
import {TokenStorageService} from "../_services/token-storage.service";

@Component({
  selector: 'app-shop',
  templateUrl: './shop.component.html',
  styleUrls: ['./shop.component.css']
})
export class ShopComponent implements OnInit {



  constructor() { }

  ngOnInit(): void {
  }

}
