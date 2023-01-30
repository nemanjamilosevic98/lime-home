import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Hotel } from '../../models/hotel.model';
import * as Constants from '../../../constants/general.constants';
import { Subject } from 'rxjs';
import { BookingForm } from '../../models/booking-form.model';
import { DataService } from 'src/app/services/data/data.service';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-booking-form',
  templateUrl: './booking-form.component.html',
  styleUrls: ['./booking-form.component.css']
})
export class BookingFormComponent implements OnInit {

  hotel: Hotel;
  bookingForm: FormGroup;
  destroy$ = new Subject<boolean>();

  constructor(private dataService: DataService, private activatedRoute: ActivatedRoute) { }

  ngOnInit() {
    this.activatedRoute.queryParams
      .subscribe((params: any) => {
        console.log(params); // { order: "popular" }

        this.hotel = this.dataService.hotels[params.index];
        console.log(this.hotel);
      }
      );
    this.initbookingForm();
  }

  initbookingForm() {
    this.bookingForm = new FormGroup({
      firstname: new FormControl('', {
        validators: [
          Validators.required,
          Validators.pattern(Constants.LETTERS_PATTERN),
        ],
      }),
      lastname: new FormControl('', {
        validators: [
          Validators.required,
          Validators.pattern(Constants.LETTERS_PATTERN),
        ],
      }),
      email: new FormControl('', {
        validators: [
          Validators.required,
          Validators.email
        ],
      }),
      psw: new FormControl('', {
        validators: [
          Validators.required
        ],
      })
    });
    console.log(this.bookingForm);
  }

  submitForm() {
    if (this.bookingForm.status === 'VALID') {
      const personalDetails: BookingForm = {
        firstname: this.bookingForm.value.firstname,
        lastname: this.bookingForm.value.lastname,
        email: this.bookingForm.value.email,
        psw: this.bookingForm.value.psw
      };
      alert('Your booking has been successfully completed!');
    }
  }

}
