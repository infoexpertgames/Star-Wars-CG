import { CardDetailsProperties } from "./card-details-properties.interface";

export interface CardDetails {
    description: string;
    uid: string;
    properties: CardDetailsProperties;
}