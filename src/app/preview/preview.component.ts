import { Component } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-preview',
  templateUrl: './preview.component.html',
  styleUrls: ['./preview.component.scss'],
})
export class PreviewComponent {
  questionsData: any;
  index: any;
  // form!: FormGroup;
  constructor(
    private route: ActivatedRoute,
    private formbuilder: FormBuilder
  ) {}

  ngOnInit() {
    this.index = this.route.snapshot.paramMap.get('i');
    this.showQuestionsData();

    // this.form = this.formbuilder.group({
    //   questions: ['', Validators.required],
    //   type: ['', Validators.required],
    //   option: this.formbuilder.array([]),
    //   validations: ['', Validators.required],
    //   inputField1: [''],
    //   inputField2: [''],
    //   minValue: [''],
    //   maxValue: [''],
    // });
  }

  showQuestionsData() {
    const questionsData =
      JSON.parse(localStorage.getItem('add-questions') as any) || [];
    this.questionsData = questionsData[+this.index];
    return this.questionsData;
  }
}
