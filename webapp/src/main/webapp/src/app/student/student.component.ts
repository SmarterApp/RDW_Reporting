import { Component, OnInit } from "@angular/core";
import { StudentExamHistoryService } from "./student-exam-history.service";
import { FormGroup, AbstractControl, FormControl, Validators } from "@angular/forms";

@Component({
  selector: 'student-search',
  templateUrl: './student.component.html'
})
export class StudentComponent implements OnInit {

  searchForm: FormGroup;
  studentNotFound: boolean;

  constructor(private studentExamHistoryService: StudentExamHistoryService) { }

  ngOnInit() {
    this.searchForm = new FormGroup({
      ssid: new FormControl(null, Validators.required)
    });
  }

  private get ssidControl(): AbstractControl {
    return this.searchForm.controls["ssid"];
  }

  /**
   * Search for the entered sudent SSID.  If a student exists with exams,
   * navigate to the results page.  Otherwise, display a not found message.
   */
  performSearch(): void {
    let ssid: string = this.ssidControl.value;
    this.studentNotFound = false;

    this.studentExamHistoryService.existsById(ssid)
      .subscribe((studentExists) => {
        if (studentExists) {
          console.log("Navigate to student exam history")
        }
        this.studentNotFound = !studentExists;
      });
  }

}
