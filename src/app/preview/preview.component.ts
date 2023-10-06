import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-preview',
  templateUrl: './preview.component.html',
  styleUrls: ['./preview.component.scss'],
})
export class PreviewComponent {
  questionsData: any;
  index: any;
  createForm!: FormGroup;

  constructor(
    private route: ActivatedRoute,
    private formbuilder: FormBuilder
  ) {}

  ngOnInit() {
    this.index = this.route.snapshot.paramMap.get('i');
    this.showQuestionsData();
    this.formGroup();
  }

  showQuestionsData() {
    const questionsData =
      JSON.parse(localStorage.getItem('add-questions') as any) || [];
    this.questionsData = questionsData[+this.index];
    return this.questionsData;
  }

  formGroup() {
    this.createForm = this.formbuilder.group({
      text: ['', Validators.required],
      number: [
        '',
        [
          Validators.required,
          Validators.minLength(this.questionsData.minValue),
          Validators.maxLength(this.questionsData.maxValue),
        ],
      ],
      textarea: ['', Validators.required],
      date: ['', Validators.required],
      dropdown: ['', Validators.required],
      checkbox: ['', Validators.required],
    });
  }
  /**
   *This Function is store data in local storage
   *
   * @memberof PreviewComponent
   */
  onSubmit() {
    this.createForm.markAllAsTouched();
    localStorage.setItem('form-data', JSON.stringify(this.createForm.value));
  }
}
