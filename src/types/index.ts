export type ColumnType = 'quantitative' | 'categorical';

export interface Column {
  id: string;
  name: string;
  type: ColumnType;
  unit?: string;
  description?: string;
}

export interface RowData {
  id: string;
  [columnId: string]: string | number | undefined;
}

export interface Dataset {
  columns: Column[];
  rows: RowData[];
}

export interface DescriptiveResult {
  columnId: string;
  columnName: string;
  unit?: string;
  validN: number;
  missingN: number;
  mean: number;
  median: number;
  mode: number[] | 'Không có mốt';
  min: number;
  max: number;
  range: number;
  variance: number;
  sd: number;
  se: number;
  cv: number; // Coefficient of Variation in %
  q1: number;
  q3: number;
  iqr: number;
  skewness: number;
  kurtosis: number;
}

export interface AnovaGroupStats {
  name: string;
  count: number;
  sum: number;
  mean: number;
  variance: number;
  sd: number;
  min: number;
  max: number;
  rawValues: number[];
}

export interface TukeyPairResult {
  groupA: string;
  groupB: string;
  diff: number;
  se: number;
  qStat: number;
  qCrit: number;
  pEstimate: number;
  isSignificant: boolean;
  ciLower: number;
  ciUpper: number;
}

export interface AnovaResult {
  dependentVarName: string;
  groupVarName: string;
  alpha: number;
  groups: AnovaGroupStats[];
  totalN: number;
  grandMean: number;
  
  // Sum of Squares
  ssBetween: number;
  ssWithin: number;
  ssTotal: number;

  // Degrees of freedom
  dfBetween: number;
  dfWithin: number;
  dfTotal: number;

  // Mean Squares
  msBetween: number;
  msWithin: number;

  // F-statistic & P-value
  fValue: number;
  pValue: number;
  fCrit: number;
  etaSquared: number;
  omegaSquared: number;

  // Post-hoc
  tukeyResults: TukeyPairResult[];

  // Assumptions & Welch
  varianceRatio: number; // Max s^2 / Min s^2
  isHomogeneous: boolean;
  welchF?: number;
  welchDf1?: number;
  welchDf2?: number;
  welchPValue?: number;

  conclusion: string;
  detailedInterpretation: string;
}

export type ChartType = 'bar' | 'scatter' | 'histogram' | 'box' | 'line';
