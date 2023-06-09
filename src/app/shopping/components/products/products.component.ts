import { Component, OnInit, OnDestroy } from '@angular/core';
import { Store } from '@ngrx/store';
import { IAppState } from 'app/store/states';
import { CategoryService } from 'shared/services/category.service';
import { ProductService } from 'shared/services/product.service';
import { ActivatedRoute } from '@angular/router';
import { Subscription, switchMap } from 'rxjs';
import { CartProduct, Product } from 'shared/models/products';
import { CartService } from 'shared/services/cart.service';
import { cartActions } from '../../../store/cart/cart';

@Component({
  selector: 'app-products',
  templateUrl: './products.component.html',
  styleUrls: ['./products.component.css'],
})
export class ProductsComponent implements OnInit, OnDestroy {
  categories$;
  products$;
  products: Product[] = [];
  cartProducts: CartProduct[] = [];
  filtered: Product[] = [];
  subscriptions: Subscription[] = [];
  selectedCategoryId: string | null;

  productsTimeouts: any;

  constructor(
    private categoryService: CategoryService,
    private productService: ProductService,
    private ngStore: Store<IAppState>,
    private route: ActivatedRoute,
    private cartService: CartService
  ) {
    this.categories$ = ngStore.select('categories', 'collection');
    this.products$ = ngStore.select('products', 'collection');
    this.subscriptions.push(
      ngStore
        .select('cartProducts', 'collection')
        .subscribe((cps) => (this.cartProducts = cps))
    );
    this.subscriptions.push(
      this.products$
        .pipe(
          switchMap((products) => {
            this.products = products;
            return route.queryParamMap;
          })
        )
        .subscribe((params) => {
          this.selectedCategoryId = params.get('categoryId');
          this.setCategory();
        })
    );
  }

  setCategory() {
    this.filtered = this.products.filter((p) =>
      this.selectedCategoryId ? p.categoryId === this.selectedCategoryId : true
    );
  }

  addToCart(productId: string) {
    const product: CartProduct = {
      ...(this.products.find((p) => p.id === productId) as Product),
      quantity: 1,
    };
    this.ngStore.dispatch(cartActions.addProduct({ product }));
    this.cartService.addProduct(product);
  }

  incrementQuantity(data: { productId: string; count: number }) {
    this.ngStore.dispatch(
      cartActions.setQuantity({
        productId: data.productId,
        count: data.count,
      })
    );
    this.cartService.incrementOnServer(data.productId, data.count)
  }

  getQuantity(productId: string) {
    return this.cartProducts.find((cp) => cp.id === productId)?.quantity;
  }

  ngOnInit(): void {
    this.categoryService.refreshCategories();
    this.productService.refreshProducts();
  }

  ngOnDestroy(): void {
    this.subscriptions.forEach((s) => s.unsubscribe());
  }
}
