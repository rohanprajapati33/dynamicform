export interface QuestionData {
  questions: string;
  type: string;
  option: Option[];
  validations: string[];
  checkBox1: string;
  checkBox2: string;
  radioBox1: string;
  radioBox2: string;
  minValue: number | null;
  maxValue: number | null;
  formName: string;
}

export interface Option {
  option: string;
}
