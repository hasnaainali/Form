import { persistReducer } from 'redux-persist'
import * as storageModule from 'redux-persist/lib/storage'
import { encryptTransform } from 'redux-persist-transform-encrypt'

const storage = storageModule.default.default

const persistConfig = {
  key: 'root',
  storage,
  whitelist: ['profile', 'sections'],
  transforms: [
    encryptTransform({
      secretKey: import.meta.env.VITE_PERSIST_ENCRYPTION_KEY,
      onError: (error) => {
        console.error('Persistence encryption error:', error)
      },
    }),
  ],
}

const persistedReducer = (rootReducer) =>
  persistReducer(persistConfig, rootReducer)

export default persistedReducer
