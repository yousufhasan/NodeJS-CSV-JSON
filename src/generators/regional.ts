import { RegionalBuilder } from "../builder";
import { readCSV } from "../index";

export const generateRegionalReport = () => {
  const builder = new RegionalBuilder();
  console.log("Preparing Regional Revenue JSON File.....");
  readCSV(builder);
};

generateRegionalReport();