import { byString } from '@kourge/ordering/comparator';

export const configurableDataElements = [
  'FirstName',
  'LastOrSurname',
  'MiddleName',
  'AliasName',
  'Birthdate',
  'Sex',
  'FirstEntryDateIntoUSSchool',
  'LEPStatus',
  'LimitedEnglishProficiencyEntryDate',
  'LEPExitDate',
  'EnglishLanguageProficiencyLevel',
  'TitleIIILanguageInstructionProgramType',
  'EnglishLanguageAcquisitionStatus',
  'EnglishLanguageAcquisitionStatusStartDate',
  'IDEAIndicator',
  'Section504Status',
  'EconomicDisadvantageStatus',
  'MigrantStatus',
  'LanguageCode',
  'MilitaryConnectedStudentIndicator',
  'PrimaryDisabilityType',
  'Ethnicity',
  'SessionId',
  'Completeness',
  'AdministrationCondition',
  'ExamItems'
].sort(byString);
