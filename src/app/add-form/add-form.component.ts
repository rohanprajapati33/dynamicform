import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';

@Component({
  selector: 'app-add-form',
  templateUrl: './add-form.component.html',
  styleUrls: ['./add-form.component.scss'],
})
export class AddFormComponent {
  addForm!: FormGroup;

  constructor(private formbuilder: FormBuilder, private router: Router) {}

  ngOnInit() {
    this.addForm = this.formbuilder.group({
      formName: ['', Validators.required],
    });
  }

  addQuestions() {
    if (this.addForm.invalid) {
      return;
    }
    localStorage.setItem('add-form', JSON.stringify(this.addForm.value));
    this.router.navigate(['/add-que']);
  }
}
