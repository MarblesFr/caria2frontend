import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import {CanvasPageComponent} from './components/canvas-page/canvas-page.component';
import {SliderPageComponent} from './components/sliders/slider-page/slider-page.component';
import {FullscreenPageComponent} from './components/fullscreen-page/fullscreen-page.component';

const routes: Routes = [
  {path: 'canvas', component: CanvasPageComponent},
  {path: 'slider', component: SliderPageComponent},
  {path: 'fullscreen', component: FullscreenPageComponent},
  {path: '', redirectTo: '/fullscreen', pathMatch: 'full'},
  {path: '**', redirectTo: '/fullscreen', pathMatch: 'full'}
];
@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
