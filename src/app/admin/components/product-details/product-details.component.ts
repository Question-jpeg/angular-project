import { Component, Inject, OnInit, OnDestroy } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialog, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { ProductService } from 'shared/services/product.service';
import { Product } from 'shared/models/products';
import { CategoryService } from 'shared/services/category.service';
import { IAppState } from 'app/store/states';
import { Store } from '@ngrx/store';
import { CategoryDetailsComponent } from '../category-details/category-details.component';
import dialogOptions from 'shared/dialogOptions';
import { Category } from 'shared/models/categories';

@Component({
  selector: 'app-product-details',
  templateUrl: './product-details.component.html',
  styleUrls: ['./product-details.component.css'],
})
export class ProductDetailsComponent {
  form = new FormGroup({
    title: new FormControl('', Validators.required),
    price: new FormControl<number>(0, Validators.required),
    categoryId: new FormControl('', Validators.required),
    imageUrl: new FormControl('', Validators.required),
    description: new FormControl(),
  });

  categories$;
  categoriesFetching$;

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: Product | null,
    public dialog: MatDialog,
    private productService: ProductService,
    private categoryService: CategoryService,
    private ngStore: Store<IAppState>
  ) {
    this.categories$ = ngStore.select('categories', 'collection');
    this.categoriesFetching$ = ngStore.select('categories', 'isFetching');
    if (data)
      this.form.setValue({
        title: data.title,
        price: data.price,
        categoryId: data.categoryId,
        imageUrl: data.imageUrl,
        description: data.description ?? null,
      });
  }

  getProduct(): Product {
    return this.form.value as Product
  }

  submit() {
    if (this.data) {
      this.productService.updateProduct(
        this.data.id!,
        this.form.value as Product
      );
    } else {
      this.productService.addProduct(this.form.value as Product);
    }
  }

  addCategory(event: Event) {
    event.stopPropagation();
    this.dialog.open(CategoryDetailsComponent);
  }

  editCategory(category: Category){
    this.dialog.open(CategoryDetailsComponent, { data: category })
  }

  openConfirm() {
    this.dialog.open(ConfirmDeleteProductDialog, { data: this.data });
  }
}

@Component({
  selector: 'app-confirm-delete-product-dialog',
  template: `
    <h1 mat-dialog-title>Are you sure you want to delete product?</h1>
    <div mat-dialog-content>
      <h1>{{ data.title }}</h1>
      <mat-dialog-actions style="display: flex;" [align]="'start'">
        <button mat-button mat-dialog-close cdkFocusInitial>Cancel</button>
        <button mat-raised-button (click)="del()" color="warn">Delete</button>
      </mat-dialog-actions>
    </div>
  `,
})
export class ConfirmDeleteProductDialog {
  constructor(
    @Inject(MAT_DIALOG_DATA) public data: Product,
    public productService: ProductService,
    public dialog: MatDialog
  ) {}

  del() {
    this.productService.deleteProduct(this.data.id!);
    this.dialog.closeAll();
  }
}
