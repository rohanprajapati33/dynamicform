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
import { ToastrService } from 'ngx-toastr';

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

  constructor(
    private formbuilder: FormBuilder,
    private route: ActivatedRoute,
    public toastr: ToastrService
  ) {}

  get optionArray() {
    return this.addQuestionsForm.get('option') as FormArray;
  }

  get validationsControl() {
    return this.addQuestionsForm.get('validations') as FormArray;
  }
  /**
   *on ngOnInit form's questions value show and set dynamic validation for checkbox , radio and option
   *
   * @memberof AddQuestionsComponent
   */
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
  /**
   *This function is used to add-questions and save data to localstorage and reset the form value
   *
   * @return {*}
   * @memberof AddQuestionsComponent
   */
  addQuestions() {
    if (
      this.addQuestionsForm.get('type')?.value === 'dropdown' &&
      this.optionArray.length === 0
    ) {
      this.toastr.error('You must add at least one option for dropdown type.');
      return;
    }

    if (this.addQuestionsForm.valid) {
      if (this.isEditDetails) {
        this.addQuestionsFormArray[this.editIndex] =
          this.addQuestionsForm.value;
      } else {
        this.addQuestionsFormArray.push(this.addQuestionsForm.value);
      }
      this.saveToLocalstorage();
      this.addQuestionsForm.reset();
      this.addQuestionsForm.markAsPristine();
      this.addQuestionsForm.markAsUntouched();
      this.addQuestionsForm.updateValueAndValidity();
      this.isEditable = true;
    } else {
      this.addQuestionsForm.markAllAsTouched();
      this.optionArray.markAllAsTouched();
    }
  }

  optionFormGroup() {
    return this.formbuilder.group({
      option: [''],
    });
  }
  /**
   *This function is used to edit questions
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
   *This function is save data of formname and questions to localstorage with
   *
   * @return {*}
   * @memberof AddQuestionsComponent
   */
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
  /**
   *This function is used to remove questions
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
   *This function used to add option after click dropdown type
   *
   * @return {*}
   * @memberof AddQuestionsComponent
   */
  addOption() {
    if (this.optionArray.invalid) {
      return;
    }
    const optionGroup = this.optionFormGroup();
    optionGroup.get('option')?.setValidators([Validators.required]);
    optionGroup.get('option')?.updateValueAndValidity();
    this.optionArray.push(optionGroup);
  }
}
