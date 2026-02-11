(async function () {
    const testComponent = await (await fetch('./test.jsx')).text();

    const rootElement = document.getElementById('root');
    rootElement.innerHTML = testComponent;
})()