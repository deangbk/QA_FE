// angular import
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { AdminGuard } from './guards/admin.guard';

import { LayoutAdminComponent } from './admin.component';

const routes: Routes = [
  {
    path: '',
    children: [
    //   {
    //     path: 'signup',
    //     loadComponent: () => import('./auth-signup/auth-signup.component')
    //   },
    //   {
    //     path: 'signinv2',
    //     loadComponent: () => import('./auth-signin-v2/auth-signin-v2.component')
    //   },
    //   {
    //     path: 'signupv3',
    //     loadComponent: () => import('./auth-signup-v3/auth-signup-v3.component')
    //   },
    //   {
    //     path: 'signupv4',
    //     loadComponent: () => import('./auth-signup-v4/auth-signup-v4.component')
    //   },
    //   {
    //     path: 'signupv5',
    //     loadComponent: () => import('./auth-signup-v5/auth-signup-v5.component')
    //   },
    //   {
    //     path: 'signin',
    //     loadComponent: () => import('./auth-signin/auth-signin.component')
    //   },
    //   {
    //     path: 'signinv2',
    //     loadComponent: () => import('./auth-signin-v2/auth-signin-v2.component')
    //   },
    //   {
    //     path: 'signinv3',
    //     loadComponent: () => import('./auth-signin-v3/auth-signin-v3.component')
    //   },
    //   {
    //     path: 'signinv4',
    //     loadComponent: () => import('./auth-signin-v4/auth-signin-v4.component')
    //   },
    //   {
    //     path: 'signinv5',
    //     loadComponent: () => import('./auth-signin-v5/auth-signin-v5.component')
    //   },
    //   {
    //     path: 'reset-password',
    //     loadComponent: () => import('./auth-reset-password/auth-reset-password.component')
    //   },
    //   {
    //     path: 'reset-passwordv2',
    //     loadComponent: () => import('./auth-reset-password-v2/auth-reset-password-v2.component')
    //   },
    //   {
    //     path: 'reset-passwordv3',
    //     loadComponent: () => import('./auth-reset-password-v3/auth-reset-password-v3.component')
    //   },
    //   {
    //     path: 'reset-passwordv4',
    //     loadComponent: () => import('./auth-reset-password-v4/auth-reset-password-v4.component')
    //   },
    //   {
    //     path: 'reset-passwordv5',
    //     loadComponent: () => import('./auth-reset-password-v5/auth-reset-password-v5.component')
    //   },
    //   {
    //     path: 'change-password',
    //     loadComponent: () => import('./auth-change-password/auth-change-password.component')
    //   },
    //   {
    //     path: 'personal-information',
    //     loadComponent: () => import('./auth-personal-info/auth-personal-info.component')
    //   },
    //   {
    //     path: 'profile-settings',
    //     loadComponent: () => import('./auth-profile-settings/auth-profile-settings.component')
    //   },
    //   // {
    //   //   path: 'map-form',
    //   //   loadChildren: () => import('./auth-map-form/auth-map-form.module').then((m) => m.AuthMapFormModule)
    //   // },
    //   {
    //     path: 'subscribe',
    //     loadComponent: () => import('./subscribe/subscribe.component')
    //   }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class PublicRoutingModule {}