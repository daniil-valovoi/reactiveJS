/**
 * Simple Reactive State (Pub/Sub Based)
 * --------------------------------------
 *
 * A minimal reactive state utility built on a publish–subscribe pattern.
 * Each state variable keeps a list of subscriber callbacks.
 * When the state changes, all subscribers are notified with the new value.
 *
 *
 * Core Concepts
 * -------------
 *
 * 1. useState(initialValue)
 *    Creates a stateful variable.
 *
 *    Returns:
 *      [getter, setter]
 *
 *    - getter() -> returns current value and keeps the stateful variable 'alive' via a closure.
 *    - setter(newValue | updaterFn)
 *
 *    The setter accepts either:
 *      - a direct value
 *      - a function: (prevValue) => newValue. If the arg is a function, current value of stateful variable is passed to that callback as a single arg.
 *
 *
 * 2. setValue(variable, value)
 *    Internal function used by the setter.
 *    Updates the stored value and runs callbacks subscribed to the variable.
 *
 *
 * 3. subscribe(getter, callback)
 *    Subscribes a callback to a state variable.
 *
 *    - getter: the getter returned by useState
 *    - callback: function(newValue)
 *
 *    The callback runs every time the state updates.
 *    Multiple callbacks can subscribe to the same state.
 * 
 *    Example subscribers object structure:
 *    subscribers: {
 *      'id-123': [
 *              (count) => document.getElementById('test-counter').setAttribute('value', count),
 *              (todoItems) => document.getElementById('test-todo').innerHTML = todoItems.toString()
 *          ]
 *    }
 *
 *
 * How It Works
 * ------------
 *
 * - Each state variable has a unique id.
 * - A global "subscribers" object maps:
 *       stateId -> array of callbacks
 * - When a state changes, all callbacks for that id are executed.
 *
 *
 * Example
 * -------
 *
 * const [count, setCount] = useState(0);
 *
 * subscribe(count, (value) => {
 *     console.log("New value:", value);
 * });
 *
 * setCount(5);            // sets value to 5
 * setCount(prev => prev + 1); // sets value to 6
 *
 *
 * Notes
 * -----
 *
 * - Only one dependency per subscribe call.
 * - A state variable can have multiple subscribers.
 * - Subscribers receive the updated primitive value.
 * - No automatic DOM binding; updates must be handled manually.
 *
 */


/*
To-do:
    - handle the first, empty DOM update right after the 'variable' initialization in setValue and useState
    - maybe use web components
*/

const subscribers = {};

const setValue = (variable, value) => {

    // a variable can be both new value and a callback returning a new value
    // if a value is a callback, we must pass the current state of the stateful variable

    switch (typeof (value)) {
        case 'function':
            variable.value = value(variable.value);
            break;
        default:
            variable.value = value;
            break;
    }

    subscribers[variable.id]?.forEach(subscriber => {
        typeof (subscriber) === 'function' && subscriber(variable.value);
    })
}

const initSetValue = (variable) => {
    return (newValue) => setValue(variable, newValue);
}

const useState = (value) => {
    const variable = {
        value: null,
        id: crypto.randomUUID(),
        _subscribers: [],
    };

    setValue(variable, value);

    const getter = () => variable.value;
    getter._parent = variable;

    return [getter, initSetValue(variable)];
}

const subscribe = (dep, callback) => {
    dep = dep._parent;
    if(subscribers[dep.id] === undefined) {
        subscribers[dep.id] = [];
    }

    subscribers[dep.id].push(callback);
    callback(dep.value);
}