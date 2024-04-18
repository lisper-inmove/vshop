import { Commodity } from "@prisma/client";
import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";

type ShoppingCart = {
  commodities: Commodity[]; // 这应该是一个商品数组，而不是单个商品
};

interface ShoppingCartState {
  shoppingCart: ShoppingCart;
  addCommodity: (commodity: Commodity) => void; // 参数类型改为 Commodity
  removeCommodity: (commodity: Commodity) => void; // 根据商品 ID 移除商品
  hasCommodity: (commodity: Commodity) => boolean;
}

const useShoppingCart = create<ShoppingCartState>()(
  persist(
    (set, get) => ({
      shoppingCart: { commodities: [] }, // 初始化购物车为空
      addCommodity: (commodity: Commodity) => {
        set((state) => {
          // 防止添加重复的商品
          if (
            !state.shoppingCart.commodities.find((c) => c.id === commodity.id)
          ) {
            return {
              shoppingCart: {
                commodities: [...state.shoppingCart.commodities, commodity],
              },
            };
          }
          return { ...state };
        });
      },
      removeCommodity: (commodity: Commodity) => {
        set((state) => {
          // 移除指定的商品
          const updatedCommodities = state.shoppingCart.commodities.filter(
            (c) => commodity.id !== c.id,
          );
          return {
            shoppingCart: {
              commodities: updatedCommodities,
            },
          };
        });
      },
      hasCommodity: (commodity: Commodity) => {
        const state = get();
        return state.shoppingCart.commodities.some(
          (c) => c.id === commodity.id,
        );
      },
    }),
    {
      name: "shopping-cart-storage", // 指定持久化存储的键名，这里做了适当修改以更明确
      storage: createJSONStorage(() => sessionStorage), // 使用sessionStorage进行持久化
    },
  ),
);

export default useShoppingCart;
