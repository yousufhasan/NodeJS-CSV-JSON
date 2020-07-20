import { writeFileSync } from "fs";
import { CsvRow } from "../models";

export interface NodeSettings {
  node: any;
  key: string;
  insert(): any;
  update(): any;
}

export abstract class JSONBuilder<T> {
  abstract fileName: String;
  abstract data: T;
  protected row: CsvRow = {};
  private rowCounter: number;
  nodeSettings: NodeSettings[];
  private depth: number;
  private node: any;
  private key: string;

  constructor() {
    this.depth = 0;
    this.rowCounter = 0;
    this.node = null;
    this.key = "";
    this.nodeSettings = [];
  }

  protected abstract createNodeSettings(): void;

  private insertOrUpdateNode() {
    try {
      if (this.depth >= this.nodeSettings.length) {
        return;
      }

      this.node = this.nodeSettings[this.depth].node;
      this.key = this.nodeSettings[this.depth].key;

      if (!(this.key in this.node)) {
        //only look in the node at that level
        this.node[this.key] = this.nodeSettings[this.depth].insert();
      } else {
        this.nodeSettings[this.depth].update();
        this.depth++;
        this.insertOrUpdateNode();
      }
    } catch (e) {
      console.log(e);
    }
  }

  private getJSONData() {
    return this.data;
  }

  private transformRow(line: string) {
    const row = line.split(",");
    this.row.Region = row[0];
    this.row.Country = row[1];
    this.row["Item Type"] = row[2];
    this.row["Order Priority"] = row[4];
    this.row["Order Date"] = row[5];
    this.row["Ship Date"] = row[7];
    this.row["Total Revenue"] = row[11];
    this.row["Total Cost"] = row[12];
    this.row["Total Profit"] = row[13];
  }

  public parseRow(record: string) {
    if (this.rowCounter > 0) {
      //ignore the header
      this.depth = 0;
      this.transformRow(record);
      this.createNodeSettings();
      this.insertOrUpdateNode();
    }
    this.rowCounter++;
  }

  public async generateJSONOutput() {
    await writeFileSync(
      `${__dirname}/../../output/${this.fileName}.json`,
      JSON.stringify(this.getJSONData())
    );
    console.log(`Parsed ${this.rowCounter - 1} rows`);
    console.log(`Successfully created /output/${this.fileName}`);
  }
}
