import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {concatMap, delay, map, reduce, retry, switchMap} from 'rxjs/operators';
import {DomSanitizer} from '@angular/platform-browser';
import {filterUndefined} from '../../util/FilterUndefined';
import {Ng2ImgMaxService} from 'ng2-img-max';
import {BehaviorSubject, from, Observable} from 'rxjs';
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
    switchMap(values => this.valuesToBlob(values).pipe(
      retry(),
      delay(5000)
      )
    ),
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
          return this.http.post<number[]>(BASE_URL + '/canvas', formData);
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
      {params: {values: JSON.stringify(values)}, responseType: 'blob'});
  }

  multipleValuesToUrls(values: number[][]) {
    const requestValues: number[][][] = [];
    for (let i = 0; i < values.length; i++) {
      const arrayIndex = Math.ceil((i + 1) / 3) - 1;
      if (requestValues[arrayIndex] === undefined){
        requestValues[arrayIndex] = [];
      }
      requestValues[arrayIndex].push(values[i]);
    }
    return from(requestValues).pipe(
      concatMap(valueSet => this.http.get(BASE_URL + '/getMultiple',
        {params: {values: JSON.stringify(valueSet)}, responseType: 'json'})),
      reduce((valueA: string[], valueB: string[]) => valueA.concat(valueB)),
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
