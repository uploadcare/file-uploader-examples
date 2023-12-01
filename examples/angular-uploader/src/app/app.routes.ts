import { Routes } from '@angular/router';

import { FormViewComponent } from './views/form-view/form-view.component';
import { MinimalViewComponent } from './views/minimal-view/minimal-view.component';
import { RegularViewComponent } from './views/regular-view/regular-view.component';

export const routes: Routes = [
  {
    path: '',
    redirectTo: '/form',
    pathMatch: 'full',
  },
  {
    path: 'form',
    component: FormViewComponent,
  },
  {
    path: 'minimal',
    component: MinimalViewComponent,
  },
  {
    path: 'regular',
    component: RegularViewComponent,
  },
];
