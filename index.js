// a collection of all stateful variables referenced by id
const allStatefulVariables = {};
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
        const callbackExpectedArguments = [];
        subscriber.dependencies.forEach(dependencyId => {
            const dependency = allStatefulVariables[dependencyId];
            callbackExpectedArguments.push(dependency.value);
        })
        subscriber.callback(...callbackExpectedArguments);
    })
}

const initSetValue = (variable) => {
    return (newValue) => setValue(variable, newValue);
}

const useState = (value) => {
    const variable = {
        value: null,
        id: crypto.randomUUID(),
    };

    allStatefulVariables[variable.id] = variable;

    setValue(variable, value);

    const getter = () => variable.value;
    getter._parent = variable;

    return [getter, initSetValue(variable)];
}

const subscribe = (deps, callback) => {
    // subscribe now must be called like subscribe([dep1, dep2], callback). 
    // if there's just one dep, the argument must still be an array: subscribe([singleDep], callback)
    // maybe consider typechecking 'deps' and allowing to pass an individual dep not in an array,
    // but for consistency with useEffect in React and scalability of the library (dep is a getter with parent, but in future
    // it may be a regular variable like in React) I'll force the array for now.

    const callbackExpectedArguments = [];
    const allDependencyIds = deps.map(dep => dep._parent.id);


    deps.forEach(dep => {
        dep = dep._parent;
        if (subscribers[dep.id] === undefined) {
            subscribers[dep.id] = [];
        }

        subscribers[dep.id].push(
            {
                'callback': callback,
                'dependencies': allDependencyIds
            }
        );

        callbackExpectedArguments.push(allStatefulVariables[dep.id].value);

    })

    callback(...callbackExpectedArguments);
}

export { useState, subscribe }