import { createReadStream } from "fs";
import { split } from "event-stream";
import { JSONBuilder } from "./builder";

const CSV_FILE_NAME = "node-data-processing-medium-data.csv"; //hard coded file name just for demo

export const readCSV = (builder: JSONBuilder<any>) => {
  createReadStream(CSV_FILE_NAME)
    .pipe(split())
    .on("data", (row: any) => {
      builder.parseRow(row);
    })
    .on("end", () => {
      builder.generateJSONOutput();
    });
};
