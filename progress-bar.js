const [progress, setProgress] = useState(0);

const progressBarRef = document.getElementById('progress');

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

// we subscribe to 'progress' variable update, and pass a callback which accepts an array of deps passed in the same order, and destructurises them
// so we don't pass the primitive into a callback, but a reference to the dependency which will be passed

//upd: multiple deps and callbacks will be supported later. just one for now
subscribe(progress, (progress) => {
    progressBarRef.setAttribute('value', progress);
});