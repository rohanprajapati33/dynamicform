import { Component } from '@angular/core';
import {
  AbstractControl,
  FormArray,
  FormBuilder,
  FormControl,
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

    this.addQuestionsForm.get('type')?.valueChanges.subscribe((value) => {
      const inputControl1 = this.addQuestionsForm.get('inputField1');
      const inputControl2 = this.addQuestionsForm.get('inputField2');

      if (value === 'checkbox' || value === 'radio') {
        inputControl1?.setValidators([Validators.required]);
        inputControl2?.setValidators([Validators.required]);
      } else {
        inputControl1?.clearValidators();
        inputControl2?.clearValidators();
      }
      inputControl1?.updateValueAndValidity();
      inputControl2?.updateValueAndValidity();
    });
    this.formName = this.route.snapshot.paramMap.get('formName') || '';
    this.showQuestions();
  }

  optionArrayValidator(
    control: AbstractControl
  ): { [key: string]: boolean } | null {
    const options = control.get('option') as FormArray;
    let hasValue = false;

    options.controls.forEach((option: AbstractControl) => {
      if (option.value && option.value.trim() !== '') {
        hasValue = true;
      }
    });

    return hasValue ? null : { optionsEmpty: true };
  }

  /**
   *This Function is used to add Questions  and reset
   *
   * @memberof AddQuestionsComponent
   */
  addQuestions() {
    console.log(this.addQuestionsForm);
    if (this.addQuestionsForm.valid) {
      if (this.isEditDetails) {
        this.addQuestionsFormArray[this.editIndex] =
          this.addQuestionsForm.value;
      } else {
        this.addQuestionsFormArray.push(this.addQuestionsForm.value);
      }
      console.log(this.addQuestionsForm);
      console.log(this.addQuestionsFormArray);
      this.saveToLocalstorage();
      this.addQuestionsForm.reset();
      this.addQuestionsForm.clearValidators();
      this.isEditable = true;
    }
  }

  optionFormGroup() {
    return this.formbuilder.group({
      option: [''],
    });
  }

  /**
   *This Function is used to edit questions
   *
   * @param {number} index
   * @memberof AddQuestionsComponent
   */
  editQuestions(index: number) {
    this.isEditDetails = true;
    this.isEditable = false;
    this.editIndex = index;
    this.questionToEdit = this.addQuestionsFormArray[index];
    this.addQuestionsForm.patchValue(this.questionToEdit);
  }
  /**
   *This function is stored questions data in localstorage
   *
   * @return {*}
   * @memberof AddQuestionsComponent
   */
  saveToLocalstorage() {
    if (this.addQuestionsForm.invalid) return;

    const formName = this.formName;
    const storedQueData = JSON.parse(
      localStorage.getItem('add-questions') || '[]'
    );
    const formIndex = storedQueData.findIndex(
      (data: any) => data.formName === formName
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
  /**
   *This Function is remove questions as per index
   *
   * @param {number} index
   * @memberof AddQuestionsComponent
   */
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
  /**
   
   *This function is show questions
   * @memberof AddQuestionsComponent
   */
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
  /**
   *This Functions is add options when dropdown select
   *
   * @memberof AddQuestionsComponent
   */
  addOption() {
    this.optionArray.push(this.optionFormGroup());
  }
}
