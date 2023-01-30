import { Address } from "./address.model";

export interface Hotel  {
address: Address,
position: {lat: number, lng: number},
distance: number,
title: string,
}
