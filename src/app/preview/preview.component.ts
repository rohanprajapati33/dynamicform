import { Component } from '@angular/core';

@Component({
  selector: 'app-preview',
  templateUrl: './preview.component.html',
  styleUrls: ['./preview.component.scss'],
})
export class PreviewComponent {
  questionsData: any;

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
}
