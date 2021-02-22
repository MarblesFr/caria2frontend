import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {map, switchMap} from 'rxjs/operators';
import {DomSanitizer} from '@angular/platform-browser';
import {filterUndefined} from '../../util/FilterUndefined';
import {Ng2ImgMaxService} from 'ng2-img-max';
import {BehaviorSubject} from 'rxjs';
import {randomValues} from '../../util/caria.util';
import {BASE_URL} from './car.config';

@Injectable({
  providedIn: 'root'
})
export class CarService {

  constructor(
    private http: HttpClient,
    private sanitizer: DomSanitizer,
    private ng2ImgMax: Ng2ImgMaxService
  ) {
  }

  private _values$ = new BehaviorSubject(randomValues());
  values$ = this._values$.asObservable();

  currentOutputBlob$ = this.values$.pipe(
    filterUndefined(),
    switchMap(values => this.valuesToBlob(values)),
  );

  currentOutput$ = this.currentOutputBlob$.pipe(
    map(img => this.blobToUrl(img))
  );

  updateValues(values: number[]) {
    this._values$.next(values);
  }

  updateValue(index: number, value: number) {
    const values = this._values$.value;
    values[index] = value;
    this.updateValues(values);
  }

  randomizeValues() {
    this.updateValues(randomValues());
  }

  updateValuesFromImage(image: Blob) {
    const imageFile = new File([image], 'image.png', {type: 'image/png', lastModified: Date.now()});
    this.ng2ImgMax.resizeImage(imageFile, 192, 64)
      .pipe(
        switchMap(scaledImage => {
          const formData = new FormData();
          formData.append('image', scaledImage);
          return this.http.post<number[]>(BASE_URL + 'canvas', formData);
        })
      ).subscribe(
        values => this.updateValues(values)
      );
  }

  valuesToUrl(values: number[]) {
    return this.valuesToBlob(values).pipe(
      map(
        value => this.blobToUrl(value)
      )
    );
  }

  valuesToBlob(values: number[]) {
    return this.http.get(BASE_URL + 'get', {params: {values: JSON.stringify(values)}, responseType: 'blob'});
  }

  blobToUrl(img: Blob) {
    return this.sanitizer.bypassSecurityTrustUrl(URL.createObjectURL(img)) as string;
  }
}
