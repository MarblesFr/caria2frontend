import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {map, switchMap} from 'rxjs/operators';
import {DomSanitizer} from '@angular/platform-browser';
import {filterUndefined} from '../../util/FilterUndefined';
import {Ng2ImgMaxService} from 'ng2-img-max';
import {BehaviorSubject} from 'rxjs';
import {randomValues} from '../../util/caria.util';

@Injectable({
  providedIn: 'root'
})
export class CariaService {

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
    switchMap(values => {
      return this.http.get(this.baseUrl + 'get', {params: {values: JSON.stringify(values)}, responseType: 'blob'});
    }),
  );

  currentOutput$ = this.currentOutputBlob$.pipe(
    map(img => this.sanitizer.bypassSecurityTrustUrl(URL.createObjectURL(img)) as string)
  );

  baseUrl = 'http://localhost:8000/';

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
          return this.http.post<number[]>(this.baseUrl + 'canvas', formData);
        })
      ).subscribe(
        values => this.updateValues(values)
      );
  }
}
