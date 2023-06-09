import {
  AfterViewInit,
  Component,
  OnInit,
  OnDestroy,
  ViewChild,
  Input,
} from '@angular/core';
import { OrderService } from 'shared/services/order.service';
import { MatTableDataSource } from '@angular/material/table';
import { Order } from 'shared/models/order';
import { Store } from '@ngrx/store';
import { IAppState } from 'app/store/states';
import { Subscription } from 'rxjs';
import { MatPaginator } from '@angular/material/paginator';
import { Timestamp } from 'firebase/firestore';

@Component({
  selector: 'app-orders',
  templateUrl: './orders.component.html',
  styleUrls: ['./orders.component.css'],
})
export class OrdersComponent implements AfterViewInit, OnInit, OnDestroy {
  displayedColumns = ['customer', 'date', 'totalPrice'];
  dataSource = new MatTableDataSource<Order>([]);
  subscriptions: Subscription[] = [];

  @Input('isAdminMode') isAdminMode: boolean;

  @ViewChild(MatPaginator) paginator: MatPaginator;

  constructor(
    private orderService: OrderService,
    private ngStore: Store<IAppState>
  ) {
    this.subscriptions.push(
      ngStore.select('orders', 'collection').subscribe((orders) => {
        this.dataSource.data = orders;
      })
    );
  }

  getDate(order: Order) {
    return new Date((order.date as Timestamp).seconds * 1000);
  }

  getTotalPrice(order: Order) {
    return order.items?.reduce(
      (previous, current) => previous + current.price * current.quantity,
      0
    );
  }

  ngOnInit(): void {
    if (this.isAdminMode) this.orderService.refreshAllOrders();
    else this.orderService.refreshOrders();
  }

  ngOnDestroy(): void {
    this.subscriptions.forEach((s) => s.unsubscribe());
  }

  ngAfterViewInit(): void {
    this.dataSource.paginator = this.paginator;
  }
}
