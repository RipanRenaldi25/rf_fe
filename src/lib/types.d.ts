interface ILoginPayload {
  email: string;
  password: string;
}

interface ILoginResponse {
  accessToken: string;
  refreshToken: string;
}

interface IRegisterPayload {
  company_name: string;
  phone_number: string;
  email: string;
  password: string;
  confirm_password: string;
}

interface IUser {
  name: string;
  company_name: string;
  email: string;
  password: string;
  phone_number: string;
  created_at: Date;
  updated_at: Date;
}

interface ITransaction {
  id: number;
  material_id: number;
  movement: "IN" | "OUT";
  stock: number;
  shelf_id: number;
  created_at: Date;
  updated_at: Date;
}

interface IMaterial {
  id: number;
  name: string;
  detail: string;
  color?: string;
  stock: number;
  type: "REUSE" | "REUTILIZATION" | "WASTE";
  created_at: Date;
  updated_at: Date;
}

interface IShelf {
  id: number;
  rack: string;
  number: number;
}

interface ITransactionWithMaterial extends ITransaction {
  material: IMaterial;
  shelf: IShelf;
}

/**
 * {
  "payload": {
    "name": "Bahan Baru",
    "color": "#fff",
    "detail": "ads",
    "stock": 3.3,
    "shelf_id": 4,
    "type": "REUSE"
  }
}
 */

interface IAddInventoryPayload {
  name: string;
  color: string;
  detail: string;
  stock: number;
  shelf_id: number;
  type: "REUSE" | "REUTILIZATION" | "WASTE";
}

interface IUser2 {
  id: string;
  name: string;
  email: string;
  phone_number: string;
  company_name: string;
}

interface ICalculatePayload {
  name: string;
  color: string;
  detail: string;
  pcs: number;
  requirementInPcs: number;
  type: "REUSE" | "REUTILIZATION" | "WASTE";
}

interface ICalculateResponse {
  filtered_inventory_transactions: any[];
  neededMaterialInKg: number;
  stockInInventory: number;
  totalNeededMaterialInKg: number;
}

interface ISummary {
  type: string;
  total: number;
}

interface IProduct {
  id: number;
  name: string;
  weight_required: number;
  user: IUser2;
}