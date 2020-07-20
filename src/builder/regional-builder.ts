import { JSONBuilder } from "./json-builder";
import { Country, ItemType, Revenue, ReginalRevenue } from "../models";
import { parseNumeric } from "../common";

export class RegionalBuilder extends JSONBuilder<ReginalRevenue> {
  data: ReginalRevenue = {
    Regions: {},
    ItemTypes: {},
  };
  fileName: string = "regional-summary";

  createNodeSettings() {
    this.nodeSettings = [
      {
        node: this.data.Regions,
        key: this.row.Region!,
        insert: () => this.getRevenueWithCountries(),
        update: () => {
          this.updateTotalRevenue(this.data.Regions[this.row.Region!].Total!);
        },
      },
      {
        node: this.data.ItemTypes,
        key: this.row["Item Type"]!,
        insert: () => this.getRevenue(),
        update: () => {
          this.updateTotalRevenue(this.data.ItemTypes[this.row["Item Type"]!]);
        },
      },
      {
        node: this.getCountryNode(),
        key: this.row.Country!,
        insert: () => this.getRevenueWithItemTypes(),
        update: () => {
          this.updateTotalRevenue(
            this.getCountryNode()[this.row.Country!].Total
          );
        },
      },
      {
        node: this.getItemTypeNode(),
        key: this.row["Item Type"]!,
        insert: () => this.getRevenue(),
        update: () => {
          this.updateTotalRevenue(
            this.getItemTypeNode()[this.row["Item Type"]!]
          );
        },
      },
    ];
  }

  getCountryNode() {
    return (
      this.data.Regions &&
      this.data.Regions[this.row.Region!] &&
      this.data.Regions[this.row.Region!].Countries
    );
  }

  getItemTypeNode() {
    return (
      this.getCountryNode() &&
      this.getCountryNode()[this.row.Country!] &&
      this.getCountryNode()[this.row.Country!].ItemTypes
    );
  }

  getItemType(): ItemType {
    return {
      [this.row["Item Type"]!]: this.getRevenue(),
    };
  }
  getRevenue(): Revenue {
    return {
      Revenue: parseNumeric(this.row["Total Revenue"]),
      Cost: parseNumeric(this.row["Total Cost"]),
      Profit: parseNumeric(this.row["Total Profit"]),
    };
  }

  getCountry(): Country {
    return {
      [this.row.Country!]: {
        Total: this.getRevenue(),
        ItemTypes: this.getItemType(),
      },
    };
  }

  getRevenueWithCountries() {
    return {
      Total: this.getRevenue(),
      Countries: this.getCountry(),
    };
  }

  getRevenueWithItemTypes() {
    return {
      Total: this.getRevenue(),
      ItemTypes: this.getItemType(),
    };
  }

  updateTotalRevenue(total: Revenue) {
    total.Revenue += parseNumeric(this.row["Total Revenue"]);
    total.Cost += parseNumeric(this.row["Total Cost"]);
    total.Profit += parseNumeric(this.row["Total Profit"]);
  }
}
