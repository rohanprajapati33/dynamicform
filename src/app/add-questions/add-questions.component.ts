import { Component } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-add-questions',
  templateUrl: './add-questions.component.html',
  styleUrls: ['./add-questions.component.scss'],
})
export class AddQuestionsComponent {
  addQuestionsForm!: FormGroup;
  addQuestionsFormArray: any[] = [];
  isEditDetails: boolean = false;
  editIndex!: number;
  questionToEdit!: any;
  formName: string = '';

  constructor(
    private formbuilder: FormBuilder,
    private route: ActivatedRoute
  ) {}

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

  get validationsControl() {
    return this.addQuestionsForm.get('validations') as FormArray;
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
    this.showQuestions();
    // this.formName = this.route.snapshot.paramMap.get('formName') || '';
  }

  addQuestions() {
    if (this.addQuestionsForm.valid) {
      if (this.isEditDetails) {
        this.addQuestionsFormArray[this.editIndex] =
          this.addQuestionsForm.value;
      } else {
        this.addQuestionsFormArray.push(this.addQuestionsForm.value);
      }
      this.saveToLocalstorage();
      this.addQuestionsForm.reset();
    }
    console.log(this.addQuestionsFormArray);
  }

  optionFormGroup() {
    return this.formbuilder.group({
      option1: [''],
      option2: [''],
    });
  }

  removeQuestions(index: number) {
    this.addQuestionsFormArray.splice(index, 1);
    localStorage.setItem(
      'add-questions',
      JSON.stringify(this.addQuestionsFormArray)
    );
  }

  editQuestions(index: number) {
    this.isEditDetails = true;
    this.editIndex = index;
    this.questionToEdit = this.addQuestionsFormArray[index];
    this.addQuestionsForm.patchValue(this.questionToEdit);
  }

  saveToLocalstorage() {
    if (this.addQuestionsForm.invalid) return;
    const storedQueData =
      JSON.parse(localStorage.getItem('add-questions') as '[]') || [];
    if (this.isEditDetails) {
      storedQueData[this.editIndex] = this.addQuestionsForm.value;
      this.isEditDetails = false;
    } else {
      storedQueData.push(this.addQuestionsForm.value);
    }
    localStorage.setItem('add-questions', JSON.stringify(storedQueData));
  }

  showQuestions() {
    const storedQueData = JSON.parse(
      localStorage.getItem('add-questions') || '[]'
    );
    this.addQuestionsFormArray = storedQueData;
  }

  addOption() {
    this.optionArray.push(this.optionFormGroup());
  }
}
