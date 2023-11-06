import { GameComponent } from './../game/game.component';
import { CardHeader } from "../interfaces/card_header.interface";
import { CardsProviderService } from "../services/cards-provider.service";
import { CardDetails } from '../interfaces/card-details.interface';
import { ApiMultiResponse } from '../interfaces/api-multi-response.interface';

export class CardDatabase {
    protected cardIndexes: Array<number> = new Array();
    protected cardsHeaders: Array<CardHeader> = [];

    protected leftCardDetails: CardDetails | null = null;
    protected rightCardDetails: CardDetails | null = null;

    protected isCardsHeadersReady: boolean = false;

    constructor(protected gameComponent: GameComponent, protected cardsProviderService: CardsProviderService) {

    }

    getIsCardsHeadersReady(): boolean {
        return this.isCardsHeadersReady;
    }

    pickTwoRandomCards() {
        console.log("PeopleCardDatabase.pickTwoRandomPersonCards()");
        this.leftCardDetails = null;
        this.rightCardDetails = null;
        let shuffledIndexes: Array<number> = this.shuffleIndexes(this.cardIndexes);
        let leftCardHeader: CardHeader = this.getCardHeaderByIndex(shuffledIndexes[0]);
        let rightCardHeader: CardHeader = this.getCardHeaderByIndex(shuffledIndexes[1]);

        console.log(leftCardHeader);
        console.log(rightCardHeader);

        this.getCardsDetails(leftCardHeader, rightCardHeader);
    }

    protected getCardsDetails(leftCardHeader: CardHeader, rightCardHeader: CardHeader) {}

    protected getCardHeaderByIndex(index: number): CardHeader {
        return this.cardsHeaders[index];
    }

    protected shuffleIndexes(array: number[]) : number[] {
        return array.sort(() => Math.random() - 0.5); 
    };

    protected loadNextPage(nextPageUrl: string) {
        console.log("CardDatabase.loadNextPage()");
        this.cardsProviderService.getResult(nextPageUrl)
        .subscribe({
            next: (value: JSON) => {
                console.log("CardDatabase.loadNextPage() value: " + JSON.stringify(value));
                this.parseCardHeaders(value);
            },
            error: (err: any) => {
                console.error(err);
                this.gameComponent.setCardsProviderError(err);
            },
            complete: () => {
                console.log("CardDatabase.loadNextPage() complete");
            }
        });
    }

    protected parseCardHeaders(value: JSON) {
        console.log("CardDatabase.parseCardHeaders()");
        let apiMultiResponse: ApiMultiResponse = {};
        Object.assign(apiMultiResponse, value);
        if(apiMultiResponse.message == "ok") {
            let cardsHeaders: CardHeader[] = apiMultiResponse.results as CardHeader[];
            this.cardsHeaders = this.cardsHeaders.concat(cardsHeaders);
            console.log("CardDatabase.parseCardHeaders() this.cardsHeaders.length: " + this.cardsHeaders.length);
            this.gameComponent.addLoadedRecord(cardsHeaders.length || 0);
            if(apiMultiResponse.next != undefined && apiMultiResponse.next != null && apiMultiResponse.next != "") {
                this.loadNextPage(apiMultiResponse.next);
            } else {
                for(let i: number = 0; i<this.cardsHeaders.length; i++) {
                    this.cardIndexes.push(i);
                }
                this.isCardsHeadersReady = true;
                this.gameComponent.onCardDatabaseReady();
            }
        }
    }
}