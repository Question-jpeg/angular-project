import {
  Component,
  OnInit,
  ViewChild,
  OnDestroy,
  AfterViewInit,
} from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { Store } from '@ngrx/store';
import { Subscription } from 'rxjs';
import dialogOptions from 'shared/dialogOptions';
import { IAppState } from 'app/store/states';
import { Product } from 'shared/models/products';
import { ProductService } from 'shared/services/product.service';
import { ProductDetailsComponent } from '../product-details/product-details.component';
import { CategoryService } from 'shared/services/category.service';
import { categoryActions } from '../../../store/categories/categories';
import { FormControl } from '@angular/forms';

@Component({
  selector: 'app-admin-products',
  templateUrl: './admin-products.component.html',
  styleUrls: ['./admin-products.component.css'],
})
export class AdminProductsComponent
  implements AfterViewInit, OnDestroy, OnInit
{
  filterInput = new FormControl('');
  displayedColumns = ['title', 'price'];
  dataSource = new MatTableDataSource<Product>();
  subscriptions: Subscription[] = [];
  isFetching$;
  products$;
  categories$;
  selectedCategories$;
  selectedCategories: string[] = [];

  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;

  constructor(
    private productService: ProductService,
    private categoryService: CategoryService,
    public dialog: MatDialog,
    private ngStore: Store<IAppState>
  ) {
    this.initDataSourceFilterPredicate();
    this.categories$ = ngStore.select('categories', 'collection');
    this.selectedCategories$ = ngStore.select(
      'categories',
      'selectedCategoriesIds'
    );
    this.isFetching$ = ngStore.select('products', 'isFetching');
    this.products$ = ngStore.select('products', 'collection');
  }

  initDataSourceFilterPredicate() {
    this.dataSource.filterPredicate = (product, filterString) => {
      const inputValue = filterString.split('&&')[0];
      const selectedIds = filterString.split('&&')[1].split(' ');

      for (const filterValue of inputValue.split(' ')) {
        if (
          product.description?.toLowerCase().includes(filterValue) ||
          product.title.toLowerCase().includes(filterValue)
        ) {
          if (!selectedIds[0]) {
            return true;
          }
          if (selectedIds.includes(product.categoryId)) return true;
        }
      }

      return false;
    };
  }

  ngOnInit(): void {
    this.refresh();
  }

  onCategorySelect(id: string) {
    this.ngStore.dispatch(categoryActions.toggleCategorySelection({ id }));
  }

  refresh() {
    this.productService.refreshProducts();
    this.categoryService.refreshCategories();
  }

  ngAfterViewInit() {
    setTimeout(() => {
      this.dataSource.paginator = this.paginator;
      this.dataSource.sort = this.sort;
      this.subscriptions.push(
        this.products$.subscribe((products) => {
          this.dataSource.data = products;
        })
      );
      this.subscriptions.push(
        this.selectedCategories$.subscribe((selectedIds) => {
          this.selectedCategories = selectedIds;
          this.applyFilter();
        })
      );
    });
  }

  ngOnDestroy(): void {
    this.subscriptions.forEach((s) => s.unsubscribe());
  }

  deselectCategories() {
    this.ngStore.dispatch(
      categoryActions.selectCategories({ categoriesIds: [] })
    );
  }

  applyFilter() {
    const filterValue = this.filterInput.value;
    this.dataSource.filter = `${filterValue!
      .trim()
      .toLowerCase()}&&${this.selectedCategories.join(' ')}`;

    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }
  openDialog(product: Product | null) {
    this.dialog.open(ProductDetailsComponent, {
      data: product,
      ...dialogOptions,
    });
  }
}

/** Builds and returns a new User. */
