import { Component, Input, OnInit } from '@angular/core';
import { Hotel } from '../../models/hotel.model';

@Component({
  selector: 'app-hotel-info-card',
  templateUrl: './hotel-info-card.component.html',
  styleUrls: ['./hotel-info-card.component.scss']
})
export class HotelInfoCardComponent implements OnInit {

  @Input('hotelInfo') hotelInfo: Hotel | null = null;
  price: number;

  constructor() {
    this.price = this.getPrice();
   }

  ngOnInit() {
  }

  getKmDistance(distance?: number) {
    if (distance) {
      return (distance / 1000).toFixed(2);
    }
    return null;
  }

  getPrice() {
    return Number((Math.random() * 100 + 50).toFixed(0));
  }

}
