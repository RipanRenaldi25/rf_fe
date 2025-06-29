import { createContext } from "react";

interface IShelfContext {
  shelfs: IShelf[];
  setShelfs: any;
}

export const ShelfContext = createContext<IShelfContext>({
  setShelfs: () => {},
  shelfs: [],
});
