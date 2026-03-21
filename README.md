# ReactiveJS - A Simple Reactive State (Pub/Sub Based)

A minimal reactive state utility built on a publish–subscribe pattern.
Each state variable keeps a list of subscriber callbacks.
Each subscriber is an object with 'callback' and 'dependencies' fields.
When the state of a variable changes, all subscriber callbacks of that variable are re-ran.

## Core Concepts

### 1. useState(initialValue)
Creates a stateful variable.

Returns:
  [getter, setter]

- getter() -> returns current value and keeps the stateful variable 'alive' via a closure.
- setter(newValue | updaterFn)

The setter accepts either:
  - a direct value
  - a function: (prevValue) => newValue. If the arg is a function, 
    current value of stateful variable is passed to that callback as a single arg.

### 2. setValue(variable, value)
Internal function used by the setter.
Updates the stored value and runs callbacks subscribed to the variable.

### 3. subscribe(deps, callback)
Subscribes a callback to all stateful variables passed as deps.

- deps: an array of stateful variable getters. The actual st. variable is attached to the getter.
- callback: function(...depsValues)

The callback runs every time the state of any dep updates.
Multiple callbacks can subscribe to the same state, and a callback can subscribe to multiple states.
When a callback is subscribed to multiple states, the subscriber object (callbacks + deps) is duplicated across all deps.

Example subscribers object structure:
```javascript
subscribers: {
  'count-var-id': [
      {
          'callback': (count) => document.getElementById('test-counter').setAttribute('value', count),
          'dependencies': ['count-var-id']
      },
          
      {
          'callback': (count, userName) => document.getElementById('click-info').innerHTML = `${userName} clicked ${count} times`,
          'dependencies': ['count-var-id', 'username-var-id']
      },
  ],
  'username-var-id': [
      {
          'callback': (userName) => document.getElementById('username').innerHTML = userName,
          'dependencies': ['username-var-id']
      },
          
      {
          'callback': (count, userName) => document.getElementById('click-info').innerHTML = `${userName} clicked ${count} times`,
          'dependencies': ['count-var-id', 'username-var-id']
      },
  ],
}
```

### 4. allStatefulVariables
allStatefulVariables is an object with all states stored as objects with id keys pointing to the state's reference.

## How It Works

- Each state variable has a unique id.
- A global "subscribers" object maps:
      stateId -> array of subscriber entries with 'callback' and 'dependencies' fields.
- When a state changes, all callbacks for that id are executed with dependencies passed as values, 
  in the same order as passed to subscribe function.

## Example

```javascript
const [count, setCount] = useState(0);

subscribe([count], (value) => {
    console.log("New value:", value);
});

setCount(5);            // sets value to 5
setCount(prev => prev + 1); // sets value to 6
```

## Notes

- Multiple dependencies are allowed per subscribe call. Even if only one dep is passed, it still must be wrapped in an array.
- A state variable can have multiple subscribers.
- Subscribers receive updated primitive values from their dependencies.
- No automatic DOM binding; DOM updates must be handled manually.
- If a callback subscribes to multiple dependencies, and two dependencies update sequentially, 
  the callback will run once per triggering dependency.

## To-do

- add the unsubscribe/destroyState functionality to clean up states that aren't needed anymore
