import Dexie from "dexie";
import * as _ from "lodash";

export interface IMoney {
  total: number;
  totalTime: number;
}

export interface IDrink {
  id?: number;
  max: number;
  count: number;
  timestamp: number;
}

class PeasantDB extends Dexie {
  drinks: Dexie.Table<IDrink, number>;
  moneys: Dexie.Table<IMoney, number>;

  constructor() {
    super("PeasantDB");

    this.version(1).stores({
      drinks: "++id, max, count, timestamp",
      moneys: "++id, total, totalTime",
    });

    this.drinks = this.table("drinks");
    this.moneys = this.table("moneys");
  }

  test() {
    this.drinks
      .add({
        max: 8,
        count: 0,
        timestamp: +new Date(),
      })
      .then(() => {
        return db.drinks.toCollection().last();
      })
      .then((res) => console.log(res));
  }

  getToday() {
    return new Date(new Date().toDateString());
  }

  /**
   * Get drink data.
   * @returns today's drink data
   */
  async getDrink() {
    const today = this.getToday();
    let todayDrink = await this.drinks.get({
      timestamp: +today,
    });
    if (!todayDrink) {
      const drinkCount = await this.drinks.count();
      if (drinkCount === 0) {
        // create default drink
        todayDrink = {
          max: 8,
          count: 0,
          timestamp: +today,
        };
        todayDrink.id = await this.drinks.add(todayDrink);
      } else {
        // copy yesterday's data to today
        const yesterdayDrink = await this.drinks.toCollection().last();
        todayDrink = {
          ..._.omit(yesterdayDrink, ["id", "count"]),
          count: 0,
          timestamp: +today,
        };
        todayDrink.id = await this.drinks.add(todayDrink);
      }
    }
    console.log("[db] get drink", todayDrink);
    return todayDrink;
  }

  async updateDrink(drink: IDrink) {
    await this.drinks.update(drink, _.pick(drink, ["count", "max"]));
    console.log("[db] update drink", drink);
  }
}

const db = new PeasantDB();

export function useDB(): PeasantDB {
  return db;
}
