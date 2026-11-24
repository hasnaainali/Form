import { configureStore, combineReducers } from '@reduxjs/toolkit'
import { persistStore } from 'redux-persist'

import profileReducer from './profileSlice'
import sectionsReducer from './sectionsSlice'
import persistedReducer from './persistReducer'

const rootReducer = combineReducers({
  profile: profileReducer,
  sections: sectionsReducer,
})

const persistedRootReducer = persistedReducer(rootReducer)

export const store = configureStore({
  reducer: persistedRootReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false,
    }),
})

export const persistor = persistStore(store)