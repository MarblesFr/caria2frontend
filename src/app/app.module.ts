import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppComponent } from './app.component';
import { NavbarComponent } from './components/navbar/navbar.component';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { CanvasPageComponent } from './components/canvas-page/canvas-page.component';
import { AppRoutingModule } from './app-routing.module';
import { SliderPageComponent } from './components/sliders/slider-page/slider-page.component';
import { FullscreenPageComponent } from './components/fullscreen-page/fullscreen-page.component';
import { AiOutputComponent } from './components/ai-output/ai-output.component';
import { HttpClientModule } from '@angular/common/http';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import {MatSliderModule} from '@angular/material/slider';
import { StoreModule } from '@ngrx/store';

@NgModule({
  declarations: [
    AppComponent,
    NavbarComponent,
    CanvasPageComponent,
    SliderPageComponent,
    FullscreenPageComponent,
    AiOutputComponent
  ],
  imports: [
    BrowserModule,
    NgbModule,
    AppRoutingModule,
    HttpClientModule,
    BrowserAnimationsModule,
    MatSliderModule,
    StoreModule.forRoot({}, {}),
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
