// test-components.js
// Test/demo components for the reactive library

// --- Counter Demo ---
// This demo shows a simple counter. The count value is stored in a reactive state variable.
// Whenever the count changes, the displayed number updates automatically.
// The Increase, Decrease, and Reset buttons update the state using the provided setter.
const [counterState, setCounterState] = useState(0);

const counterValueElement = document.getElementById('counter-value');
const counterIncreaseButton = document.getElementById('counter-increase');
const counterDecreaseButton = document.getElementById('counter-decrease');
const counterResetButton = document.getElementById('counter-reset');

subscribe(counterState, (currentValue) => {
    counterValueElement.textContent = currentValue;
});

counterIncreaseButton.onclick = () => setCounterState(previousValue => previousValue + 1);
counterDecreaseButton.onclick = () => setCounterState(previousValue => previousValue - 1);
counterResetButton.onclick = () => setCounterState(0);

// --- Todo List Demo ---
// This demo implements a simple todo list. The list of todos is stored in a reactive state variable (an array).
// When you add a new todo, the state is updated and the list in the UI is re-rendered automatically.
// Clicking a todo item removes it from the list. All updates are handled through the reactive state.
const [todoListState, setTodoListState] = useState([]);
const todoInputElement = document.getElementById('todo-input');
const todoAddButton = document.getElementById('todo-add');
const todoListElement = document.getElementById('todo-list');

subscribe(todoListState, (todoItems) => {
    todoListElement.innerHTML = '';
    todoItems.forEach((todoText, todoIndex) => {
        const listItemElement = document.createElement('li');
        listItemElement.textContent = todoText;
        listItemElement.onclick = () => setTodoListState(currentList => currentList.filter((_, i) => i !== todoIndex));
        listItemElement.title = 'Click to remove this todo';
        todoListElement.appendChild(listItemElement);
    });
});

todoAddButton.onclick = () => {
    const inputValue = todoInputElement.value.trim();
    if (inputValue) {
        setTodoListState(currentList => [...currentList, inputValue]);
        todoInputElement.value = '';
    }
};

todoInputElement.addEventListener('keydown', event => {
    if (event.key === 'Enter') todoAddButton.onclick();
});

// --- Attribute Binding Demo ---
// This demo shows how to bind a state variable to an element's attribute.
// The input value is stored in a reactive state variable. The Submit button is enabled only when the input is not empty.
// When the button is clicked, the current value is shown in an alert and the input is cleared.
const [inputValueState, setInputValueState] = useState('');
const attributeInputElement = document.getElementById('attr-input');
const attributeSubmitButton = document.getElementById('attr-btn');

subscribe(inputValueState, (currentInputValue) => {
    attributeSubmitButton.disabled = currentInputValue.trim().length === 0;
});

attributeInputElement.addEventListener('input', event => {
    setInputValueState(event.target.value);
});

attributeSubmitButton.onclick = () => {
    alert('Submitted: ' + inputValueState());
    setInputValueState('');
    attributeInputElement.value = '';
};
