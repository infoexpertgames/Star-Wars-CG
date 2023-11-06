import { ApiMultiResponse } from "../interfaces/api-multi-response.interface";
import { ApiSingleResponse } from "../interfaces/api-response.interface";
import { CardDetails } from "../interfaces/card-details.interface";
import { CardHeader } from "../interfaces/card_header.interface";
import { CardDatabase } from "./card-database";

export class StarshipsCardDatabase extends CardDatabase  {

    loadAvailableStarships() {
        console.log("StarshipsCardDatabase.loadAvailableStarships()");
        this.cardsProviderService.getFirstResultsPageOfStarships()
        .subscribe({
            next: (value: JSON) => {
                console.log("StarshipsCardDatabase.loadAvailableStarships() value: " + JSON.stringify(value));
                let apiMultiResponse: ApiMultiResponse = value as ApiMultiResponse;
                this.gameComponent.addTotalRecords(apiMultiResponse.total_records || 0);
                this.parseCardHeaders(value);
            },
            error: (err: any) => {
                console.error(err);
            },
            complete: () => {
                console.log("StarshipsCardDatabase.loadAvailableStarships() complete");
            }
        });
    }

    protected override getCardsDetails(leftCardHeader: CardHeader, rightCardHeader: CardHeader) {
        this.getStarshipDetails(leftCardHeader, true);
        this.getStarshipDetails(rightCardHeader, false);
    }

    private getStarshipDetails(cardHeader: CardHeader, isLeft: boolean) {
        this.cardsProviderService.getResult(cardHeader.url)
        .subscribe({
            next: (value: JSON) => {
                console.log("StarshipsCardDatabase.getStarshipDetails() value: " + JSON.stringify(value));
                this.parseStarshipsResult(value, isLeft);
            },
            error: (err: any) => {
                console.error(err);
                this.gameComponent.setCardsProviderError(err);
            },
            complete: () => {
                console.log("StarshipsCardDatabase.getStarshipDetails() complete");
            }
        });
    }

    private parseStarshipsResult(value: JSON, isLeft: boolean) {
        let apiSingleResponse: ApiSingleResponse = {};
        Object.assign(apiSingleResponse, value);
        if(apiSingleResponse.message == "ok") {
            let cardsDetails: CardDetails = apiSingleResponse.result as CardDetails;
            if(isLeft) {
                this.leftCardDetails = cardsDetails;
            } else {
                this.rightCardDetails = cardsDetails;
            }
            console.log("StarshipsCardDatabase.parseStarshipsResults() leftCardDetails: " + this.leftCardDetails + "  rightCardDetails: " + this.rightCardDetails);
            if(this.leftCardDetails != null && this.rightCardDetails != null) {
                this.gameComponent.onStarshipsCardsReady(this.leftCardDetails, this.rightCardDetails);
            }
        }
    }    
}