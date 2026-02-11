/* 
    A small reactive functionality making it easier to automatically update the UI.

    Usage:
        const [varName, varId, setVar] = useState(initialValue);

    Explanation:
        The 'variable' is an object that is kept in memory forever via closures. 
        Because the 'variable' object reference is stable (the "container" never changes), 
        its internal fields are stable and reliable targets for updates.

        'variable' fields:
        - 'value': Preserves the current state of the stateful variable.
        - 'id': A temporary solution to find DOM elements needing a refresh.
           (To be replaced by automatic <span> injection once the JSX parser is built).
        - 'isRenderableList' & 'listFunction': list-related fields.
          isRenderableList is needed to treat the variable differently during the update.
          listFunction is a function that renders the list in the component. It's called every time the variable is updated.

        Functions:
        - useState:
            Creates the stable 'variable' object.
            Returns:
            - getter(): A function that keeps 'variable' alive via closure and returns 
              the fresh value. To get the current value in code, it must be called.
              Example: const [count, id, setCount] = useState(0); console.log(count());
              (Made as a function to simplify the code and avoid complex Proxy/Getter 
              logic or full React-like re-rendering of the entire script).
              The getter also exposes a '_parent' property to allow external helpers 
              (like renderList) to access the 'variable' without passing it aroud every time. Must not be used in the UI.
            - id: The stable UUID for DOM elements which helps to find elements needing an update.
            - A callback that triggers setValue()  with newValue.

        - setValue:
            The updater engine. Accepts the stable 'variable' and the 'newValue'.
            'variable' is passed directly so setValue can update it without needing globals.
            'newValue' can be a raw value OR a function (reducer). 
                If it's a function, it's called with the current state to calculate the new one.
                Usage: setCount(prev => prev + 1);
            After updating the memory, it checks if a 'listFunction' exists to re-render 
            a complex list, otherwise it triggers a standard updateDOM() scan.

        - updateDOM:
            Scans the document for the specific 'data-reactive-id'. 
            - If 'data-reactive-attribute-name' is present, it updates that attribute (e.g., 'value' or 'class').
            - Otherwise, it updates the 'innerHTML' by default.

        - renderList:
            A helper to handle complex UI (like arrays of objects). It "upgrades" the 
            stable variable by attaching a custom render loop ('listFunction') to it.
*/

/*
To-do:
    - handle the first, empty DOM update right after the 'variable' initialization in setValue and useState
    - consider making state-dependent code as a function which can be rerendered
*/

const updateDOM = (variable) => {
    document.querySelectorAll(`[data-reactive-id="${variable.id}"]`)?.forEach(element => {
        if (element.hasAttribute('data-reactive-attribute-name')) {
            element.setAttribute(element.getAttribute('data-reactive-attribute-name'), variable.value);
        }

        else {
            element.innerHTML = variable.value;
        }
    });
}

const setValue = (variable, value) => {
    // checking if a variable is a renderable list.
    // if yes, then the rendering function is recalled
    if (variable.isRenderableList && variable.listFunction) {
        variable.value = value;
        variable.listFunction();
    }

    else {
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

        updateDOM(variable);
    }
}

const initSetValue = (variable) => {
    return (newValue) => setValue(variable, newValue);
}

const useState = (value) => {
    const variable = {
        value: null,
        id: crypto.randomUUID(),
    };

    setValue(variable, value);

    const getter = () => variable.value;
    getter._parent = variable;

    return [getter, variable.id, initSetValue(variable)];
}

const renderList = (getter, listFunction) => {
    getter._parent.isRenderableList = true;
    listFunction();
    getter._parent.listFunction = listFunction;
}