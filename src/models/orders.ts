export interface OrderCountry {
  [key: string]: {
    AvgDaysToShip: number;
    NumberOfOrders: number;
  };
}

export interface OrderRegion {
  [key: string]: {
    AvgDaysToShip: number;
    NumberOfOrders: number;
    Countries: OrderCountry;
  };
}

export interface MonthlyOrders {
  [key: string]: {
    AvgDaysToShip: number;
    NumberOfOrders: number;
    Regions: OrderRegion;
  };
}

export interface YearlyOrders {
  [key: string]: MonthlyOrders;
}
