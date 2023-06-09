import { NgModule } from '@angular/core';
import { HomeComponent } from './components/home/home.component';
import { LoginComponent } from './components/login/login.component';
import { NavComponent } from './components/nav/nav.component';
import { TestComponent } from './components/test/test.component';
import { SharedModule } from 'shared/shared.module';

@NgModule({
  declarations: [HomeComponent, LoginComponent, NavComponent, TestComponent],
  imports: [SharedModule],
  exports: [NavComponent],
})
export class CoreModule {}
