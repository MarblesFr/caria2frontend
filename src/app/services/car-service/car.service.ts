import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {map, retry, switchMap, timeout} from 'rxjs/operators';
import {DomSanitizer} from '@angular/platform-browser';
import {filterUndefined} from '../../util/FilterUndefined';
import {Ng2ImgMaxService} from 'ng2-img-max';
import {BehaviorSubject, Observable} from 'rxjs';
import {randomValues} from '../../util/caria.util';
import {BASE_URL, IMAGE_HEIGHT, IMAGE_WIDTH} from './car.config';
import {Car} from '../../models';

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
    switchMap(values => this.valuesToBlob(values).pipe(retry())),
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

  updateValuesFromImage(image: Blob) {
    const imageFile = new File([image], 'image.png', {type: 'image/png', lastModified: Date.now()});
    this.ng2ImgMax.resizeImage(imageFile, IMAGE_WIDTH, IMAGE_HEIGHT)
      .pipe(
        switchMap(scaledImage => {
          const formData = new FormData();
          formData.append('image', scaledImage);
          return this.http.post<number[]>(BASE_URL + '/canvas', formData).pipe(timeout(5000));
        })
      ).subscribe(
        values => this.updateValues(values)
      );
  }

  multipleValuesToCars(values: number[][]): Observable<Car[]> {
    return this.multipleValuesToUrls(values).pipe(
      map(urls => values.map((value, index) => {
        return {
          values: value,
          url: urls[index]
        };
      }))
    );
  }

  valuesToBlob(values: number[]) {
    return this.http.get(BASE_URL + '/get',
      {params: {values: JSON.stringify(values)}, responseType: 'blob'}).pipe(timeout(5000));
  }

  multipleValuesToUrls(values: number[][]) {
    return this.http.get(BASE_URL + '/getMultiple',
      {params: {values: JSON.stringify(values)}, responseType: 'json'}).pipe(
        timeout(5000),
        map((value: string[]) =>
          value.map(imageValues => {
            return this.sanitizer.bypassSecurityTrustUrl('data:image/jpg;base64, ' + imageValues) as string;
          })
        )
    );
  }

  blobToUrl(img: Blob) {
    return this.sanitizer.bypassSecurityTrustUrl(URL.createObjectURL(img)) as string;
  }
}
