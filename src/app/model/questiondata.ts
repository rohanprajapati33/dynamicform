export interface QuestionData {
  questions: string;
  type: string;
  option: Option[];
  validations: string[];
  inputField1: string;
  inputField2: string;
  minValue: number | null;
  maxValue: number | null;
  formName: string;
}

export interface Option {
  option: string;
}
