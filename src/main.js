// Main application entry point
import { createApp } from 'https://unpkg.com/petite-vue@0.4.1/dist/petite-vue.es.js';
import { TimeTracker } from './time-tracker.js';

// Initialize the app
createApp({
  TimeTracker: new TimeTracker()
}).mount('#app');
