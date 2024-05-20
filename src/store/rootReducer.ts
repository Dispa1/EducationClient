import { combineReducers } from '@reduxjs/toolkit';
import SliceReducer from '../Feature/Slice';

const rootReducer = combineReducers({
  Feature: SliceReducer,
  // Добавьте другие редьюсеры здесь
});

export default rootReducer;
