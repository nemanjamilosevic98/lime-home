import { NgModule } from '@angular/core';
import { HotelInfoCardComponent } from './components/hotel-info-card/hotel-info-card.component';
import { BookingFormComponent } from './components/booking-form/booking-form.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';


@NgModule({
  imports: [
    ReactiveFormsModule,
    CommonModule,
    FormsModule
  ],
  declarations: [HotelInfoCardComponent, BookingFormComponent],
  exports: [HotelInfoCardComponent, BookingFormComponent],
  entryComponents: [BookingFormComponent]
})
export class SharedModule { }
