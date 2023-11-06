import { Component } from '@angular/core';
import { CardDetails } from '../interfaces/card-details.interface';
import { CardDetailsProperties } from '../interfaces/card-details-properties.interface';

export enum Type {
  Undefined = -1,
  People = 0,
  Starships = 1
}

@Component({
  selector: 'app-card',
  templateUrl: './card.component.html',
  styleUrls: ['./card.component.css']
})
export class CardComponent {
  private type: Type = Type.Undefined;
  private cardDetails: CardDetails | null = null;

  constructor() {
  }

  setCard(cardDetails: CardDetails | null, type: Type) {
    console.log("setCard() cardDetails: " + cardDetails + " type: " + type);
    this.cardDetails = cardDetails;
    this.type = type;
  }

  isPeople() {
    return this.type == Type.People;
  }

  isStarships() {
    return this.type == Type.Starships;
  }

  /*
  getCardDetailsAsString(): string {
    if(this.cardDetails != null) {
      return JSON.stringify(this.cardDetails);
    } else {
      return "[no card]";
    }
  }

  getCardDetails(): CardDetails | null{
    if(this.cardDetails != null) {
      return this.cardDetails;
    } else {
      return null;
    }
  }

  getCardProperties(): CardDetailsProperties {
    if(this.cardDetails != null) {
      return this.cardDetails.properties;
    }
    return {};
  }
  */

  getCardDetailsProperties(): Map<string, string> {
    if(this.cardDetails != null) {
      return new Map(Object.entries(this.cardDetails.properties));
    }
    return new Map();
  }
}
