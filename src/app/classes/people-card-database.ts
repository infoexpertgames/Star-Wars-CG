import { ApiMultiResponse } from './../interfaces/api-multi-response.interface';
import { ApiSingleResponse } from "../interfaces/api-response.interface";
import { CardDetails } from "../interfaces/card-details.interface";
import { CardHeader } from "../interfaces/card_header.interface";
import { CardDatabase } from "./card-database";

export class PeopleCardDatabase extends CardDatabase {

    loadAvailablePeople() {
        console.log("PeopleCardDatabase.loadAvailablePeople()");
        this.cardsProviderService.getFirstResultsPageOfPeople()
        .subscribe({
            next: (value: JSON) => {
                console.log("PeopleCardDatabase.loadAvailablePeople() value: " + JSON.stringify(value));
                let apiMultiResponse: ApiMultiResponse = value as ApiMultiResponse;
                this.gameComponent.addTotalRecords(apiMultiResponse.total_records || 0);
                this.parseCardHeaders(value);
            },
            error: (err: any) => {
                console.error(err);
                this.gameComponent.setCardsProviderError(err);
            },
            complete: () => {
                console.log("PeopleCardDatabase.loadAvailablePeople() complete");
            }
        });
    }

    protected override getCardsDetails(leftCardHeader: CardHeader, rightCardHeader: CardHeader) {
        this.getPersonDetails(leftCardHeader, true);
        this.getPersonDetails(rightCardHeader, false);
    }

    private getPersonDetails(cardHeader: CardHeader, isLeft: boolean) {
        this.cardsProviderService.getResult(cardHeader.url)
        .subscribe({
            next: (value: JSON) => {
                console.log("PeopleCardDatabase.getPersonDetails() value: " + JSON.stringify(value));
                this.parsePeopleResult(value, isLeft);
            },
            error: (err: any) => {
                console.error(err);
                this.gameComponent.setCardsProviderError(err);
            },
            complete: () => {
                console.log("People.getPersonDetails() complete");
            }
        });
    }

    private parsePeopleResult(value: JSON, isLeft: boolean) {
        let apiSingleResponse: ApiSingleResponse = {};
        Object.assign(apiSingleResponse, value);
        if(apiSingleResponse.message == "ok") {
            let cardsDetails: CardDetails = apiSingleResponse.result as CardDetails;
            if(isLeft) {
                this.leftCardDetails = cardsDetails;
            } else {
                this.rightCardDetails = cardsDetails;
            }
            console.log("PeopleCardDatabase.parsePeopleResults() leftCardDetails: " + this.leftCardDetails + "  rightCardDetails: " + this.rightCardDetails);
            if(this.leftCardDetails != null && this.rightCardDetails != null) {
                this.gameComponent.onPeopleCardsReady(this.leftCardDetails, this.rightCardDetails);
            }
        }
    }
}