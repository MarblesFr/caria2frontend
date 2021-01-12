import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppComponent } from './app.component';
import { NavbarComponent } from './navbar/navbar.component';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { CanvasPageComponent } from './canvas-page/canvas-page.component';
import { AppRoutingModule } from './app-routing.module';
import { SliderPageComponent } from './slider-page/slider-page.component';
import { FullscreenPageComponent } from './fullscreen-page/fullscreen-page.component';
import { AiOutputComponent } from './ai-output/ai-output.component';
import { HttpClientModule } from '@angular/common/http';

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
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
