import { byString, join } from "@kourge/ordering/comparator";
import { Assessment } from "./model/assessment.model";
import { ordering } from "@kourge/ordering";

const byGrade = ordering(byString).on<any>(assessment => assessment.grade ? assessment.grade : '').compare;
const byName = ordering(byString).on<any>(assessment => assessment.label ? assessment.label : '').compare;

export const byGradeThenByName = join(byGrade, byName);
