import { Component, EventEmitter, Input, Output } from '@angular/core';
import { Product } from 'shared/models/products';

@Component({
  selector: 'product-card',
  templateUrl: './product-card.component.html',
  styleUrls: ['./product-card.component.css']
})
export class ProductCardComponent {
  @Input('product') product: Product
  @Input('displayButton') displayButton: Boolean = true
  @Input('quantity') quantity: number | undefined
  @Output('onAdd') onAddEvent = new EventEmitter<string>()
  @Output('onIncrement') onIncrementEvent = new EventEmitter<{productId: string, count: number}>()

  addProduct(productId: string){
    this.onAddEvent.emit(productId)
  }

  setQuantity(productId: string, count: number) {
    this.onIncrementEvent.emit({productId, count})
  }
}
