import { NgModule } from '@angular/core';
import { HereMapComponent } from './components/here-map/here-map.component';
import { SharedModule } from '../shared/shared.module';
import { CommonModule } from '@angular/common';


@NgModule({
  imports: [
    SharedModule,
    CommonModule
  ],
  declarations: [HereMapComponent],
  exports: [HereMapComponent]
})
export class FeaturesModule { }
