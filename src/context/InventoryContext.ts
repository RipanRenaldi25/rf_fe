import { createContext } from "react";

interface IInventoryContext {
  inventoryData: ITransactionWithMaterial[];
  setInventoryData: any;
}

export const InventoryContext = createContext<IInventoryContext>({
  inventoryData: [],
  setInventoryData: () => {},
});
