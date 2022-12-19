import React, {useState} from 'react';
import { StyleSheet, View, Text, StatusBar } from 'react-native';
import AppNavigation from './routes/navigation';
import { QueryClientProvider } from '@tanstack/react-query';
import { queryClient } from './lib/global-utils';


export default function App() {
  
  return (
    <>
      <QueryClientProvider client={queryClient}>
          <AppNavigation/>
      </QueryClientProvider>
    </>
  );
}
