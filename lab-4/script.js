document.addEventListener('DOMContentLoaded', () => {
    const storageKey = 'kanban-data-v1';
    
    const board = document.querySelector('.board');
    const columns = {
        todo: document.querySelector('#col-todo .card-list'),
        inprogress: document.querySelector('#col-inprogress .card-list'),
        done: document.querySelector('#col-done .card-list')
    };


    const generateId = () => 'card-' + Date.now() + '-' + Math.floor(Math.random() * 1000);

    const getRandomColor = () => {
        const h = Math.floor(Math.random() * 360);
        return `hsl(${h}, 70%, 85%)`; // Pastelowe tło
    };

    const updateCounters = () => {
        Object.values(columns).forEach(list => {
            const count = list.children.length;
            const counterSpan = list.parentElement.querySelector('.counter');
            counterSpan.textContent = `(${count})`;
        });
    };

    const saveState = () => {
        const state = {
            todo: [],
            inprogress: [],
            done: []
        };

        for (const [key, list] of Object.entries(columns)) {
            Array.from(list.children).forEach(card => {
                state[key].push({
                    id: card.id,
                    text: card.querySelector('.card-content').innerText,
                    color: card.style.backgroundColor
                });
            });
        }
        localStorage.setItem(storageKey, JSON.stringify(state));
        updateCounters();
    };

    const createCardElement = (id, text, color) => {
        const div = document.createElement('div');
        div.className = 'card';
        div.id = id;
        div.style.backgroundColor = color || getRandomColor();
        
        div.innerHTML = `
            <div class="card-content" contenteditable="true">${text}</div>
            <div class="card-controls">
                <button class="card-btn btn-left" title="Przenieś w lewo">←</button>
                <button class="card-btn btn-color" title="Zmień kolor">🎨</button>
                <button class="card-btn btn-right" title="Przenieś w prawo">→</button>
                <button class="card-btn btn-delete" title="Usuń">✕</button>
            </div>
        `;

        const contentDiv = div.querySelector('.card-content');
        contentDiv.addEventListener('input', saveState);
        contentDiv.addEventListener('blur', saveState);

        return div;
    };

    const addCardToColumn = (columnKey, text = 'Nowe zadanie', color = null, id = null) => {
        const finalId = id || generateId();
        const finalColor = color || getRandomColor();
        const card = createCardElement(finalId, text, finalColor);
        columns[columnKey].appendChild(card);
        saveState();
    };

    const handleColumnAction = (e) => {
        const btn = e.target.closest('button');
        if (!btn) return;

        const columnSection = btn.closest('.column');
        const list = columnSection.querySelector('.card-list');
        const status = columnSection.dataset.status;

        if (btn.classList.contains('btn-add')) {
            addCardToColumn(status);
        } else if (btn.classList.contains('btn-color-col')) {
            Array.from(list.children).forEach(card => {
                card.style.backgroundColor = getRandomColor();
            });
            saveState();
        } else if (btn.classList.contains('btn-sort')) {
            const cards = Array.from(list.children);
            cards.sort((a, b) => {
                const textA = a.querySelector('.card-content').innerText.toLowerCase();
                const textB = b.querySelector('.card-content').innerText.toLowerCase();
                return textA.localeCompare(textB);
            });
            cards.forEach(card => list.appendChild(card));
            saveState();
        }
    };

    const handleCardAction = (e) => {
        const btn = e.target.closest('button');
        if (!btn) return;

        const card = btn.closest('.card');
        const currentList = card.parentElement;
        const currentColumn = currentList.closest('.column');
        const status = currentColumn.dataset.status;

        if (btn.classList.contains('btn-delete')) {
            if(confirm('Czy na pewno usunąć tę kartę?')) {
                card.remove();
                saveState();
            }
        } else if (btn.classList.contains('btn-color')) {
            card.style.backgroundColor = getRandomColor();
            saveState();
        } else if (btn.classList.contains('btn-left')) {
            if (status === 'inprogress') {
                columns.todo.appendChild(card);
            } else if (status === 'done') {
                columns.inprogress.appendChild(card);
            }
            saveState();
        } else if (btn.classList.contains('btn-right')) {
            if (status === 'todo') {
                columns.inprogress.appendChild(card);
            } else if (status === 'inprogress') {
                columns.done.appendChild(card);
            }
            saveState();
        }
    };

    board.addEventListener('click', (e) => {
        if (e.target.closest('.column-header')) {
            handleColumnAction(e);
        }
        else if (e.target.closest('.card-controls')) {
            handleCardAction(e);
        }
    });

    const loadState = () => {
        const stored = localStorage.getItem(storageKey);
        if (stored) {
            const state = JSON.parse(stored);
            for (const [key, cardsData] of Object.entries(state)) {
                cardsData.forEach(data => {
                    addCardToColumn(key, data.text, data.color, data.id);
                });
            }
        } else {
            addCardToColumn('todo', 'Witaj w Kanbanie!');
            addCardToColumn('inprogress', 'To zadanie jest w trakcie');
            addCardToColumn('done', 'A to już zrobione');
        }
        updateCounters();
    };

    loadState();
});