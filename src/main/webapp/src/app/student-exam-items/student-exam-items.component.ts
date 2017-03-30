import {Component, OnInit, ElementRef, ViewChild, AfterViewInit} from "@angular/core";
import { SafeResourceUrl, DomSanitizer } from '@angular/platform-browser';
import {ActivatedRoute} from "@angular/router";
import {DataService} from "../shared/data.service";
import {TranslateService} from "ng2-translate";

declare var IRiS : any;

@Component({
  selector: 'student-exam-items',
  templateUrl: './student-exam-items.component.html'
})
export class StudentExamItemsComponent implements OnInit {

  private breadcrumbs = [];
  private model : any;
  private size = 1;
  private _irisFrame;
  private irisIsLoading = true;

  // TODO:  How is this configured?
  private irisUrl = "https://tds-stage.smarterbalanced.org/iris/";
  private safeIrisUrl : SafeResourceUrl;

  @ViewChild('irisframe')
    set irisFrame(value: ElementRef){
      if(value && value.nativeElement) {
        this._irisFrame = value.nativeElement;
        IRiS.setFrame(value.nativeElement)

        this._irisFrame.addEventListener('load', this.irisframeOnLoad.bind(this));
      }
  }

  constructor(private service: DataService, private route: ActivatedRoute, private translate: TranslateService, private sanitizer : DomSanitizer) {
  }

  ngOnInit() {
    this.safeIrisUrl = this.sanitizer.bypassSecurityTrustResourceUrl(this.irisUrl);

    this.route.params.subscribe(params => {
      this.service.getStudentExam(params['groupId'], params['studentId'], params['examId']).subscribe((data:any) => {
        this.translate.get('labels.assessment.grade').subscribe(currentTitle => {

          this.model = Object.assign({}, data); // This only does a shallow copy.

          // Until a deep copy is available, iterate and copy each item in children arrays.
          this.model.items = [];
          for(var i in data.items){
            this.model.items.push(Object.assign({}, data.items[i]));
          }

          this.breadcrumbs = this.getBreadCrumbs(currentTitle, this.model)
        })
      })
    });
  }

  getBreadCrumbs(currentTitle, model) {
    return [
      {name: model.group.name, path: `/groups/${model.group.id}/students`},
      {
        name: `${model.student.lastName}, ${model.student.firstName}`,
        path: `/groups/${model.group.id}/students/${model.student.id}/exams`
      },
      {name: `${currentTitle} ${model.exam.assessment.grade} ${model.exam.assessment.name}`}
    ];
  }

  irisframeOnLoad(){
    if(this.model.items.length > 0)
      this.selectRow(this.model.items[0]);

    this.irisIsLoading = false;
  }

  selectRow(item){
    for(var i in this.model.items){
      this.model.items[i].selected = this.model.items[i] === item;
    }

    IRiS.loadToken(item.irisInfo.vendorId, item.irisInfo.token);
  }

  private toggleWindowSize() {
    this.size++;
    if (this.size > 2) {
      this.size = 0;
    }
    console.log('size', this.size);
  }
}

