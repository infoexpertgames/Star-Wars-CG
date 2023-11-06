export interface ApiMultiResponse {
    message?: string;
    total_records?: number,
    total_pages?: number,
    previous?: string,
    next?: string,
    results?: any;
}