import { store } from './store.js';

const container = document.getElementById('shapes-container');
const countSquare = document.getElementById('count-square');
const countCircle = document.getElementById('count-circle');

const createShapeElement = (shape) => {
    const div = document.createElement('div');
    div.classList.add('shape', shape.type);
    div.style.backgroundColor = shape.color;
    // Kluczowe: używamy dataset do identyfikacji
    div.dataset.id = shape.id;
    return div;
};

const updateCounters = () => {
    const counts = store.getCounts();
    countSquare.textContent = counts.square;
    countCircle.textContent = counts.circle;
};

export const updateUI = (action, payload, currentState) => {
    switch (action) {
        case 'ADD':
            const newShapeEl = createShapeElement(payload);
            container.appendChild(newShapeEl);
            break;

        case 'REMOVE':
            const elementToRemove = document.querySelector(`.shape[data-id="${payload}"]`);
            if (elementToRemove) {
                elementToRemove.remove();
            }
            break;

        case 'RECOLOR':
            currentState.forEach(shape => {
                if (shape.type === payload) {
                    const el = document.querySelector(`.shape[data-id="${shape.id}"]`);
                    if (el) el.style.backgroundColor = shape.color;
                }
            });
            break;
            
        case 'INIT':
            container.innerHTML = '';
            currentState.forEach(shape => {
                container.appendChild(createShapeElement(shape));
            });
            break;
    }
    
    updateCounters();
};

export const initUI = () => {
    store.subscribe(updateUI);

    container.addEventListener('click', (e) => {
        const shapeEl = e.target.closest('.shape');
        if (shapeEl) {
            const id = shapeEl.dataset.id;
            store.removeShape(id);
        }
    });

    updateUI('INIT', null, store.getShapes());
};