export interface Priority {
    L: number;
    H: number;
    M: number;
    C: number;
  }
  
  export interface MonthlySummary {
    [key: string]: Priority;
  }
  
  export interface YearlySummary {
    [key: string]: MonthlySummary;
  }
  
  