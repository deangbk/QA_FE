// angular import
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { LayoutUserComponent } from './user.component';

const routes: Routes = [
	{
		path: '',
		component: LayoutUserComponent,
	},
];

@NgModule({
	imports: [RouterModule.forChild(routes)],
	exports: [RouterModule]
})
export class UserRoutingModule {}