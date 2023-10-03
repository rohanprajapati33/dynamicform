export interface QuestionData {
  questions: string;
  type: number;
  option: Option[];
  validations: string[];
  inputField1: string;
  inputField2: string;
  minValue: number | null;
  maxValue: number | null;
  formName: string;
}

export interface Option {
  value: string;
}
