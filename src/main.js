import './styles/workspace.css';
import { createStore } from './state/index.js';
import { mountWorkspace } from './ui/workspace.js';

const app = document.getElementById('app');
const store = createStore();

mountWorkspace(app, store);
