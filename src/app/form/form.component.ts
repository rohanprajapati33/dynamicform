import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-form',
  templateUrl: './form.component.html',
  styleUrls: ['./form.component.scss'],
})
export class FormComponent {
  questionsData: any;

  constructor(private router: Router, private route: ActivatedRoute) {}
  ngOnInit() {
    this.showQuestionsData();
    console.log(this.questionsData);
  }

  showQuestionsData() {
    this.questionsData = JSON.parse(
      localStorage.getItem('add-questions') as any
    );
    return this.questionsData;
  }

  editFormDetails(index: number) {
    this.router.navigateByUrl(`add-que/${this.questionsData[index].formName}`);
  }

  deleteFormDetails(index: number) {
    this.questionsData.splice(index, 1);
    localStorage.setItem('add-questions', JSON.stringify(this.questionsData));
  }

  previewFormDetails(index: number) {
    // this.router.navigateByUrl(`add-que/${this.questionsData[index].formName}`);
    this.router.navigate(['/preview']);
  }
}
