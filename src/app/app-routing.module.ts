import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import {CanvasPageComponent} from './components/canvas/canvas-page/canvas-page.component';
import {SliderPageComponent} from './components/sliders/slider-page/slider-page.component';
import {FullscreenPageComponent} from './components/fullscreen-page/fullscreen-page.component';

export enum Page {
  EXPLORE = 'explore',
  SLIDER = 'slider',
  CANVAS = 'canvas'
}

const routes: Routes = [
  {path: Page.CANVAS, component: CanvasPageComponent},
  {path: Page.SLIDER, component: SliderPageComponent},
  {path: Page.EXPLORE, component: FullscreenPageComponent},
  {path: '', redirectTo: Page.EXPLORE, pathMatch: 'full'},
  {path: '**', redirectTo: Page.EXPLORE, pathMatch: 'full'}
];
@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
