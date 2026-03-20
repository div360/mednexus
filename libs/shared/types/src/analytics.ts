export interface ChartDataPoint {
  label: string;
  value: number;
  color?: string;
}

export interface TrendData {
  date: string;
  admissions: number;
  discharges: number;
}

export interface MetricSummary {
  label: string;
  value: number;
  change: number; // percentage change
  trend: 'up' | 'down' | 'flat';
}
