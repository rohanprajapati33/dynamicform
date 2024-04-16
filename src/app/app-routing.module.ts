import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { FormComponent } from './form/form.component';
import { AddFormComponent } from './add-form/add-form.component';
import { AddQuestionsComponent } from './add-questions/add-questions.component';
import { PreviewComponent } from './preview/preview.component';

const routes: Routes = [
  {
    path: '',
    component: FormComponent,
  },
  {
    path: 'add-form',
    component: AddFormComponent,
  },

  {
    path: 'add-que/:formName',
    component: AddQuestionsComponent,
  },

  {
    path: 'preview/:i',
    component: PreviewComponent,
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
