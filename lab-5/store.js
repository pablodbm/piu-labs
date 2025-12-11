import { generateId, getRandomColor } from './helpers.js';

class Store {
    constructor() {
        this.subscribers = [];
        this.state = this.loadFromStorage();
    }

    subscribe(observer) {
        this.subscribers.push(observer);
    }

    notify(actionType, payload) {
        this.saveToStorage();
        this.subscribers.forEach(observer => observer(actionType, payload, this.state));
    }


    getShapes() {
        return this.state;
    }
    getCounts() {
        return {
            square: this.state.filter(s => s.type === 'square').length,
            circle: this.state.filter(s => s.type === 'circle').length
        };
    }

    addShape(type) {
        const shape = {
            id: generateId(),
            type: type,
            color: getRandomColor()
        };
        this.state.push(shape);
        this.notify('ADD', shape);
    }

    removeShape(id) {
        this.state = this.state.filter(s => s.id !== id);
        this.notify('REMOVE', id);
    }

    recolorShapes(type) {
        this.state = this.state.map(shape => {
            if (shape.type === type) {
                return { ...shape, color: getRandomColor() };
            }
            return shape;
        });
        this.notify('RECOLOR', type);
    }


    saveToStorage() {
        localStorage.setItem('shapes-app-data', JSON.stringify(this.state));
    }

    loadFromStorage() {
        const data = localStorage.getItem('shapes-app-data');
        return data ? JSON.parse(data) : [];
    }
}

export const store = new Store();