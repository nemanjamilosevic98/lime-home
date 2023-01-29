import { NgModule } from '@angular/core';
import { HomePageComponent } from './home-page/home-page.component';
import { CoreModule } from '../core/core.module';
import { FeaturesModule } from '../features/features.module';


@NgModule({
  imports: [
    CoreModule,
    FeaturesModule
  ],
  declarations: [HomePageComponent],
  exports: [HomePageComponent]
})
export class PagesModule { }
