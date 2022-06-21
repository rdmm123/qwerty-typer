const getText = async (lang='spanish') => {
    const url = '/api/generate?' + new URLSearchParams({lang});
    let resp = await fetch(url);
    resp = await resp.json();
    return resp['text'];
}

const checkInput = (event) => {
    decreaseIfBackspace(event);
    const text = document.querySelector('.text-div').innerText;
    const wrongText = document.querySelector('.text-wrong').innerText;
    const currentLetter = text.charAt(charCount);

    const prompLetter = event.key;
    if (currentLetter !== prompLetter || wrongText.length > 0) {
       return addKeyToWrong(event);
    }

    addKeyToCorrect();
    charCount++;
    if (charCount === text.length) return resetText();
    if (prompLetter === ' ') {
        event.target.value = ''
        if(event.preventDefault) event.preventDefault();
        return false;
    }
}

const addKeyToCorrect = () => {
    const text = document.querySelector('.text-to-write');
    const written = document.querySelector('.text-written');


    const newText = text.innerText.slice(1);
    written.innerHTML += text.innerText.charAt(0);
    text.innerHTML = newText;
}

const addKeyToWrong = ({ keyCode, key }) => {
    const text = document.querySelector('.text-to-write');
    const wrong = document.querySelector('.text-wrong');
    if (keyIsLetter({ keyCode, key })) {
        const newText = text.innerText.slice(1);
        wrong.innerHTML += text.innerText.charAt(0);
        text.innerHTML = newText;
    }
}

const keyIsLetter = ({ key}) => key.length === 1;

const getCharsToDelete = (promptText) => {
    let spaceCounter = 0;
    for (let i = promptText.length - 1; i >= 0; i--) {
        const c = promptText.charAt(i);
        if (c !== ' ') break;
        spaceCounter++;
    }
    const promptWords = promptText.match(/[\w-']+|[^\w\s]+/g);
    const purgedWords = promptWords !== null ? promptWords.filter(word => word.length > 0) : [];
    return purgedWords.length > 0 ? purgedWords[purgedWords.length - 1].length + spaceCounter : spaceCounter;
}

const decreaseIfBackspace = ({ key, ctrlKey }) => {
    if (key !== 'Backspace') return

    const textToWrite = document.querySelector('.text-to-write');
    const wrong = document.querySelector('.text-wrong');
    const written = document.querySelector('.text-written');
    const prompt = document.getElementById('prompt');

    const n = ctrlKey ? getCharsToDelete(prompt.value) : 1;

    for (let i = 0; i < n; i++) {
        const text = textToWrite.innerText;
        const wrongText = wrong.innerText;
        const writtenText = written.innerText;

        if (wrongText.length > 0) {
            wrong.innerHTML = wrongText.slice(0, -1);
            textToWrite.innerHTML = wrongText.slice(-1) + text;
        } else if (charCount > 0) {
            charCount--;
            written.innerHTML = writtenText.slice(0, -1);
            textToWrite.innerHTML = writtenText.slice(-1) + text;
        }
    }
}

const setNewText = async () => {
    charCount = 0;
    const prompt = document.getElementById('prompt');
    const resetButton = document.getElementById('reset_text');
    prompt.disabled = true;
    resetButton.disabled = true;
    try {
        const generatedText = await getText();
        document.getElementById('text-to-write').innerText = generatedText.trim();
    } catch (err) {
        throw err;
    } finally {
        prompt.disabled = false;
        resetButton.disabled = false;
        prompt.focus();
        timer.start();
    }
}

const resetText = () => {
    document.querySelector('.text-written').innerHTML = '';
    document.querySelector('.text-wrong').innerHTML = '';
    document.querySelector('.text-to-write').innerHTML = '';
    document.getElementById('prompt').value = '';
    timer.stop();
    setNewText();
}

const updateCounter = () => {
    document.getElementById('seconds').innerHTML = String(timer.getTimeValues().seconds).padStart(2, '0');
    document.getElementById('minutes').innerHTML = String(timer.getTimeValues().minutes).padStart(2, '0');
    const cpm = charCount / (timer.getTotalTimeValues().seconds / 60);
    document.getElementById('cpm').innerHTML = cpm.toFixed(1);
    document.getElementById('wpm').innerHTML = (cpm / 5).toFixed(1);
}

let charCount;
const timer = new easytimer.Timer();
timer.addEventListener('secondsUpdated', updateCounter)
setNewText();
document.getElementById('prompt').addEventListener('keydown', (event) => checkInput(event));
document.getElementById('reset_text').addEventListener('click', resetText);