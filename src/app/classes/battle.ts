import { GameComponent } from "../game/game.component";
import { CardDetails } from "../interfaces/card-details.interface";

export enum BattleWinner {
    Undefined = -1,
    Unknown = 0,
    Left = 1,
    Right = 2,
    Tie = 3
}

export enum BattleType {
    People = 0,
    Starships = 1
}

export class Battle {

    private battleType: BattleType = BattleType.People;
    private leftCardDetails: CardDetails | null = null;
    private rightCardDetails: CardDetails | null = null;
    private battleWinner: BattleWinner = BattleWinner.Undefined;
     
    constructor(private gameComponent: GameComponent) {

    }

    startBattle(battleType: BattleType, leftCardDetails: CardDetails, rightCardDetails: CardDetails) {
        this.battleType = battleType;
        this.leftCardDetails = leftCardDetails;
        this.rightCardDetails = rightCardDetails;
        if(battleType == BattleType.People) {
            this.comparePeopleCards();
        } else {
            this.compareStarshipsCards();
        }
    }

    private comparePeopleCards() {
        if(this.leftCardDetails != null && this.rightCardDetails != null) {
            if(this.leftCardDetails.properties.mass != undefined && this.rightCardDetails.properties.mass != undefined) {
                if(this.leftCardDetails.properties.mass != "unknown" && this.rightCardDetails.properties.mass != "unknown") {
                    let leftCardMass: number = Number(this.leftCardDetails.properties.mass.replace(",", ""));
                    let rightCardMass: number = Number(this.rightCardDetails.properties.mass.replace(",", ""));
                    console.log("leftCardMass: " + leftCardMass + " rightCardMass: " + rightCardMass);
                    if(leftCardMass > rightCardMass) {
                        this.battleWinner = BattleWinner.Left;
                    } else if(leftCardMass < rightCardMass) {
                        this.battleWinner = BattleWinner.Right;
                    } else {
                        this.battleWinner = BattleWinner.Tie;
                    }
                } else {
                    this.battleWinner = BattleWinner.Unknown;
                }
            } else {
                this.battleWinner = BattleWinner.Unknown;
            }
        } else {
            this.battleWinner = BattleWinner.Unknown;
        }
        this.gameComponent.showBattleWinner(this.battleWinner);
    }
   
    private compareStarshipsCards() {
        if(this.leftCardDetails != null && this.rightCardDetails != null) {
            if(this.leftCardDetails.properties.crew != undefined && this.rightCardDetails.properties.crew != undefined) {
                if(this.leftCardDetails.properties.crew != "unknown" && this.rightCardDetails.properties.crew != "unknown") {
                    
                    let leftCardCrewString: string = this.leftCardDetails.properties.crew.replace(",", "");
                    let leftCardCrewStringSplits: string[] = leftCardCrewString.split("-");
                    leftCardCrewString = leftCardCrewStringSplits[leftCardCrewStringSplits.length - 1];
                    let leftCardCrew: number = Number(leftCardCrewString);

                    let rightCardCrewString: string = this.rightCardDetails.properties.crew.replace(",", "");
                    let rightCardCrewStringSplits: string[] = rightCardCrewString.split("-");
                    rightCardCrewString = rightCardCrewStringSplits[rightCardCrewStringSplits.length - 1];
                    let rightCardCrew: number = Number(rightCardCrewString);

                    console.log("leftCardCrew: " + leftCardCrew + " rightCardCrew: " + rightCardCrew);
                    
                    if(leftCardCrew > rightCardCrew) {
                        this.battleWinner = BattleWinner.Left;
                    } else if(leftCardCrew < rightCardCrew) {
                        this.battleWinner = BattleWinner.Right;
                    } else {
                        this.battleWinner = BattleWinner.Tie;
                    }
                } else {
                    this.battleWinner = BattleWinner.Unknown;
                }
            } else {
                this.battleWinner = BattleWinner.Unknown;
            }
        } else {
            this.battleWinner = BattleWinner.Unknown;
        }
        this.gameComponent.showBattleWinner(this.battleWinner);
    }
   
}