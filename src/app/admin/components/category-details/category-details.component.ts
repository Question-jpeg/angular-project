import { Component, Inject } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialog } from '@angular/material/dialog';
import { Category } from 'shared/models/categories';
import { CategoryService } from 'shared/services/category.service';

@Component({
  selector: 'app-category-details',
  templateUrl: './category-details.component.html',
  styleUrls: ['./category-details.component.css'],
})
export class CategoryDetailsComponent {
  form = new FormGroup({
    title: new FormControl('', Validators.required),
  });

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: Category | undefined,
    private categoryService: CategoryService,
    private dialog: MatDialog
  ) {
    if (data) {
      this.form.setValue({
        title: data.title,
      });
    }
  }

  submit() {
    this.form.controls.title.setValue(this.form.controls.title.value!.trim())
    if (this.data)
      this.categoryService.updateCategory(
        this.data.id,
        this.form.value as Category
      );
    else this.categoryService.addCategory(this.form.value as Category);
  }

  openConfirm(){
    this.dialog.open(ConfirmDeleteCategoryDialog, { data: this.data })
  }
}

@Component({
  selector: 'app-confirm-delete-category-dialog',
  template: `
    <h1 mat-dialog-title>Are you sure you want to delete category?</h1>
    <div mat-dialog-content>
      <h1>{{ data.title }}</h1>
      <mat-dialog-actions style="display: flex;" [align]="'start'">
        <button mat-button mat-dialog-close cdkFocusInitial>Cancel</button>
        <button mat-raised-button mat-dialog-close (click)="del()" color="warn">Delete</button>
      </mat-dialog-actions>
    </div>
  `
})
export class ConfirmDeleteCategoryDialog {
  constructor(@Inject(MAT_DIALOG_DATA) public data: Category, private categoryService: CategoryService, private dialog: MatDialog){}

  del(){
    this.categoryService.deleteCategory(this.data.id)
    this.dialog.openDialogs.slice(1).forEach((dialog) => dialog.close())
  }
}