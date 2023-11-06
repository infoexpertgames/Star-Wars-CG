import { Component, OnInit, AfterViewInit, ViewChild } from '@angular/core';
import { CardsProviderService } from '../services/cards-provider.service';
import { CardComponent, Type } from '../card/card.component';
import { CardDetails } from '../interfaces/card-details.interface';
import { PeopleCardDatabase } from '../classes/people-card-database';
import { StarshipsCardDatabase } from '../classes/starships-card-database';
import { Battle, BattleType, BattleWinner } from './../classes/battle';

@Component({
  selector: 'app-game',
  templateUrl: './game.component.html',
  styleUrls: ['./game.component.css']
})
export class GameComponent implements OnInit, AfterViewInit {

  @ViewChild('leftCard') leftCard!: CardComponent;
  @ViewChild('rightCard') rightCard!: CardComponent;

  cardsProviderError: any = null;
  databaseLoadProgress: number = 0;

  private isDemoMode = false;
  private totalRecords: number = 0;
  private loadedRecords: number = 0;
  private peopleCardDatabase: PeopleCardDatabase;
  private starshipsCardDatabase: StarshipsCardDatabase;
  private battle: Battle;
  private isBattleResultReady: boolean = false;
  private battleWinner: BattleWinner = BattleWinner.Undefined;

  constructor(private cardsProviderService: CardsProviderService) {
    this.peopleCardDatabase = new PeopleCardDatabase(this, this.cardsProviderService);
    this.starshipsCardDatabase = new StarshipsCardDatabase(this, this.cardsProviderService);
    this.battle = new Battle(this);
  }

  ngOnInit() {
    console.log("GameComponent.ngOnInit()");
    this.init();
  }

  ngAfterViewInit() {
    console.log("GameComponent.ngAfterViewInit() leftCard: " + this.leftCard + " rightCard: " + this.leftCard);
  }

  init(forceDemoMode: boolean = false) {
    this.isDemoMode = forceDemoMode;
    this.cardsProviderError = null;

    if(this.isDemoMode) {
      this.demoOnInit();
    } else {
      this.normalInit();
    }
  }

  private normalInit() {
    this.peopleCardDatabase.loadAvailablePeople();
    this.starshipsCardDatabase.loadAvailableStarships();
  }

  onCardDatabaseReady() {
    console.log("GameComponent.onCardDatabaseReady() ready: " + this.peopleCardDatabase.getIsCardsHeadersReady());
    if(this.peopleCardDatabase.getIsCardsHeadersReady()) {
      this.initBattle();
    }
  }

  initBattle() {
    console.log("GameComponent.initBattle()");
    this.isBattleResultReady = false;
    this.leftCard?.setCard(null, Type.Undefined);
    this.rightCard?.setCard(null, Type.Undefined);
    this.battleWinner = BattleWinner.Undefined;

    if(this.isDemoMode) {
        this.init();
    } else {
      let battleTypeIndex: number = Math.round(Math.random() * 2);
      if(battleTypeIndex == 0) {
        console.log("GameComponent.initBattle() People");
        this.peopleCardDatabase.pickTwoRandomCards();
      } else {
        console.log("GameComponent.initBattle() Starships");
        this.starshipsCardDatabase.pickTwoRandomCards();
      }
    }
  }

  onPeopleCardsReady(leftCardDetails: CardDetails, rightCardDetails: CardDetails) {
    console.log("GameComponent.onPeopleCardsReady() leftCardDetails: " + leftCardDetails + " rightCardDetails: " + rightCardDetails);
    this.leftCard?.setCard(leftCardDetails, Type.People);
    this.rightCard?.setCard(rightCardDetails, Type.People);
    this.startBattle(BattleType.People, leftCardDetails, rightCardDetails);
  }

  onStarshipsCardsReady(leftCardDetails: CardDetails, rightCardDetails: CardDetails) {
    console.log("GameComponent.onStarshipsCardsReady() leftCardDetails: " + leftCardDetails + " rightCardDetails: " + rightCardDetails);
    this.leftCard?.setCard(leftCardDetails, Type.Starships);
    this.rightCard?.setCard(rightCardDetails, Type.Starships);
    this.startBattle(BattleType.Starships, leftCardDetails, rightCardDetails);
  }

  private startBattle(batleType: BattleType, leftCardDetails: CardDetails, rightCardDetails: CardDetails) {
    console.log("GameComponent.startBattle()");
    this.battle.startBattle(batleType, leftCardDetails, rightCardDetails);
  }

  showBattleWinner(battleWinner: BattleWinner) {
    console.log("GameComponent.showBattleWinner() battleWinner: " + battleWinner);
    this.isBattleResultReady = true;
    this.battleWinner = battleWinner;
  }

  addTotalRecords(recordsCount: number) {
    this.totalRecords += recordsCount;
    console.log("GameComponent.addTotalRecords() recordsCount: " + recordsCount + " totalRecords: " + this.totalRecords);
  }

  addLoadedRecord(recordsCount: number) {
    this.loadedRecords += recordsCount;
    console.log("GameComponent.addLoadedRecord() recordsCount: " + recordsCount + " loadedRecords: " + this.loadedRecords);
    if(this.totalRecords == 0) {
      this.databaseLoadProgress = 0;
    } else {
      this.databaseLoadProgress = Math.round((this.loadedRecords / this.totalRecords) * 100);
    }
  }

  getIsBattleResultReady(): boolean {
    return this.isBattleResultReady;
  }

  getBattleWiner(): string {
    switch(this.battleWinner) {
      case BattleWinner.Left:
        return "LEFT CARD WINS";
      case BattleWinner.Right:
        return "RIGHT CARD WINS";
      case BattleWinner.Tie:
        return "WE HAVE A TIE";
      case BattleWinner.Unknown:
        return "CAN'T POINT THE WINER";
    }
    return "";
  }

  setCardsProviderError(err: any) {
    this.cardsProviderError = err;
  }

  private demoOnInit() {
    let leftCardDetails: CardDetails = JSON.parse("{\"properties\":{\"model\":\"Sentinel-class landing craft\",\"starship_class\":\"landing craft\",\"manufacturer\":\"Sienar Fleet Systems, Cyngus Spaceworks\",\"cost_in_credits\":\"240000\",\"length\":\"38\",\"crew\":\"5\",\"passengers\":\"75\",\"max_atmosphering_speed\":\"1000\",\"hyperdrive_rating\":\"1.0\",\"MGLT\":\"70\",\"cargo_capacity\":\"180000\",\"consumables\":\"1 month\",\"pilots\":[],\"created\":\"2020-09-17T17:55:06.604Z\",\"edited\":\"2020-09-17T17:55:06.604Z\",\"name\":\"Sentinel-class landing craft\",\"url\":\"https://www.swapi.tech/api/starships/5\"},\"description\":\"A Starship\",\"_id\":\"5f63a34fee9fd7000499be20\",\"uid\":\"5\",\"__v\":0}");
    let rightCardDetails: CardDetails = JSON.parse("{\"properties\":{\"model\":\"Imperial I-class Star Destroyer\",\"starship_class\":\"Star Destroyer\",\"manufacturer\":\"Kuat Drive Yards\",\"cost_in_credits\":\"150000000\",\"length\":\"1,600\",\"crew\":\"47,060\",\"passengers\":\"n/a\",\"max_atmosphering_speed\":\"975\",\"hyperdrive_rating\":\"2.0\",\"MGLT\":\"60\",\"cargo_capacity\":\"36000000\",\"consumables\":\"2 years\",\"pilots\":[],\"created\":\"2020-09-17T17:55:06.604Z\",\"edited\":\"2020-09-17T17:55:06.604Z\",\"name\":\"Star Destroyer\",\"url\":\"https://www.swapi.tech/api/starships/3\"},\"description\":\"A Starship\",\"_id\":\"5f63a34fee9fd7000499be1f\",\"uid\":\"3\",\"__v\":0}");
    this.databaseLoadProgress = 0;
    let timeout: any = setInterval(() => {
      if(this.databaseLoadProgress < 100) {
        this.databaseLoadProgress += 1;
      }
    }, 0.01);
    setTimeout(() => {
      clearTimeout(timeout);
      this.onStarshipsCardsReady(leftCardDetails, rightCardDetails);
    }, 3000);
  }
}
