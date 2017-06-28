import { byString, byNumber, join } from "@kourge/ordering/comparator";
import { Assessment } from "./model/assessment.model";
import { ordering } from "@kourge/ordering";

const byGrade = ordering(byNumber).on<Assessment>(assessment => assessment.grade).compare;
const byName = ordering(byString).on<Assessment>(assessment => assessment.name).compare;

export const byGradeThenByName = join(byGrade, byName);
