export interface User {
  id: string;
  name: string;
  color: string;
  cursor?: CursorPosition;
}

export interface CursorPosition {
  lineNumber: number;
  column: number;
}

export interface DocumentData {
  content: string;
  language: string;
}

export interface TextChange {
  content: string;
  changes: any[];
  userId?: string;
}

export interface LanguageOption {
  value: string;
  label: string;
}