import { Component, OnInit, Output, EventEmitter, Input } from '@angular/core';
import { MealDTO } from 'src/app/models/mealDTO';
import { Order } from 'src/app/models/order';

@Component({
  selector: 'app-modal-dialog',
  templateUrl: './modal-dialog.component.html'
})
export class ModalDialogComponent implements OnInit {
  @Output() confirmed = new EventEmitter<boolean>();
  @Input() meals: Array<MealDTO>;
  @Input() order: Order;

  constructor() { }

  ngOnInit() { }

  confirm(isConfirmed: boolean) {
    this.confirmed.emit(isConfirmed);
  }
}