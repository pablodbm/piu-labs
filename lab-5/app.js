import { store } from './store.js';
import { initUI } from './ui.js';

initUI();


document.getElementById('add-square').addEventListener('click', () => {
    store.addShape('square');
});

document.getElementById('add-circle').addEventListener('click', () => {
    store.addShape('circle');
});

document.getElementById('recolor-squares').addEventListener('click', () => {
    store.recolorShapes('square');
});

document.getElementById('recolor-circles').addEventListener('click', () => {
    store.recolorShapes('circle');
});