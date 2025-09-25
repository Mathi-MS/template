import { createContext, useContext, useState, ReactNode } from "react";

interface BreadcrumbItem {
  label: string;
  path?: string;
  isActive?: boolean;
}

interface BreadcrumbContextType {
  customItems: BreadcrumbItem[];
  setCustomItems: (items: BreadcrumbItem[]) => void;
  addCustomItem: (item: BreadcrumbItem) => void;
  clearCustomItems: () => void;
}

const BreadcrumbContext = createContext<BreadcrumbContextType | undefined>(
  undefined
);

interface BreadcrumbProviderProps {
  children: ReactNode;
}

export const BreadcrumbProvider = ({ children }: BreadcrumbProviderProps) => {
  const [customItems, setCustomItems] = useState<BreadcrumbItem[]>([]);

  const addCustomItem = (item: BreadcrumbItem) => {
    setCustomItems((prev) => [...prev, item]);
  };

  const clearCustomItems = () => {
    setCustomItems([]);
  };

  return (
    <BreadcrumbContext.Provider
      value={{
        customItems,
        setCustomItems,
        addCustomItem,
        clearCustomItems,
      }}
    >
      {children}
    </BreadcrumbContext.Provider>
  );
};

export const useBreadcrumb = () => {
  const context = useContext(BreadcrumbContext);
  if (context === undefined) {
    throw new Error("useBreadcrumb must be used within a BreadcrumbProvider");
  }
  return context;
};
