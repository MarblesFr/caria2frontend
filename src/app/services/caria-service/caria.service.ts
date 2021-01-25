import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {map, switchMap} from 'rxjs/operators';
import {Observable} from 'rxjs';
import {DomSanitizer, SafeUrl} from '@angular/platform-browser';
import {select, Store} from '@ngrx/store';
import {CariaSelectors} from './index';
import {filterUndefined} from '../../util/FilterUndefined';
import {Ng2ImgMaxService} from 'ng2-img-max';

@Injectable({
  providedIn: 'root'
})
export class CariaService {

  constructor(
    private http: HttpClient,
    private sanitizer: DomSanitizer,
    private readonly store$: Store,
    private ng2ImgMax: Ng2ImgMaxService
  ) {
  }

  baseUrl = 'http://localhost:8000/';

  getCar(): Observable<SafeUrl> {
    return this.store$.pipe(
      select(CariaSelectors.getValues),
      filterUndefined(),
      switchMap(values =>
        this.http.get(this.baseUrl + 'get', {params: {values: JSON.stringify(values)}, responseType: 'blob'})),
      map(img => this.sanitizer.bypassSecurityTrustUrl(URL.createObjectURL(img)))
    );
  }

  getValuesFromImage(image: Blob): Observable<any> {
    const imageFile = new File([image], 'image.png', {type: 'image/png', lastModified: Date.now()});
    return this.ng2ImgMax.resizeImage(imageFile, 192, 64)
      .pipe(
        switchMap(scaledImage => {
          const formData = new FormData();
          formData.append('image', scaledImage);
          return this.http.post(this.baseUrl + 'canvas', formData);
        })
      );
  }
}
