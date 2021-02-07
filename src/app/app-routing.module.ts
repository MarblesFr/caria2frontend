import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import {CanvasPageComponent} from './components/canvas/canvas-page/canvas-page.component';
import {SliderPageComponent} from './components/sliders/slider-page/slider-page.component';
import {FullscreenPageComponent} from './components/fullscreen-page/fullscreen-page.component';

export enum Page {
  SLIDER = 'slider',
  FULLSCREEN = 'fullscreen',
  CANVAS = 'canvas'
}

const routes: Routes = [
  {path: Page.CANVAS, component: CanvasPageComponent},
  {path: Page.SLIDER, component: SliderPageComponent},
  {path: Page.FULLSCREEN, component: FullscreenPageComponent},
  {path: '', redirectTo: Page.FULLSCREEN, pathMatch: 'full'},
  {path: '**', redirectTo: Page.FULLSCREEN, pathMatch: 'full'}
];
@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
