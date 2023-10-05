import { Component } from '@angular/core';
import {
  AbstractControl,
  FormArray,
  FormBuilder,
  FormGroup,
  Validators,
} from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { QuestionData } from '../model/questiondata';

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
  questionToEdit!: QuestionData[];
  isEditable = false;
  formName: string = '';
  isOption = false;

  constructor(
    private formbuilder: FormBuilder,
    private route: ActivatedRoute
  ) {}

  typeList: string[] = [
    'text',
    'number',
    'textarea',
    'date',
    'dropdown',
    'checkbox',
    'radio',
  ];
  validationsList: string[] = ['required'];

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
      checkBox1: [''],
      checkBox2: [''],
      radioBox1: [''],
      radioBox2: [''],
      minValue: [''],
      maxValue: [''],
    });

    this.addQuestionsForm.get('type')?.valueChanges.subscribe((value) => {
      const checkboxInput1 = this.addQuestionsForm.get('checkBox1');
      const checkboxInput2 = this.addQuestionsForm.get('checkBox2');
      const radioInput1 = this.addQuestionsForm.get('radioBox1');
      const radioInput2 = this.addQuestionsForm.get('radioBox2');
      const minValue = this.addQuestionsForm.get('minValue');
      const maxValue = this.addQuestionsForm.get('maxValue');

      if (value === 'number') {
        this.validationsList = ['required', 'minLength', 'maxLength'];
      } else {
        this.validationsList = ['required'];
      }

      if (value === 'checkbox') {
        checkboxInput1?.setValidators([Validators.required]);
        checkboxInput2?.setValidators([Validators.required]);
      } else {
        checkboxInput1?.clearValidators();
        checkboxInput2?.clearValidators();
      }
      if (value === 'radio') {
        radioInput1?.setValidators([Validators.required]);
        radioInput2?.setValidators([Validators.required]);
      } else {
        radioInput1?.clearValidators();
        radioInput2?.clearValidators();
      }
      if (value === 'dropdown') {
        this.optionArray.controls.forEach((control: AbstractControl) => {
          control.get('option')?.setValidators([Validators.required]);
          control.get('option')?.updateValueAndValidity();
        });
      } else {
        this.optionArray.controls.forEach((control: AbstractControl) => {
          control.get('option')?.clearValidators();
          control.get('option')?.updateValueAndValidity();
        });
      }

      if (value === 'number') {
        minValue?.setValidators([Validators.required]);
        maxValue?.setValidators([Validators.required]);
      } else {
        minValue?.clearValidators();
        maxValue?.clearValidators();
      }
    });

    this.formName = this.route.snapshot.paramMap.get('formName') || '';
    this.showQuestions();
  }

  addQuestions() {
    if (this.addQuestionsForm.valid) {
      if (this.isEditDetails) {
        this.addQuestionsFormArray[this.editIndex] =
          this.addQuestionsForm.value;
      } else {
        if (
          this.addQuestionsForm.get('type')?.value === 'dropdown' &&
          this.optionArray.length === 0
        ) {
          return;
        }
        this.addQuestionsFormArray.push(this.addQuestionsForm.value);
      }
      this.saveToLocalstorage();
      this.addQuestionsForm.reset();
      this.isEditable = true;
    }
    this.addQuestionsForm.markAllAsTouched();
    this.optionArray.markAllAsTouched();
  }

  optionFormGroup() {
    return this.formbuilder.group({
      option: [''],
    });
  }

  editQuestions(index: number) {
    this.isEditDetails = true;
    this.isEditable = false;
    this.editIndex = index;
    this.questionToEdit = this.addQuestionsFormArray[index];
    this.addQuestionsForm.patchValue(this.questionToEdit);
  }

  saveToLocalstorage() {
    if (this.addQuestionsForm.invalid) return;
    const formName = this.formName;
    let storedQueData =
      JSON.parse(localStorage.getItem('add-questions') as any) || [];

    const formIndex = storedQueData.findIndex(
      (data: QuestionData) => data.formName === formName
    );
    if (formIndex !== -1) {
      storedQueData[formIndex].questions = this.addQuestionsFormArray;
      this.isEditDetails = false;
    } else {
      storedQueData.push({
        formName: formName,
        questions: this.addQuestionsFormArray,
      });
    }
    localStorage.setItem('add-questions', JSON.stringify(storedQueData));
    console.log(storedQueData);
  }

  removeQuestion(index: number) {
    this.addQuestionsFormArray.splice(index, 1);
    this.saveToLocalstorage();
    const storedQueData = JSON.parse(
      localStorage.getItem('add-questions') || '[]'
    );
    const formIndex = storedQueData.findIndex(
      (data: QuestionData) => data.formName === this.formName
    );

    if (formIndex !== -1) {
      storedQueData[formIndex].questions = this.addQuestionsFormArray;
      localStorage.setItem('add-questions', JSON.stringify(storedQueData));
    }
  }

  showQuestions() {
    const storedData = localStorage.getItem('add-questions');
    if (storedData) {
      const storeData = JSON.parse(storedData);
      const formData = storeData.find(
        (data: QuestionData) => data.formName === this.formName
      );
      if (formData) {
        this.addQuestionsFormArray = formData.questions;
      }
    }
  }

  addOption() {
    if (this.optionArray.invalid) {
      return;
    }
    const optionGroup = this.optionFormGroup();
    if (this.addQuestionsForm.get('type')?.value === 'dropdown') {
      optionGroup.get('option')?.setValidators([Validators.required]);
      optionGroup.get('option')?.updateValueAndValidity();
    }
    this.optionArray.push(optionGroup);
  }
}
