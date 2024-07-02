import {configureStore} from '@reduxjs/toolkit'
import userSlice from './reducers.js'


export const store = configureStore({
    reducer:userSlice
})