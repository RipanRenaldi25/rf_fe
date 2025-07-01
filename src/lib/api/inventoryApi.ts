"use client";
import { addCrashToString, changeComaToDot, handleError } from "../utils";
import axiosInstance from "./axiosInstance";

export const fetchData = async (
  query: string,
  functionName: string,
  variables?: any
): Promise<{ success: boolean; message: string; data?: any }> => {
  try {
    const response = await axiosInstance.post(
      `${process.env.NEXT_PUBLIC_GRAPHQL_URL}`,
      {
        query: query,
        variables,
      },
      {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
        },
      }
    );
    const { data } = response.data;

    return {
      success: true,
      message: "Data fetched",
      data: data[functionName],
    };
  } catch (err: any) {
    return handleError(err);
  }
};

export const getAllInventories = async () => {
  return await fetchData(
    `
            query getAllInventoryTransactions($filter: SearchFilter) {
                getInventoryTransactions(filter: $filter) {
                    skip
                    take
                    currentPage
                    total
                    data {
                    id
                    stock
                    movement
                    created_at
                    updated_at
                    material {
                        name
                        detail
                        color
                        type
                        }
                    shelf {
                        id
                        rack
                        number
                    }
                    }
                }
                }
        `,
    "getInventoryTransactions"
  );
};

export const getShelfs = async (): Promise<{
  success: boolean;
  message: string;
  data?: IShelf[];
}> => {
  try {
    const response = await axiosInstance.post(
      `${process.env.NEXT_PUBLIC_GRAPHQL_URL}`,
      {
        query: `
      query getShelfs {
        getShelfsBelongsToUser {
          id
          number
          rack
        }
      }
      `,
      },
      {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
        },
      }
    );
    const { data } = response.data;
    const shelfsData: IShelf[] = data.getShelfsBelongsToUser;

    return { success: true, message: "Shelfs fetched", data: shelfsData };
  } catch (err: any) {
    return handleError(err);
  }
};

export const addMaterial = async (
  payload: IAddInventoryPayload
): Promise<{
  success: boolean;
  message: string;
  data?: any;
}> => {
  try {
    const crashedColor = addCrashToString(payload.color);
    const response = await axiosInstance.post(
      `${process.env.NEXT_PUBLIC_GRAPHQL_URL}`,
      {
        query: `
      mutation addMaterial($payload: AddMaterialPayload) {
        addMaterial(payload: $payload) {
          id
          name
          detail
          color
          stock
          type
          user_id
          created_at
          updated_at
          inventory_transactions {
            id
            material_id
            movement
            stock
            shelf_id
            shelf {
              id
              rack
              number
            }
            created_at
            updated_at
          }
        }
      }
    `,
        variables: {
          payload: {
            ...payload,
            color: crashedColor,
          },
        },
      },
      {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
        },
      }
    );
    const { data } = response.data;
    return {
      success: true,
      message: "Bahan berhasil dimasukkan ke gudang",
      data: data.addMaterial,
    };
  } catch (err: any) {
    return handleError(err);
  }
};

export const addRact = async (
  payload: Omit<IShelf, "id">
): Promise<{ success: boolean; message: string; data?: any }> => {
  try {
    const response = await axiosInstance.post(
      `${process.env.NEXT_PUBLIC_GRAPHQL_URL}`,
      {
        query: `
          mutation addShelf($payload: AddShelfPayload){
            addShelf(payload: $payload) {
              id
              rack
              number
            }
          }
        `,
        variables: {
          payload,
        },
      },
      {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
        },
      }
    );
    const { data } = response.data;

    return {
      success: true,
      message: `Rak ${payload.rack}${payload.number} added`,
      data: data.addShelf,
    };
  } catch (err: any) {
    return handleError(err);
  }
};

export const releaseMaterial = async (
  inventoryTransactionId: number,
  payload: {
    shelf_id: number;
    stock: number;
  }
): Promise<{
  success: boolean;
  message: string;
  data?: any;
}> => {
  try {
    const response = await axiosInstance.post(
      `${process.env.NEXT_PUBLIC_GRAPHQL_URL}`,
      {
        query: `
       
       mutation releaseMaterial($inventoryTransactionId: Int!, $payload: UpdateInventoryPayload) {
        releaseMaterial(inventory_transaction_id: $inventoryTransactionId, payload: $payload) {
          id
          movement
          stock
          created_at
          updated_at
          shelf {
            id
            rack
            number
          }
          material {
            name
            detail
            color
            type
            created_at
            updated_at
          }
        }
      }`,
        variables: {
          inventoryTransactionId,
          payload: {
            movement: "OUT",
            shelf_id: payload.shelf_id,
            stock: payload.stock,
          },
        },
      },
      {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
        },
      }
    );
    const { data } = response.data;
    return {
      success: true,
      message: "Bahan berhasil dikeluarkan dari gudang",
      data: data.releaseMaterial,
    };
  } catch (err: any) {
    return handleError(err);
  }
};

export const getInventoryTransactionsBelongToMaterial = async (payload: {
  name: string;
  detail?: string;
  color?: string;
  type: "REUSE" | "REUTILIZATION" | "WASTE";
}): Promise<{ success: boolean; message: string; data?: any }> => {
  try {
    const response = await axiosInstance.post(
      `${process.env.NEXT_PUBLIC_GRAPHQL_URL}`,
      {
        query: `
      query getInventoryTransaction( $payload: SearchMaterialPayload) {
        getInventoryBelongToMaterial( payload: $payload) {
          id
          name
          detail
          color
          type
          filtered_inventory_transactions {
            id
            movement
            stock
            created_at
            updated_at
            shelf {
              id
              rack
              number
            }
            material {
              id
              name
              color
              detail
              type
              created_at
            updated_at
            }
          }
        }
      }
      `,
        variables: {
          payload,
        },
      },
      {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
        },
      }
    );
    const { data } = response.data;

    return {
      success: true,
      message: "Inventory transaction fetched",
      data:
        data.getInventoryBelongToMaterial?.filtered_inventory_transactions ??
        [],
    };
  } catch (err: any) {
    return handleError(err);
  }
};

export const calculate = async (
  payload: ICalculatePayload
): Promise<{
  success: boolean;
  message: string;
  data?: any;
}> => {
  try {
    const response = await axiosInstance.post(
      `${process.env.NEXT_PUBLIC_GRAPHQL_URL}`,
      {
        query: `
          query calculateInKg($payload: calculatePCSInKg, $material: SearchMaterialPayload) {
            calculateMaterialNeededInKg(payload: $payload, material: $material) {
              totalNeededMaterialInKg
              stockInInventory
              neededMaterialInKg
              filtered_inventory_transactions {
                  id
                  movement
                  stock
                  created_at
                  updated_at
                  shelf {
                    id
                    rack
                    number
                  }
                  material {
                    id
                    name
                    color
                    detail
                    type
                    created_at
                  updated_at
                  }
                }
            }
          }
      `,
        variables: {
          payload: {
            pcs: payload.pcs,
            requirementInPcs: payload.requirementInPcs,
          },
          material: {
            name: payload.name,
            color: payload.color,
            detail: payload.detail,
            type: payload.type,
          },
        },
      },
      {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
        },
      }
    );

    const { data } = response.data;

    return {
      success: true,
      message: "Data fetched",
      data: data.calculateMaterialNeededInKg,
    };
  } catch (err: any) {
    return handleError(err);
  }
};

export const getSeededData = async (): Promise<{
  success: boolean;
  message: string;
  data?: any;
}> => {
  try {
    const response = await axiosInstance.post(
      `${process.env.NEXT_PUBLIC_GRAPHQL_URL}`,
      {
        query: `
        mutation seedMaterial {
          seedMaterialCalculator {
            id
            name
            weight_required
            user_id
          }
        }
      `,
      },
      {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
        },
      }
    );
    const { data } = response.data;

    return {
      success: true,
      message: "Data calculator seeded",
      data: data.seedMaterialCalculator,
    };
  } catch (err: any) {
    return handleError(err);
  }
};

export const deleteProduct = async (
  id: number
): Promise<{
  success: boolean;
  message: string;
  data?: any;
}> => {
  try {
    const response = await axiosInstance.post(
      `${process.env.NEXT_PUBLIC_GRAPHQL_URL}`,
      {
        query: `
      mutation deleteProduct($id: Int!) {
        deleteProduct(id: $id) {
          id
          name
          weight_required
        }
      }
      `,
        variables: {
          id: +id,
        },
      },
      {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
        },
      }
    );

    const { data } = response.data;

    return {
      success: true,
      message: "Produk berhasil di hapus",
      data: data.deleteProduct,
    };
  } catch (err: any) {
    return handleError(err);
  }
};

export const searchProduct = async (
  payload?:
    | { id?: number; name?: string; page?: number; size?: number }
    | undefined
): Promise<{
  success: boolean;
  message: string;
  data?: any;
}> => {
  try {
    const page = payload?.page ?? 1;
    const size = payload?.size ?? 10;
    const response = await axiosInstance.post(
      `${process.env.NEXT_PUBLIC_GRAPHQL_URL}`,
      {
        query: `
      query searchProduct($payload: SearchProduct) {
        searchProduct(payload: $payload) {
        totalData
          products {
          id
          name
          weight_required
          user {
            id
            name
          }
          }
        }
      }
      `,
        variables: {
          payload: {
            ...payload,
            page,
            size,
          },
        },
      },
      {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
        },
      }
    );

    const { data } = response.data;

    return {
      success: true,
      message: "Produk didapatkan",
      data: data.searchProduct,
    };
  } catch (err: any) {
    return handleError(err);
  }
};

export const addProduct = async (value: {
  name: string;
  weight_required: number;
}): Promise<{ success: boolean; message: string; data?: any }> => {
  try {
    const response = await axiosInstance.post(
      `${process.env.NEXT_PUBLIC_GRAPHQL_URL}`,
      {
        query: `
        mutation addProduct($payload: AddProduct) {
          addProduct(payload: $payload) {
            id
            name
            weight_required
            user {
              id
              name
            }
          }
        }
        `,
        variables: {
          payload: {
            ...value,
          },
        },
      },
      {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
        },
      }
    );

    const { data } = response.data;

    return {
      success: true,
      message: "Produk berhasil ditambahkan",
      data: data.addProduct,
    };
  } catch (err: any) {
    return handleError(err);
  }
};
