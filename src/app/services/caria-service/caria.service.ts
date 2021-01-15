import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { map } from 'rxjs/operators';
import { Observable } from 'rxjs';
import { DomSanitizer, SafeUrl } from '@angular/platform-browser';

@Injectable({
  providedIn: 'root'
})
export class CariaService {

  constructor(
    private http: HttpClient,
    private sanitizer: DomSanitizer
  ) { }

  baseUrl = 'http://localhost:8000/';

  getCar(values?: number[]): Observable<SafeUrl> {
    let params = new HttpParams();
    if (values !== null && values !== undefined){
      params = params.set('values', JSON.stringify(values));
    }

    return this.http.get(this.baseUrl + 'get', { params, responseType: 'blob' })
      .pipe(
        map(img => this.sanitizer.bypassSecurityTrustUrl(URL.createObjectURL(img)))
      );
  }
}
