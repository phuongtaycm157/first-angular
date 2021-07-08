import { Injectable } from '@angular/core';
import {
  HttpClient,
  HttpErrorResponse,
  HttpHeaders,
  HttpParams,
} from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError, retry } from 'rxjs/operators';
import { PostSchema, PostsSchema } from 'src/dataConfig/posts.schema';

@Injectable({
  providedIn: 'root',
})
export class PostsService {
  postsUrl = 'http://localhost:3000/posts';
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

  get(): Observable<PostsSchema> {
    return this.http
      .get<PostsSchema>(this.postsUrl)
      .pipe(retry(3), catchError(this.handleError));
  }
  getOne(id: number): Observable<PostSchema> {
    const url = `${this.postsUrl}/${id}`;
    return this.http
      .get<PostSchema>(url)
      .pipe(retry(3), catchError(this.handleError));
  }
  search(userId: number): Observable<PostsSchema> {
    const options = userId
      ? { params: new HttpParams().set('userId', userId) }
      : {};
    return this.http
      .get<PostsSchema>(this.postsUrl, options)
      .pipe(retry(3), catchError(this.handleError));
  }
  paginate(page: number, limit?: number): Observable<PostsSchema> {
    let params = new HttpParams().set('_page', page);
    if (limit) {
      params.append('_limit', limit);
    }
    const options = { params };
    return this.http
      .get<PostsSchema>(this.postsUrl, options)
      .pipe(retry(3), catchError(this.handleError));
  }
  post(post: PostSchema): Observable<PostSchema> {
    return this.http
      .post<PostSchema>(this.postsUrl, post, this.httpHeader)
      .pipe(catchError(this.handleError));
  }
  delete(id: number): Observable<unknown> {
    const url = `${this.postsUrl}/${id}`;
    return this.http
      .delete(url, this.httpHeader)
      .pipe(catchError(this.handleError));
  }
  put(post: PostSchema): Observable<PostSchema> {
    const url = `${this.postsUrl}/${post.id}`;
    return this.http
      .put<PostSchema>(url, post, this.httpHeader)
      .pipe(catchError(this.handleError));
  }
}
