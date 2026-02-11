// ID is a temporary solution
const [count, countId, setCount] = useState(0);

document.getElementById('counter').innerHTML = `<span data-reactive-id="${countId}">${count()}</span>`;
document.getElementById('button').onclick = () => {
    setCount(prev => prev + 1);
}