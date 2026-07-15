import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  activeDesignId: null,
  templateId: null,
  title: 'Untitled Design',
  dimensions: { width: 1080, height: 1080 },
  background: '#ffffff',
  layers: [],
  selectedLayerIds: [],
  zoom: 1, // 0.25 to 3
  history: [],
  historyIndex: -1,
  isDirty: false,
};

const saveHistory = (state) => {
  // Limit history to 50 steps
  const newHistory = state.history.slice(0, state.historyIndex + 1);
  newHistory.push(JSON.stringify({ layers: state.layers, background: state.background, dimensions: state.dimensions }));
  if (newHistory.length > 50) newHistory.shift();
  state.history = newHistory;
  state.historyIndex = newHistory.length - 1;
  state.isDirty = true;
};

const studioSlice = createSlice({
  name: 'studio',
  initialState,
  reducers: {
    setDesign: (state, action) => {
      const { id, templateId, title, dimensions, background, layers } = action.payload;
      state.activeDesignId = id || null;
      state.templateId = templateId || null;
      state.title = title || 'Untitled Design';
      state.dimensions = dimensions || { width: 1080, height: 1080 };
      state.background = background || '#ffffff';
      state.layers = layers || [];
      state.selectedLayerIds = [];
      state.zoom = 1;
      state.history = [JSON.stringify({ layers: state.layers, background: state.background, dimensions: state.dimensions })];
      state.historyIndex = 0;
      state.isDirty = false;
    },
    updateBackground: (state, action) => {
      state.background = action.payload;
      saveHistory(state);
    },
    updateDimensions: (state, action) => {
      state.dimensions = action.payload;
      saveHistory(state);
    },
    addLayer: (state, action) => {
      state.layers.push({ ...action.payload, zIndex: state.layers.length });
      state.selectedLayerIds = [action.payload.id];
      saveHistory(state);
    },
    updateLayer: (state, action) => {
      const { id, updates } = action.payload;
      const layer = state.layers.find((l) => l.id === id);
      if (layer) {
        Object.assign(layer, updates);
        saveHistory(state);
      }
    },
    deleteLayer: (state, action) => {
      const id = action.payload;
      state.layers = state.layers.filter((l) => l.id !== id);
      state.selectedLayerIds = state.selectedLayerIds.filter((selId) => selId !== id);
      saveHistory(state);
    },
    selectLayer: (state, action) => {
      const { id, multiSelect = false } = action.payload;
      if (!id) {
        state.selectedLayerIds = [];
        return;
      }
      if (multiSelect) {
        if (state.selectedLayerIds.includes(id)) {
          state.selectedLayerIds = state.selectedLayerIds.filter((selId) => selId !== id);
        } else {
          state.selectedLayerIds.push(id);
        }
      } else {
        state.selectedLayerIds = [id];
      }
    },
    reorderLayer: (state, action) => {
      const { id, direction } = action.payload;
      const index = state.layers.findIndex((l) => l.id === id);
      if (index === -1) return;

      const newIndex = direction === 'up' ? index + 1 : index - 1;
      if (newIndex >= 0 && newIndex < state.layers.length) {
        const temp = state.layers[index];
        state.layers[index] = state.layers[newIndex];
        state.layers[newIndex] = temp;
        // Fix zIndex
        state.layers.forEach((l, i) => { l.zIndex = i; });
        saveHistory(state);
      }
    },
    undo: (state) => {
      if (state.historyIndex > 0) {
        state.historyIndex -= 1;
        const previousState = JSON.parse(state.history[state.historyIndex]);
        state.layers = previousState.layers;
        state.background = previousState.background;
        state.dimensions = previousState.dimensions;
        state.selectedLayerIds = [];
        state.isDirty = true;
      }
    },
    redo: (state) => {
      if (state.historyIndex < state.history.length - 1) {
        state.historyIndex += 1;
        const nextState = JSON.parse(state.history[state.historyIndex]);
        state.layers = nextState.layers;
        state.background = nextState.background;
        state.dimensions = nextState.dimensions;
        state.selectedLayerIds = [];
        state.isDirty = true;
      }
    },
    setZoom: (state, action) => {
      state.zoom = Math.max(0.25, Math.min(3, action.payload));
    },
    clearDirtyStatus: (state) => {
      state.isDirty = false;
    }
  },
});

export const {
  setDesign, updateBackground, updateDimensions, addLayer, updateLayer,
  deleteLayer, selectLayer, reorderLayer, undo, redo, setZoom, clearDirtyStatus
} = studioSlice.actions;

export default studioSlice.reducer;
