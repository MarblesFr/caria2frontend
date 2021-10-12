import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {concatMap, debounceTime, delay, map, retryWhen, switchMap} from 'rxjs/operators';
import {DomSanitizer} from '@angular/platform-browser';
import {filterUndefined} from '../../util/FilterUndefined';
import {Ng2ImgMaxService} from 'ng2-img-max';
import {BehaviorSubject, from, Observable} from 'rxjs';
import {randomValues} from '../../util/caria.util';
import {BASE_URL, IMAGE_HEIGHT, IMAGE_WIDTH} from './car.config';
import {Car} from '../../models';
import {MAX_LOAD_AMOUNT} from '../explore-store/explore.config';

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

  private _activeCar$ = new BehaviorSubject(0);
  activeCar$ = this._activeCar$.asObservable();

  currentOutputBlob$ = this.values$.pipe(
    filterUndefined(),
    debounceTime(50),
    switchMap(values => this.valuesToBlob(values).pipe(
      retryWhen(errors => errors.pipe(delay(5000)))
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

  setActive(index: number){
    this._activeCar$.next(index);
  }

  multipleValuesToCars(values: number[][]): Observable<Car[]> {
    return this.multipleValuesToUrls(values).pipe(
      map(urls => {
        const mapped = [];
        for (const item of urls) {
          mapped.push({
            values: values.shift(),
            url: item
          });
        }
        return mapped;
      })
    );
  }

  valuesToBlob(values: number[]) {
    return this.http.get(BASE_URL + '/get',
      {params: {values: JSON.stringify(values)}, responseType: 'blob'});
  }

  multipleValuesToUrls(values: number[][]) {
    const requestValues: number[][][] = [];
    for (let i = 0; i < values.length; i++) {
      const arrayIndex = Math.ceil((i + 1) / MAX_LOAD_AMOUNT) - 1;
      if (requestValues[arrayIndex] === undefined){
        requestValues[arrayIndex] = [];
      }
      requestValues[arrayIndex].push(values[i]);
    }
    return from(requestValues).pipe(
      concatMap(valueSet => this.http.get(BASE_URL + '/getMultiple',
        {params: {values: JSON.stringify(valueSet)}, responseType: 'json'})),
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
