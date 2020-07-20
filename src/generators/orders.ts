import { OrdersBuilder } from "../builder";
import { readCSV } from "../index";

export const generateOrdersReport = () => {
  const builder = new OrdersBuilder();
  console.log("Preparing Orders Summary Report JSON File.....");
  readCSV(builder);
};

generateOrdersReport();
