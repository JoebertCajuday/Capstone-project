import { QueryClient } from '@tanstack/react-query';
import { createContext } from 'react';

export const queryClient = new QueryClient();


export const AppStateContext = createContext();

const AppStateProvider = props => {

  const contextValue={...yourContext}

  return (
    <AppStateContext.Provider value={contextValue}>
      {props.children}
    </AppStateContext.Provider>
  );
};
