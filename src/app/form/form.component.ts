import { Component } from '@angular/core';
import { Router } from '@angular/router';

import { MatDialog } from '@angular/material/dialog';
import { QuestionData } from '../model/questiondata';
import { ConfirmationDialogComponent } from '../confirmation-dialog/confirmation-dialog.component';

@Component({
  selector: 'app-form',
  templateUrl: './form.component.html',
  styleUrls: ['./form.component.scss'],
})
export class FormComponent {
  questionsData!: QuestionData[];

  constructor(private router: Router, public dialog: MatDialog) {}

  ngOnInit() {
    this.showQuestionsData();
  }
  /**
   *This Function is show form-data
   *
   * @return {*}
   * @memberof FormComponent
   */
  showQuestionsData() {
    this.questionsData = JSON.parse(
      localStorage.getItem('add-questions') as string
    );
    return this.questionsData;
  }

  editFormDetails(index: number) {
    this.router.navigateByUrl(`add-que/${this.questionsData[index].formName}`);
  }
  /**
   *This Function is showing dialog box on delete icon
   
   * @param {number} index
   * @param {string} enterAnimationDuration
   * @param {string} exitAnimationDuration
   * @memberof FormComponent
   */
  deleteFormDetails(index: number) {
    const enterAnimationDuration = '0ms';
    const exitAnimationDuration = '0ms';
    const dialog = this.dialog.open(ConfirmationDialogComponent, {
      width: '300px',
      enterAnimationDuration,
      exitAnimationDuration,
    });
    dialog.afterClosed().subscribe((data) => {
      if (data) {
        this.questionsData.splice(index, 1);
        localStorage.setItem(
          'add-questions',
          JSON.stringify(this.questionsData)
        );
      }
    });
  }

  previewFormDetails(index: number) {
    this.router.navigate(['/preview', index]);
  }
}
