import { Injectable } from '@angular/core';
import {
  HttpClient,
  HttpErrorResponse,
  HttpHeaders,
  HttpParams,
} from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError, retry } from 'rxjs/operators';
import { CommentSchema, CommentsSchema } from 'src/dataConfig/comments.schema';

@Injectable({
  providedIn: 'root',
})
export class CommentsService {
  commentsUrl = 'http://localhost:3000/comments';
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

  get(): Observable<CommentsSchema> {
    return this.http
      .get<CommentsSchema>(this.commentsUrl)
      .pipe(retry(3), catchError(this.handleError));
  }
  getOne(id: number): Observable<CommentSchema> {
    const url = `${this.commentsUrl}/${id}`;
    return this.http
      .get<CommentSchema>(url)
      .pipe(retry(3), catchError(this.handleError));
  }
  search(userId?: number, postId?: number): Observable<CommentsSchema> {
    let options = {};
    if (!postId && userId) {
      options = { params: new HttpParams().set('userId', userId) };
    } else if (postId && !userId) {
      options = { params: new HttpParams().set('postId', postId) };
    } else if (postId && userId) {
      options = {
        params: new HttpParams().set('userId', userId).set('postId', postId),
      };
    }
    console.log(options);
    return this.http
      .get<CommentsSchema>(this.commentsUrl, options)
      .pipe(retry(3), catchError(this.handleError));
  }
  paginate(page: number, limit?: number): Observable<CommentsSchema> {
    let params = new HttpParams().set('_page', page);
    if (limit) {
      params.append('_limit', limit);
    }
    const options = { params };
    return this.http
      .get<CommentsSchema>(this.commentsUrl, options)
      .pipe(retry(3), catchError(this.handleError));
  }
  post(comment: CommentSchema): Observable<CommentSchema> {
    return this.http
      .post<CommentSchema>(this.commentsUrl, comment, this.httpHeader)
      .pipe(catchError(this.handleError));
  }
  delete(id: number): Observable<unknown> {
    const url = `${this.commentsUrl}/${id}`;
    return this.http
      .delete(url, this.httpHeader)
      .pipe(catchError(this.handleError));
  }
  put(comment: CommentSchema): Observable<CommentSchema> {
    const url = `${this.commentsUrl}/${comment.id}`;
    return this.http
      .put<CommentSchema>(url, comment, this.httpHeader)
      .pipe(catchError(this.handleError));
  }
}
