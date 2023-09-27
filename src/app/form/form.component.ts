import { Component } from '@angular/core';

@Component({
  selector: 'app-form',
  templateUrl: './form.component.html',
  styleUrls: ['./form.component.scss'],
})
export class FormComponent {
  questionsData: any;
  formData: any;

  ngOnInit() {
    this.showQuestionsData();
    this.showFormData();
  }

  showQuestionsData() {
    this.questionsData = JSON.parse(
      localStorage.getItem('add-questions') as any
    );
    return this.questionsData;
  }

  showFormData() {
    this.formData = JSON.parse(localStorage.getItem('add-form') as any);
    return this.formData;
  }
}
