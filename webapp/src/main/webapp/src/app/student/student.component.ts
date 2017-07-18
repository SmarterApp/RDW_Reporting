import { Component, OnInit } from "@angular/core";
import { StudentExamHistoryService } from "./student-exam-history.service";
import { FormGroup, AbstractControl, FormControl, Validators } from "@angular/forms";
import { Router } from "@angular/router";

@Component({
  selector: 'student-search',
  templateUrl: './student.component.html'
})
export class StudentComponent implements OnInit {

  searchForm: FormGroup;
  studentNotFound: boolean;

  constructor(
    private studentExamHistoryService: StudentExamHistoryService,
    private router: Router) { }

  ngOnInit() {
    this.searchForm = new FormGroup({
      ssid: new FormControl(null, Validators.required)
    });

    this.ssidControl.valueChanges.subscribe(value => {
      this.studentNotFound = false;
    });
  }

  private get ssidControl(): AbstractControl {
    return this.searchForm.controls["ssid"];
  }

  /**
   * Search for the entered student SSID.  If a student exists with exams,
   * navigate to the results page.  Otherwise, display a not found message.
   */
  performSearch(): void {
    let ssid: string = this.ssidControl.value;
    this.studentNotFound = false;

    this.studentExamHistoryService.existsBySsid(ssid)
      .subscribe((student) => {
        if (student) {
          this.router.navigateByUrl(`/students/${student.id}`);
        }
        this.studentNotFound = !student;
      });
  }

}
