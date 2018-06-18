import { Component, Input } from '@angular/core';
import { Assessment } from './model/assessment.model';

export const IcaAssessmentIconsBySubject = {
  'Math': 'Math/ICA',
  'ELA': 'ELA/ICA'
};

export const SummativeAssessmentIconsBySubject = {
  'Math': 'Math/Summative',
  'ELA': 'ELA/Summative'
};

export const AssessmentIconsByAssessmentName = {
  'SBAC-IAB-FIXED-G3M-G-MATH-3': 'Math/3-5/Geometry',
  'SBAC-IAB-FIXED-G3M-MD-MATH-3': 'Math/3-5/Measurement and Data',
  'SBAC-IAB-FIXED-G3M-NBT-MATH-3': 'Math/3-5/Number and Operations in Base 10',
  'SBAC-IAB-FIXED-G3M-NF-MATH-3': 'Math/3-5/Number Operations-Fractions',
  'SBAC-IAB-FIXED-G3M-OA-MATH-3': 'Math/3-5/Operations and Algebraic Thinking',
  'SBAC-IAB-FIXED-G3M-Perf-OrderForm-MATH-3': 'Math/3-5/Mathematics Performance Task',

  'SBAC-IAB-FIXED-G4M-G-MATH-4': 'Math/3-5/Geometry',
  'SBAC-IAB-FIXED-G4M-MD-MATH-4': 'Math/3-5/Measurement and Data',
  'SBAC-IAB-FIXED-G4M-NBT-MATH-4': 'Math/3-5/Number and Operations in Base 10',
  'SBAC-IAB-FIXED-G4M-NF-MATH-4': 'Math/3-5/Number Operations-Fractions',
  'SBAC-IAB-FIXED-G4M-OA-MATH-4': 'Math/3-5/Operations and Algebraic Thinking',
  'SBAC-IAB-FIXED-G4M-Perf-AnimalJumping-MATH-4': 'Math/3-5/Mathematics Performance Task',

  'SBAC-IAB-FIXED-G5M-G-MATH-5': 'Math/3-5/Geometry',
  'SBAC-IAB-FIXED-G5M-MD-MATH-5': 'Math/3-5/Measurement and Data',
  'SBAC-IAB-FIXED-G5M-NBT-MATH-5': 'Math/3-5/Number and Operations in Base 10',
  'SBAC-IAB-FIXED-G5M-NF-MATH-5': 'Math/3-5/Number Operations-Fractions',
  'SBAC-IAB-FIXED-G5M-OA-MATH-5': 'Math/3-5/Operations and Algebraic Thinking',
  'SBAC-IAB-FIXED-G5M-Perf-TurtleHabitat-MATH-5': 'Math/3-5/Mathematics Performance Task',

  'SBAC-IAB-FIXED-G6M-EE': 'Math/6-7/Expressions-and-Equations',
  'SBAC-IAB-FIXED-G6M-G-Calc-MATH-6': 'Math/6-7/Geometry',
  'SBAC-IAB-FIXED-G6M-NS': 'Math/6-7/The-Number-System',
  'SBAC-IAB-FIXED-G6M-Perf-CellPhonePlan-MATH-6': 'Math/6-7/Mathematics Performance Task',
  'SBAC-IAB-FIXED-G6M-RP': 'Math/6-7/Ratio-and-Proportional-Relationships',
  'SBAC-IAB-FIXED-G6M-SP': 'Math/6-7/Statistics and Probability',

  'SBAC-IAB-FIXED-G7M-EE': 'Math/6-7/Expressions-and-Equations',
  'SBAC-IAB-FIXED-G7M-G': 'Math/6-7/Geometry',
  'SBAC-IAB-FIXED-G7M-NS': 'Math/6-7/The-Number-System',
  'SBAC-IAB-FIXED-G7M-Perf-CampingTasks-MATH-7': 'Math/6-7/Mathematics Performance Task',
  'SBAC-IAB-FIXED-G7M-RP-Calc-MATH-7': 'Math/6-7/Ratio-and-Proportional-Relationships',
  'SBAC-IAB-FIXED-G7M-SP-Calc-MATH-7': 'Math/6-7/Statistics and Probability',

  'SBAC-IAB-FIXED-G8M-EE': 'Math/8/Expressions-and-Equations',
  'SBAC-IAB-FIXED-G8M-EE2-Calc-MATH-8': 'Math/8/Expressions-and-Equations-2',
  'SBAC-IAB-FIXED-G8M-F-Calc-MATH-8': 'Math/8/Functions',
  'SBAC-IAB-FIXED-G8M-G-Calc-MATH-8': 'Math/8/Geometry',
  'SBAC-IAB-FIXED-G8M-NS-MATH-8': 'Math/8/The-Number-System',
  'SBAC-IAB-FIXED-G8M-Perf-BaseballTickets-MATH-8': 'Math/8/Performance Task',

  'SBAC-IAB-FIXED-G11M-AlgLin': 'Math/HS/Algebra and Functions I',
  'SBAC-IAB-FIXED-G11M-AlgLinearFun': 'Math/HS/Algebra and Functions I',
  'SBAC-IAB-FIXED-G11M-AlgQuad': 'Math/HS/Algebra and Functions II',
  'SBAC-IAB-FIXED-G11M-AlgQuadFun': 'Math/HS/Algebra and Functions II',
  'SBAC-IAB-FIXED-G11M-GCO-MATH-11': 'Math/HS/Geometry Congruence',
  'SBAC-IAB-FIXED-G11M-GeoRightTriRatios-Calc-MATH-11': 'Math/HS/Geometry and Righ Triangle Trigonometry',
  'SBAC-IAB-FIXED-G11M-GMD-MATH-11': 'Math/HS/Geometry Measurement and Modeling',
  'SBAC-IAB-FIXED-G11M-IF': 'Math/HS/Interpreting Functions',
  'SBAC-IAB-FIXED-G11M-NQ': 'Math/HS/Number and Quantity',
  'SBAC-IAB-FIXED-G11M-Perf-TeenDrivingRest-MATH-11': 'Math/HS/Performance Task',
  'SBAC-IAB-FIXED-G11M-SP-Calc-MATH-11': 'Math/HS/Statistics and Probability',
  'SBAC-IAB-FIXED-G11M-SSE': 'Math/HS/Seeing Structure in Expressions',

  'SBAC-IAB-FIXED-G3E-BriefWrites-ELA-3': 'ELA/Brief Write',
  'SBAC-IAB-FIXED-G3E-Editing-ELA-3': 'ELA/Edit',
  'SBAC-IAB-FIXED-G3E-EditRevise-ELA-3': 'ELA/Edit - Revise',
  'SBAC-IAB-FIXED-G3E-LangVocab-ELA-3': 'ELA/Language and Vocabulary Use',
  'SBAC-IAB-FIXED-G3E-ListenInterpet-ELA-3': 'ELA/Listen and Interpret',
  'SBAC-IAB-FIXED-G3E-Perf-Opinion-Beetles': 'ELA/Performance Task',
  'SBAC-IAB-FIXED-G3E-ReadInfo-ELA-3': 'ELA/Read Informational Texts',
  'SBAC-IAB-FIXED-G3E-ReadLit-ELA-3': 'ELA/Read Literary Texts',
  'SBAC-IAB-FIXED-G3E-Research-ELA-3': 'ELA/Research',
  'SBAC-IAB-FIXED-G3E-Revision-ELA-3': 'ELA/Revise',

  'SBAC-IAB-FIXED-G4E-BriefWrites-ELA-4': 'ELA/Brief Write',
  'SBAC-IAB-FIXED-G4E-Editing-ELA-4': 'ELA/Edit',
  'SBAC-IAB-FIXED-G4E-EditRevise-ELA-4': 'ELA/Edit - Revise',
  'SBAC-IAB-FIXED-G4E-LangVocab-ELA-4': 'ELA/Language and Vocabulary Use',
  'SBAC-IAB-FIXED-G4E-ListenInterpet-ELA-4': 'ELA/Listen and Interpret',
  'SBAC-IAB-FIXED-G4E-Perf-Narrative-UnlikelyAnimal': 'ELA/Performance Task',
  'SBAC-IAB-FIXED-G4E-ReadInfo-ELA-4': 'ELA/Read Informational Texts',
  'SBAC-IAB-FIXED-G4E-ReadLit-ELA-4': 'ELA/Read Literary Texts',
  'SBAC-IAB-FIXED-G4E-Research-ELA-4': 'ELA/Research',
  'SBAC-IAB-FIXED-G4E-Revision-ELA-4': 'ELA/Revise',

  'SBAC-IAB-FIXED-G5E-BriefWrites-ELA-5': 'ELA/Brief Write',
  'SBAC-IAB-FIXED-G5E-Editing-ELA-5': 'ELA/Edit',
  'SBAC-IAB-FIXED-G5E-EditRevise-ELA-5': 'ELA/Edit - Revise',
  'SBAC-IAB-FIXED-G5E-LangVocab-ELA-5': 'ELA/Language and Vocabulary Use',
  'SBAC-IAB-FIXED-G5E-ListenInterpet-ELA-5': 'ELA/Listen and Interpret',
  'SBAC-IAB-FIXED-G5E-Perf-Narrative-Whales': 'ELA/Performance Task',
  'SBAC-IAB-FIXED-G5E-ReadInfo-ELA-5': 'ELA/Read Informational Texts',
  'SBAC-IAB-FIXED-G5E-ReadLit-ELA-5': 'ELA/Read Literary Texts',
  'SBAC-IAB-FIXED-G5E-Research-ELA-5': 'ELA/Research',
  'SBAC-IAB-FIXED-G5E-Revision-ELA-5': 'ELA/Revise',

  'SBAC-IAB-FIXED-G6E-BriefWrites-ELA-6': 'ELA/Brief Write',
  'SBAC-IAB-FIXED-G6E-Editing-ELA-6': 'ELA/Edit',
  'SBAC-IAB-FIXED-G6E-EditRevise-ELA-6': 'ELA/Edit - Revise',
  'SBAC-IAB-FIXED-G6E-LangVocab-ELA-6': 'ELA/Language and Vocabulary Use',
  'SBAC-IAB-FIXED-G6E-ListenInterpet-ELA-6': 'ELA/Listen and Interpret',
  'SBAC-IAB-FIXED-G6E-Perf-Argument-Multivitamins': 'ELA/Performance Task',
  'SBAC-IAB-FIXED-G6E-ReadInfo-ELA-6': 'ELA/Read Informational Texts',
  'SBAC-IAB-FIXED-G6E-ReadLit-ELA-6': 'ELA/Read Literary Texts',
  'SBAC-IAB-FIXED-G6E-Research-ELA-6': 'ELA/Research',
  'SBAC-IAB-FIXED-G6E-Revision-ELA-6': 'ELA/Revise',

  'SBAC-IAB-FIXED-G7E-BriefWrites-ELA-7': 'ELA/Brief Write',
  'SBAC-IAB-FIXED-G7E-Editing-ELA-7': 'ELA/Edit',
  'SBAC-IAB-FIXED-G7E-EditRevise-ELA-7': 'ELA/Edit - Revise',
  'SBAC-IAB-FIXED-G7E-LangVocab-ELA-7': 'ELA/Language and Vocabulary Use',
  'SBAC-IAB-FIXED-G7E-ListenInterpet-ELA-7': 'ELA/Listen and Interpret',
  'SBAC-IAB-FIXED-G7E-Perf-Explanatory-MobileEdTech': 'ELA/Performance Task',
  'SBAC-IAB-FIXED-G7E-ReadInfo-ELA-7': 'ELA/Read Informational Texts',
  'SBAC-IAB-FIXED-G7E-ReadLit-ELA-7': 'ELA/Read Literary Texts',
  'SBAC-IAB-FIXED-G7E-Research-ELA-7': 'ELA/Research',
  'SBAC-IAB-FIXED-G7E-Revision-ELA-7': 'ELA/Revise',

  'SBAC-IAB-FIXED-G8E-BriefWrites-ELA-8': 'ELA/Brief Write',
  'SBAC-IAB-FIXED-G8E-EditRevise-ELA-8': 'ELA/Edit - Revise',
  'SBAC-IAB-FIXED-G8E-ListenInterpet-ELA-8': 'ELA/Listen and Interpret',
  'SBAC-IAB-FIXED-G8E-Perf-Explanatory-CompareAncient': 'ELA/Performance Task',
  'SBAC-IAB-FIXED-G8E-ReadInfo-ELA-8': 'ELA/Read Informational Texts',
  'SBAC-IAB-FIXED-G8E-ReadLit-ELA-8': 'ELA/Read Literary Texts',
  'SBAC-IAB-FIXED-G8E-Research-ELA-8': 'ELA/Research',

  'SBAC-IAB-FIXED-G11E-BriefWrites-ELA-11': 'ELA/Brief Write',
  'SBAC-IAB-FIXED-G11E-Editing-ELA-11': 'ELA/Edit',
  'SBAC-IAB-FIXED-G11E-EditRevise-ELA-11': 'ELA/Edit - Revise',
  'SBAC-IAB-FIXED-G11E-LangVocab-ELA-11': 'ELA/Language and Vocabulary Use',
  'SBAC-IAB-FIXED-G11E-ListenInterpet-ELA-11': 'ELA/Listen and Interpret',
  'SBAC-IAB-FIXED-G11E-Perf-Explanatory-Marshmallow': 'ELA/Performance Task',
  'SBAC-IAB-FIXED-G11E-ReadInfo-ELA-11': 'ELA/Read Informational Texts',
  'SBAC-IAB-FIXED-G11E-ReadLit-ELA-11': 'ELA/Read Literary Texts',
  'SBAC-IAB-FIXED-G11E-Research-ELA-11': 'ELA/Research',
  'SBAC-IAB-FIXED-G11E-Revision-ELA-11': 'ELA/Revise'
};

@Component({
  selector: 'assessment-icon',
  template: `
    <sb-icon *ngIf="icon"
             [icon]="'assessment-icon/' + icon"
             [styles]="styles"></sb-icon>
  `,
  host: {
    class: 'assessment-icon'
  }
})
export class AssessmentIconComponent {

  @Input()
  styles: any;

  private _icon: string;

  get icon(): string {
    return this._icon;
  }

  @Input()
  set assessment(value: Assessment) {

    switch (value.type) {
      case 'ica':
        this._icon = IcaAssessmentIconsBySubject[ value.subject ];
        break;
      case 'sum':
        this._icon = SummativeAssessmentIconsBySubject[ value.subject ];
        break;
      default:
        this._icon = AssessmentIconsByAssessmentName[ value.name ];
        break;
    }

  }

}
