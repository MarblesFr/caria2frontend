import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppComponent } from './app.component';
import { NavbarComponent } from './components/navbar/navbar.component';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { CanvasPageComponent } from './components/canvas-page/canvas-page.component';
import { CanvasComponent } from './components/canvas/canvas.component';
import { CanvasToolsComponent } from './components/canvas-tools/canvas-tools.component';
import { AppRoutingModule } from './app-routing.module';
import { SliderPageComponent } from './components/sliders/slider-page/slider-page.component';
import { FullscreenPageComponent } from './components/fullscreen-page/fullscreen-page.component';
import { AiOutputComponent } from './components/ai-output/ai-output.component';
import { HttpClientModule } from '@angular/common/http';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import {MatSliderModule} from '@angular/material/slider';
import { StoreModule } from '@ngrx/store';
import { ColorPickerModule } from 'ngx-color-picker';
import {RootStoreModule} from './services/root-store.module';
import {SliderWindowComponent} from './components/sliders/slider-window/slider-window.component';
import {MatButtonModule} from '@angular/material/button';
import {VarDirective} from './util/ng-var.directive';
import {MatIconModule} from '@angular/material/icon';

@NgModule({
  declarations: [
    AppComponent,
    NavbarComponent,
    CanvasPageComponent,
    SliderPageComponent,
    FullscreenPageComponent,
    AiOutputComponent,
    CanvasToolsComponent,
    CanvasComponent,
    AiOutputComponent,
    SliderWindowComponent,
    VarDirective,
  ],
  imports: [
    BrowserModule,
    NgbModule,
    AppRoutingModule,
    HttpClientModule,
    BrowserAnimationsModule,
    MatSliderModule,
    StoreModule.forRoot({}, {}),
    ColorPickerModule,
    MatButtonModule,
    MatIconModule,
    RootStoreModule.forRoot(),
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
