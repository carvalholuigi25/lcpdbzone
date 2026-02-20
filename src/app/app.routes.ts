import { Routes } from '@angular/router';
import { AdminAuthGuard, UserAuthGuard } from './guards';

export const routes: Routes = [
    {
        path: '',
        redirectTo: '/home',
        pathMatch: 'full',
    },
    {
        path: 'home',
        loadComponent: () => import('@pages/home/home').then(c => c.Home)
    },
    {
        path: 'admin',
        loadComponent: () => import('@pages/admin/admin').then(c => c.Admin),
        loadChildren: () => import('@modules/routes/auth/adminroutes.module').then(m => m.ADMIN_ROUTES),
        canActivate: [AdminAuthGuard]
    },
    {
        path: 'user',
        loadComponent: () => import('@pages/user/user').then(c => c.User),
        loadChildren: () => import('@modules/routes/auth/userroutes.module').then(m => m.USER_ROUTES),
        canActivate: [UserAuthGuard]
    },
    {
        path: 'auth',
        loadChildren: () => import('@modules/auth.module').then(m => m.AuthModule)
    },
    {
        path: 'data',
        loadChildren: () => import('@modules/routes/data/datalazyroutes.module').then(m => m.DataLazyRoutesModule)
    },
    {
        path: 'errors',
        loadChildren: () => import('@modules/routes/errors/errorroutes.module').then(m => m.ErrorRoutesModule)
    },
    {
        path: '**',
        redirectTo: '/home',
        pathMatch: 'full'
    }
];
