// ID is a temporary solution
const [progress, progressId, setProgress] = useState(0);

document.getElementById('progress').setAttribute('value', progress());
document.getElementById('progress').setAttribute('data-reactive-id', progressId);

document.getElementById('increase-progress').onclick = () => {
    if (progress() < 100) {
        setProgress(prev => prev + 1);
    }
}

document.getElementById('decrease-progress').onclick = () => {
    if (progress() > 0) {
        setProgress(prev => prev - 1);
    }
}

document.getElementById('reset-progress').onclick = () => {
    setProgress(0);
}