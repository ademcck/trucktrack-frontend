'use client';
import { configureStore } from '@reduxjs/toolkit'
import MainSliceReducer from './reducers/app/Main'

export const store = configureStore({
  reducer: {
    main: MainSliceReducer,
  },
})