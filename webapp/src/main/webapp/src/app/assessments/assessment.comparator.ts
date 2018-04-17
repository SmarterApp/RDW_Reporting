import { byString, join } from "@kourge/ordering/comparator";
import { Assessment } from "./model/assessment.model";
import { ordering } from "@kourge/ordering";

const byGrade = ordering(byString).on<Assessment>(assessment => assessment.grade).compare;
const byName = ordering(byString).on<Assessment>(assessment => assessment.label).compare;

export const byGradeThenByName = join(byGrade, byName);
