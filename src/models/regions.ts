export interface Revenue {
    Revenue: number;
    Cost: number;
    Profit: number;
  }
  
  export interface ItemType {
    [key: string]: Revenue;
  }
  
  export interface Country {
    [key: string]: {
      Total: Revenue;
      ItemTypes: ItemType;
    };
  }
  export interface Region {
    [key: string]: {
      Total: Revenue;
      Countries: Country;
    };
  }
  
  export interface ReginalRevenue {
    Regions: Region;
    ItemTypes: ItemType;
  }
  