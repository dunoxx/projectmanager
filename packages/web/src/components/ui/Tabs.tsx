import React, { createContext, useContext, useState } from 'react';

// Tipos e interfaces
interface TabsContextType {
  value: string;
  onValueChange: (value: string) => void;
}

interface TabsProps {
  children: React.ReactNode;
  defaultValue: string;
  value?: string;
  onValueChange?: (value: string) => void;
  className?: string;
}

interface TabsListProps {
  children: React.ReactNode;
  className?: string;
}

interface TabsTriggerProps {
  children: React.ReactNode;
  value: string;
  className?: string;
  disabled?: boolean;
}

interface TabsContentProps {
  children: React.ReactNode;
  value: string;
  className?: string;
}

// Contexto para compartilhar o estado entre os componentes
const TabsContext = createContext<TabsContextType | undefined>(undefined);

const useTabs = () => {
  const context = useContext(TabsContext);
  if (!context) {
    throw new Error('Tabs compound components must be used within a Tabs component');
  }
  return context;
};

/**
 * Componente Tabs
 * Implementação simples de um sistema de abas para a interface
 */
const Tabs: React.FC<TabsProps> = ({ 
  children, 
  defaultValue, 
  value: controlledValue, 
  onValueChange, 
  className = '' 
}) => {
  const [value, setValue] = useState(defaultValue);

  const handleValueChange = (newValue: string) => {
    if (controlledValue === undefined) {
      setValue(newValue);
    }
    onValueChange?.(newValue);
  };

  return (
    <TabsContext.Provider
      value={{
        value: controlledValue !== undefined ? controlledValue : value,
        onValueChange: handleValueChange
      }}
    >
      <div className={`tabs ${className}`}>
        {children}
      </div>
    </TabsContext.Provider>
  );
};

/**
 * TabsList - Container para os botões das abas
 */
const TabsList: React.FC<TabsListProps> = ({ children, className = '' }) => {
  return (
    <div className={`flex border-b ${className}`}>
      {children}
    </div>
  );
};

/**
 * TabsTrigger - Botão para alternar entre as abas
 */
const TabsTrigger: React.FC<TabsTriggerProps> = ({ 
  children, 
  value, 
  className = '',
  disabled = false 
}) => {
  const { value: selectedValue, onValueChange } = useTabs();
  const isSelected = selectedValue === value;

  return (
    <button
      type="button"
      role="tab"
      className={`px-4 py-2 text-sm font-medium ${
        isSelected 
          ? 'border-b-2 border-primary text-primary' 
          : 'text-gray-500 hover:text-gray-700 hover:border-gray-300'
      } ${className} ${disabled ? 'opacity-50 cursor-not-allowed' : ''}`}
      onClick={() => !disabled && onValueChange(value)}
      disabled={disabled}
      aria-selected={isSelected}
    >
      {children}
    </button>
  );
};

/**
 * TabsContent - Conteúdo de cada aba
 */
const TabsContent: React.FC<TabsContentProps> = ({ 
  children, 
  value, 
  className = '' 
}) => {
  const { value: selectedValue } = useTabs();
  const isSelected = selectedValue === value;

  if (!isSelected) return null;

  return (
    <div 
      role="tabpanel"
      className={className}
    >
      {children}
    </div>
  );
};

export { Tabs, TabsList, TabsTrigger, TabsContent }; 