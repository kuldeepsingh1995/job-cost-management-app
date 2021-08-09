import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { LoginComponent } from './login/login.component';
import { AuthGuard } from './shared/auth.guard';
import { SignupComponent } from './signup/signup.component';
import {UnverifiedPageComponent } from './unverified-page/unverified-page.component';

const routes: Routes = [
  {path: '', redirectTo: '/login', pathMatch : 'full'},
  {
    path: 'login', component: LoginComponent
  },
  {
    path: 'signup', component: SignupComponent
  },
  {
    path: 'unverified-page', component: UnverifiedPageComponent
  },
  {
    path: 'layout',  loadChildren: () => import('./layout/layout.module').then(mod => mod.LayoutModule),  canActivate: [AuthGuard],
    //path: 'layout',  loadChildren: () => import('./layout/layout.module').then(mod => mod.LayoutModule),
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
