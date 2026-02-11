const [list, listId, setList] = useState([
    {
        heading: 'Hi',
        body: 'Helllo'
    },
    {
        heading: 'Bye',
        body: 'Goodbye'
    },
    {
        heading: 'Pls',
        body: 'Please'
    },
]);

renderList(list, () => {
    const listElements = [];
    list().forEach(item => {
        listElements.push(
            (document.createElement('li'))
                .innerHTML = `
                <h4>${item.heading}</h4>
                <p>${item.body}</p>
            `
        );
    });
    document.getElementById('list').innerHTML = listElements.join('')
})

document.getElementById('randomise-list').onclick = () => {
    // Helper to generate a random string of a specific length
    const randomStr = (len) => Math.random().toString(36).substring(2, 2 + len);

    // Create an array with a random length between 1 and 7
    const randomCount = Math.floor(Math.random() * 7) + 1;
    
    const newList = Array.from({ length: randomCount }, () => ({
        heading: `Title ${randomStr(4)}`,
        body: `Random content: ${randomStr(10)} ${randomStr(8)}`
    }));

    // Update your reactive state
    setList(newList);
};
