import { JSONBuilder } from "./json-builder";
import {
  YearlyOrders,
  MonthlyOrders,
  OrderCountry,
  OrderRegion,
} from "../models/orders";
import {
  getYearFromDate,
  getMonthFromDate,
  getDateDiffInDays,
  calculateNewAvg,
} from "../common";

interface OrderShippingInfo {
  AvgDaysToShip: number;
  NumberOfOrders: number;
}

export class OrdersBuilder extends JSONBuilder<YearlyOrders> {
  data: YearlyOrders = {};
  fileName: string = "shipment-orders-summary";
  createNodeSettings() {
    this.nodeSettings = [
      {
        node: this.data,
        key: this.getOrderYear(),
        insert: () => this.buildMonthlyOrder(),
        update: () => {},
      },
      {
        node: this.data[this.getOrderYear()],
        key: this.getOrderMonth(),
        insert: () => this.getRegionsAndShippingOrders(),
        update: () => {
          this.updateAvgShippingAndNumberofOrders(
            this.data[this.getOrderYear()][this.getOrderMonth()]
          );
        },
      },
      {
        node: this.getRegionalNode(),
        key: this.row.Region!,
        insert: () => this.getCountriesAndShippingOrders(),
        update: () => {
          this.updateAvgShippingAndNumberofOrders(
            this.getRegionalNode()[this.row.Region!]
          );
        },
      },
      {
        node: this.getCountryNode(),
        key: this.row.Country!,
        insert: () => this.getAvgShippingAndNumberOfOrders(),
        update: () => {
          this.updateAvgShippingAndNumberofOrders(
            this.getCountryNode()[this.row.Country!]
          );
        },
      },
    ];
  }

  getOrderYear(): string {
    return getYearFromDate(this.row["Order Date"]!);
  }

  getOrderMonth(): string {
    return getMonthFromDate(this.row["Order Date"]!);
  }

  getRegionalNode() {
    return (
      this.data[this.getOrderYear()] &&
      this.data[this.getOrderYear()][this.getOrderMonth()] &&
      this.data[this.getOrderYear()][this.getOrderMonth()].Regions
    );
  }

  getCountryNode() {
    return (
      this.getRegionalNode() &&
      this.data[this.getOrderYear()][this.getOrderMonth()].Regions[
        this.row.Region!
      ] &&
      this.data[this.getOrderYear()][this.getOrderMonth()].Regions[
        this.row.Region!
      ].Countries
    );
  }

  buildMonthlyOrder(): MonthlyOrders {
    return {
      [this.getOrderMonth()]: this.getRegionsAndShippingOrders(),
    };
  }

  buildRegionalOrder(): OrderRegion {
    return {
      [this.row.Region!]: this.getCountriesAndShippingOrders(),
    };
  }

  buildCountryOrder(): OrderCountry {
    return {
      [this.row.Country!]: {
        AvgDaysToShip: getDateDiffInDays(
          this.row["Ship Date"]!,
          this.row["Order Date"]!
        ),
        NumberOfOrders: 1,
      },
    };
  }

  getAvgShippingAndNumberOfOrders() {
    return {
      AvgDaysToShip: getDateDiffInDays(
        this.row["Ship Date"]!,
        this.row["Order Date"]!
      ),
      NumberOfOrders: 1,
    };
  }

  getCountriesAndShippingOrders() {
    return {
      ...this.getAvgShippingAndNumberOfOrders(),
      Countries: this.buildCountryOrder(),
    };
  }

  getRegionsAndShippingOrders() {
    return {
      ...this.getAvgShippingAndNumberOfOrders(),
      Regions: this.buildRegionalOrder(),
    };
  }

  updateAvgShippingAndNumberofOrders(order: OrderShippingInfo) {
    order.AvgDaysToShip = calculateNewAvg(
      order.AvgDaysToShip,
      order.NumberOfOrders,
      getDateDiffInDays(this.row["Ship Date"]!, this.row["Order Date"]!)
    );
    order.NumberOfOrders += 1;
  }
}
