import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from  '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class CardsProviderService {
  apiUrl: string = "https://www.swapi.tech/api/";
  peopleUrl: string = "people/";
  starshipsUrl: string = "starships/";

  constructor(private http: HttpClient) {
  }

  getFirstResultsPageOfPeople(): Observable<JSON> {
    return this.getResult(this.apiUrl + this.peopleUrl);
  }

  getFirstResultsPageOfStarships(): Observable<JSON> {
    return this.getResult(this.apiUrl + this.starshipsUrl);
  }
  
  getResult(url: string): Observable<JSON> {
    return this.http.get<JSON>(url).pipe(
      catchError(this.handleError)
    );
  }

  private handleError(error: HttpErrorResponse) {
    if (error.status === 0) {
      console.error('An error occurred:', error.message);
    } else {
      console.error(`Backend returned code ${error.status}, body was: `, error.message);
    }
    return throwError(() => new Error('API is unavailable. Please try again later!'));
  }
}
