// angular import
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { LayoutUserComponent } from './user.component';

import { ResetPasswordComponent } from './reset-password/reset-password.component';

const routes: Routes = [
	{
		path: '',
		component: LayoutUserComponent,
		
		children: [
			{ path: 'reset/pass/:token', component: ResetPasswordComponent }
		],
	},
];

@NgModule({
	imports: [RouterModule.forChild(routes)],
	exports: [RouterModule]
})
export class UserRoutingModule {}