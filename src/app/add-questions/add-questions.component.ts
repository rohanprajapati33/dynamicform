import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-add-questions',
  templateUrl: './add-questions.component.html',
  styleUrls: ['./add-questions.component.scss'],
})
export class AddQuestionsComponent {
  addQuestionsForm!: FormGroup;
  addQuestionsFormArray: Array<string> = [];
  constructor(private formbuilder: FormBuilder) {}
  typeList: any = [
    { value: 'text' },
    { value: 'number' },
    { value: 'textArea' },
    { value: 'date' },
    { value: 'dropdown' },
    { value: 'radio' },
  ];
  validationsList: any = [
    { value: 'required' },
    { value: 'minLength' },
    { value: 'maxLength' },
  ];

  ngOnInit() {
    this.addQuestionsForm = this.formbuilder.group({
      questions: ['', Validators.required],
      type: ['', Validators.required],
      validations: ['', Validators.required],
    });
  }

  addQuestions() {
    if (this.addQuestionsForm.valid) {
      this.addQuestionsFormArray.push(
        this.addQuestionsForm.get('questions')?.value
      );
    }
    this.addQuestionsForm.reset();
  }
}
