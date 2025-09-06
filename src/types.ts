// simple types for loomtype

export interface Pattern {
  [category: string]: string[];
}

export interface VerifyCheck {
  check: string;
  expect?: string;
  on_fail?: string;
  timeout?: number;
}

export interface Config {
  version: number;
  name: string;
  description?: string;
  patterns?: Pattern;
  verify?: { [key: string]: VerifyCheck };
}

export interface Result {
  name: string;
  passed: boolean;
  reason?: string;
}
