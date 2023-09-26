import { Component } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-add-questions',
  templateUrl: './add-questions.component.html',
  styleUrls: ['./add-questions.component.scss'],
})
export class AddQuestionsComponent {
  addQuestionsForm!: FormGroup;
  addQuestionsFormArray: Array<string> = [];
  isEditDetails: boolean = false;
  editIndex: number | null = null;
  questionToEdit: any;

  constructor(private formbuilder: FormBuilder) {}

  typeList: string[] = [
    'text',
    'number',
    'textArea',
    'date',
    'dropdown',
    'checkbox',
    'radio',
  ];
  validationsList: string[] = ['required', 'minLength', 'maxLength'];

  get optionArray() {
    return this.addQuestionsForm.get('option') as FormArray;
  }

  ngOnInit() {
    this.addQuestionsForm = this.formbuilder.group({
      questions: ['', Validators.required],
      type: ['', Validators.required],
      option: this.formbuilder.array([]),
      validations: ['', Validators.required],
      inputField1: [''],
      inputField2: [''],
      minValue: [''],
      maxValue: [''],
    });
  }

  addQuestions() {
    // if (this.addQuestionsForm.valid) {
    //   this.addQuestionsFormArray.push(
    //     this.addQuestionsForm.get('questions')?.value
    //   );
    // }
    // this.saveToLocalstorage();
    // this.addQuestionsForm.reset();

    if (this.addQuestionsForm.valid) {
      if (this.isEditDetails) {
        this.addQuestionsFormArray[this.editIndex!] =
          this.addQuestionsForm.value;
        this.isEditDetails = true;
      } else {
        this.addQuestionsFormArray.push(this.addQuestionsForm.value);
      }
      this.saveToLocalstorage();
      this.addQuestionsForm.reset();
    }
  }

  formGroup() {
    return this.formbuilder.group({
      option1: [''],
      option2: [''],
    });
  }

  removeQuestions(index: number) {
    this.addQuestionsFormArray.splice(index, 1);
  }

  editQuestions(index: number) {
    this.questionToEdit = this.addQuestionsFormArray[index];
    this.addQuestionsForm.patchValue(this.questionToEdit);
  }

  saveToLocalstorage() {
    if (this.addQuestionsForm.invalid) return;
    const storedQueData =
      JSON.parse(localStorage.getItem('add-questions') as '[]') || [];
    storedQueData.push(this.addQuestionsForm.value);
    localStorage.setItem('add-questions', JSON.stringify(storedQueData));
  }

  addOption() {
    this.optionArray.push(this.formGroup());
  }
}
