import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {map, switchMap} from 'rxjs/operators';
import {DomSanitizer} from '@angular/platform-browser';
import {select, Store} from '@ngrx/store';
import {CariaActions, CariaSelectors} from './index';
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

  currentCar$ = this.store$.pipe(
    select(CariaSelectors.getValues),
    filterUndefined(),
    switchMap(values => {
      return this.http.get(this.baseUrl + 'get', {params: {values: JSON.stringify(values)}, responseType: 'blob'});
    }),
    map(img => this.sanitizer.bypassSecurityTrustUrl(URL.createObjectURL(img)))
  );

  baseUrl = 'http://localhost:8000/';

  updateValuesFromImage(image: Blob) {
    const imageFile = new File([image], 'image.png', {type: 'image/png', lastModified: Date.now()});
    this.ng2ImgMax.resizeImage(imageFile, 192, 64)
      .pipe(
        switchMap(scaledImage => {
          const formData = new FormData();
          formData.append('image', scaledImage);
          return this.http.post<number[]>(this.baseUrl + 'canvas', formData);
        })
      ).subscribe(
        values => this.store$.dispatch(CariaActions.updateValues({values}))
      );
  }
}
