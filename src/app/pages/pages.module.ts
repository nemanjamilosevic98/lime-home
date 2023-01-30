import { NgModule } from '@angular/core';
import { HomePageComponent } from './home-page/home-page.component';
import { CoreModule } from '../core/core.module';
import { FeaturesModule } from '../features/features.module';
import { BookingPageComponent } from './booking-page/booking-page.component';
import { SharedModule } from '../shared/shared.module';


@NgModule({
  imports: [
    CoreModule,
    FeaturesModule,
    SharedModule
  ],
  declarations: [HomePageComponent, BookingPageComponent],
  exports: [HomePageComponent, BookingPageComponent]
})
export class PagesModule { }
