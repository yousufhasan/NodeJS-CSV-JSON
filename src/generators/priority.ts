import { PriorityBuilder } from "../builder";
import { readCSV } from "../index";

export const generatePriorityReport = () => {
  const parser = new PriorityBuilder();
  console.log("Preparing Yearly Priority Orders JSON File.....");
  readCSV(parser);
};

generatePriorityReport();