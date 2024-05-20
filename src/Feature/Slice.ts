import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface YourFeatureState {
  value: number;
}

const initialState: YourFeatureState = {
  value: 0,
};

const yourSlice = createSlice({
  name: 'yourFeature',
  initialState,
  reducers: {
    increment: (state) => {
      state.value += 1;
    },
    decrement: (state) => {
      state.value -= 1;
    },
    incrementByAmount: (state, action: PayloadAction<number>) => {
      state.value += action.payload;
    },
  },
});

export const { increment, decrement, incrementByAmount } = yourSlice.actions;

export default yourSlice.reducer;
