"use client";

import React, { createContext, useContext, useState } from "react";
import { ProductListItem } from "@/features/shop/actions";

interface ComparisonContextType {
  compareList: ProductListItem[];
  addToCompare: (product: ProductListItem) => void;
  removeFromCompare: (id: string) => void;
  clearCompare: () => void;
  isComparing: boolean;
  setIsComparing: (val: boolean) => void;
}

const ComparisonContext = createContext<ComparisonContextType | undefined>(undefined);

export function ComparisonProvider({ children }: { children: React.ReactNode }) {
  const [compareList, setCompareList] = useState<ProductListItem[]>([]);
  const [isComparing, setIsComparing] = useState(false);

  const addToCompare = (product: ProductListItem) => {
    if (compareList.find((p) => p.id === product.id)) return;
    if (compareList.length >= 4) {
      alert("Seekers can only compare up to 4 essences at once.");
      return;
    }
    setCompareList((prev) => [...prev, product]);
  };

  const removeFromCompare = (id: string) => {
    setCompareList((prev) => prev.filter((p) => p.id !== id));
  };

  const clearCompare = () => {
    setCompareList([]);
    setIsComparing(false);
  };

  return (
    <ComparisonContext.Provider value={{ 
      compareList, 
      addToCompare, 
      removeFromCompare, 
      clearCompare,
      isComparing,
      setIsComparing
    }}>
      {children}
    </ComparisonContext.Provider>
  );
}

export function useComparison() {
  const context = useContext(ComparisonContext);
  if (context === undefined) {
    throw new Error("useComparison must be used within a ComparisonProvider");
  }
  return context;
}
