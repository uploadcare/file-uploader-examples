import { Routes } from '@angular/router';

import { FormViewComponent } from './form-view/form-view.component';
import { MinimalViewComponent } from './minimal-view/minimal-view.component';
import { RegularViewComponent } from './regular-view/regular-view.component';

export const routes: Routes = [
  {
    path: 'form', component: FormViewComponent,
  },
  {
    path: 'minimal', component: MinimalViewComponent,
  },
  {
    path: 'regular', component: RegularViewComponent,
  },
  {
    path: '',
    redirectTo: '/form',
    pathMatch: 'full',
  }
];
