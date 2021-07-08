import { Injectable } from '@angular/core';
import {
  HttpClient,
  HttpErrorResponse,
  HttpHeaders,
  HttpParams,
} from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError, retry } from 'rxjs/operators';

import { UserSchema, UsersSchema } from 'src/dataConfig/users.schema';

@Injectable({
  providedIn: 'root',
})
export class UsersService {
  usersUrl = 'http://localhost:3000/users';
  httpHeader = {
    headers: new HttpHeaders({
      'Content-Type': 'application/json',
    }),
  };

  constructor(private http: HttpClient) {}

  private handleError(error: HttpErrorResponse) {
    if (error.status === 0) {
      console.error('An error occurred:', error.error);
    } else {
      console.error(
        `Backend returned code ${error.status},` + `body was: ${error.error}`
      );
    }
    return throwError('Something bad happened; please try again later.');
  }

  get(): Observable<UsersSchema> {
    return this.http
      .get<UsersSchema>(this.usersUrl)
      .pipe(retry(3), catchError(this.handleError));
  }
  getOne(id: number): Observable<UserSchema> {
    const url = `${this.usersUrl}/${id}`;
    return this.http
      .get<UserSchema>(url)
      .pipe(retry(3), catchError(this.handleError));
  }
  paginate(page: number, limit?: number): Observable<UsersSchema> {
    let params = new HttpParams().set('_page', page);
    if (limit) {
      params.append('_limit', limit);
    }
    const options = { params };
    return this.http
      .get<UsersSchema>(this.usersUrl, options)
      .pipe(retry(3), catchError(this.handleError));
  }
  post(user: UserSchema): Observable<UserSchema> {
    return this.http
      .post<UserSchema>(this.usersUrl, user, this.httpHeader)
      .pipe(catchError(this.handleError));
  }
  delete(id: number): Observable<unknown> {
    const url = `${this.usersUrl}/${id}`;
    return this.http
      .delete(url, this.httpHeader)
      .pipe(catchError(this.handleError));
  }
  put(user: UserSchema): Observable<UserSchema> {
    const url = `${this.usersUrl}/${user.id}`;
    return this.http
      .put<UserSchema>(url, user, this.httpHeader)
      .pipe(catchError(this.handleError));
  }
}
