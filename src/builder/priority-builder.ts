import { JSONBuilder } from "./json-builder";
import { MonthlySummary, YearlySummary, Priority } from "../models";
import { getYearFromDate, getMonthFromDate } from "../common";

type OrderPriorityType = "L" | "H" | "C" | "M";

export class PriorityBuilder extends JSONBuilder<YearlySummary> {
  data: YearlySummary = {};
  fileName: string = "priority-summary";

  createNodeSettings() {
    this.nodeSettings = [
      {
        node: this.data,
        key: this.getYear(),
        insert: () => this.getNewMonth(),
        update: () => {},
      },
      {
        node: this.data[this.getYear()],
        key: this.getMonth(),
        insert: () => this.getPriority(),
        update: () => {
          this.updatePriority(
            this.row["Order Priority"]! as OrderPriorityType,
            this.data[this.getYear()][this.getMonth()]
          );
        },
      },
    ];
  }

  getYear(): string {
    return getYearFromDate(this.row["Order Date"]!);
  }

  getMonth(): string {
    return getMonthFromDate(this.row["Order Date"]!);
  }

  getNewMonth(): MonthlySummary {
    return {
      [this.getMonth()]: this.getPriority(),
    };
  }

  getPriority(): Priority {
    return this.updatePriority(
      this.row["Order Priority"]! as OrderPriorityType,
      {
        L: 0,
        H: 0,
        C: 0,
        M: 0,
      }
    );
  }

  updatePriority(label: OrderPriorityType, record: Priority): Priority {
    record[label]++;
    return record;
  }
}
