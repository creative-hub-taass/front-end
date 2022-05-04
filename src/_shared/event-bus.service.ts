import {Injectable, OnDestroy, OnInit} from '@angular/core';
import {filter, map, Subject, Subscription} from "rxjs";
import {TokenStorageService} from "../app/_services/token-storage.service";
import {EventData} from "./event";

@Injectable({
  providedIn: 'root'
})
/*
 * Manderemo l'evento logout all'App component quando lo status di risposta ci dice
 * che l'access token e il refresh token non sono più disponibili
 *
 * Per fare ciò abbiamo bisogno di un event-driven system globale, che ci permette
 * di ascoltare ed emettere (tramite il metodo emit) gli eventi da componenti indipendenti
 * così non abbiamo bisogno di avere dipendenze dirette
 */

export class EventBusService {

  private subject$ = new Subject<EventData>();

  constructor() {
  }


  emit(event: EventData) {
    this.subject$.next(event);
  }

  on(eventName: string, action: any): Subscription {
    return this.subject$.pipe(
      filter((e: EventData) => e.name === eventName),
      map((e: EventData) => e["value"])).subscribe(action);
  }
}
