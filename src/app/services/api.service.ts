import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { delay, from, map, Observable, of, switchMap, tap } from 'rxjs';
import { CachingService } from './caching.service';



@Injectable({
  providedIn: 'root'
})
export class ApiService {

  constructor(private http: HttpClient, private cachingService: CachingService) { }
  getUsers(forceRefresh: any) {
    const url = 'https://randomuser.me/api?results=10';
    return this.getData(url, forceRefresh).pipe(
      map((res: any) => res.results)
    )
  }

  getChuckJoke(forceRefresh: boolean) {
    const url = 'https://api.chucknorris.io/jokes/random';
    return this.getData(url, forceRefresh)
  }

  private getData(url: any, forceRefresh: any): Observable<any> {
    if (forceRefresh) {
      return this.http.get(url)
    } else {
      const storedValue = from(this.cachingService.getCachedRequest(url));
      return storedValue.pipe(
        switchMap(result => {
          if (!result) {
            //make an api call
            return this.http.get(url);
          } else {
            return of(result);
          }
        })
      );
    }
  }

  private callAndCache(url: any): Observable<any> {
    return this.http.get(url).pipe(
      delay(2000),
      tap(res => {
        this.cachingService.cacheRequests(url, res)
      })
    )
  }
}
