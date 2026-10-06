import { Routes } from '@angular/router';
import { authGuard } from './core/auth/auth.guard';

export const routes: Routes = [
	{
		path: '',
		pathMatch: 'full',
		redirectTo: 'light',
	},
	{
		path: 'login',
		loadComponent: () =>
			import('./features/auth/presentation/login.page').then(
				(m) => m.LoginPageComponent
			),
	},
	{
		path: 'register',
		loadComponent: () =>
			import('./features/auth/presentation/register.page').then(
				(m) => m.RegisterPageComponent
			),
	},
	{
		path: 'light',
		canActivate: [authGuard],
		loadComponent: () =>
			import('./features/light/presentation/light.page').then(
				(m) => m.LightPageComponent
			),
	},
	{
		path: '**',
		redirectTo: 'light',
	},
];
