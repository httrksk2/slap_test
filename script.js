let sessionCount = 0;
let sessionCounts = [{ slaps: 0, chars: 0, cheated: false }, { slaps: 0, chars: 0, cheated: false }, { slaps: 0, chars: 0, cheated: false }];

document.getElementById('startButton').addEventListener('click', function() {
    this.style.display = 'none';
    startSession();
});

function startSession() {
    if (sessionCount < 3) {
        countdown(3, startTypingSession);
    } else {
        displayFinalRecord();
    }
}

function countdown(duration, callback) {
    let timeLeft = duration;
    const countdownElement = document.getElementById('countdown');
    countdownElement.innerText = timeLeft;

    const timer = setInterval(() => {
        timeLeft--;
        countdownElement.innerText = timeLeft;
        if (timeLeft <= 0) {
            clearInterval(timer);
            countdownElement.innerText = '';
            callback();
        }
    }, 1000);
}

function startTypingSession() {
	document.getElementById('sessionNumber').innerText = `Session ${sessionCount + 1}`;
    document.getElementById('strategyTime').innerText = ''; 
    document.getElementById('result').innerText = ''; 
    sessionCounts[sessionCount].cheated = false;
    document.getElementById('textInput').disabled = false;
    document.getElementById('textInput').value = '';
    document.getElementById('textInput').focus();

    document.getElementById('textInput').addEventListener('copy', function(e) {
        sessionCounts[sessionCount].cheated = true;
    });
    document.getElementById('textInput').addEventListener('paste', function(e) {
        sessionCounts[sessionCount].cheated = true;
    });

    document.getElementById('textInput').addEventListener('keydown', function(event) {
        if (event.key === 'Backspace' || event.key === 'Delete') {
            event.preventDefault();
        }
    });

    countdown(60, endTypingSession);
}

function endTypingSession() {
	document.getElementById('sessionNumber').innerText = `Session ${sessionCount + 1}`;
    document.getElementById('textInput').disabled = true;
    updateResult();
    updateSessionRecords();

    if (sessionCount < 2) {
        sessionCount++;
        strategyTime();
    } else {
        displayFinalRecord();
    }
}

function updateResult() {
    const text = document.getElementById('textInput').value.toUpperCase();
    const slapCount = (text.match(/SLAP/g) || []).length;
    const charCount = text.length;
    sessionCounts[sessionCount] = { slaps: slapCount, chars: charCount, cheated: sessionCounts[sessionCount].cheated };
    document.getElementById('result').innerText = `Number of SLAPs: ${slapCount}`;
}

function updateSessionRecords() {
    let recordText = 'Session Records:<br>';
    sessionCounts.forEach((count, index) => {
        let sessionLabel = count.cheated ? `Session ${index + 1}*: ` : `Session ${index + 1}: `;
        let record = `${sessionLabel}Number of SLAPs: ${count.slaps} (Total Characters: ${count.chars})`;
        recordText += `${record};<br>`;
    });
    document.getElementById('record').innerHTML = recordText;
}

function strategyTime() {
    document.getElementById('strategyTime').innerHTML = "90 sec strategy time for the team.<br>The next session will start as soon as the countdown reaches zero.";
    countdown(90, startTypingSession);
}


function displayFinalRecord() {
    updateSessionRecords();
	document.getElementById('strategyTime').innerHTML = "The task is now complete.<br>Thank you.";
	sendGameData();
}

function sendGameData() {
  const data = {
    score1: sessionCounts[0].slaps,
    tc1: sessionCounts[0].chars,
    score2: sessionCounts[1].slaps,
    tc2: sessionCounts[1].chars,
    score3: sessionCounts[2].slaps,
    tc3: sessionCounts[2].chars,
  };

  fetch('https://script.google.com/macros/s/AKfycbxKgY7pLCse2cx4QFIknsbvDDVmlICnYG--QrZkA5p2jjDEm9eU8xG61jJ0pZXFUNs/exec', {
    method: 'POST',
    mode: 'no-cors',
    cache: 'no-cache',
    credentials: 'same-origin',
    headers: {
      'Content-Type': 'application/json',
    },
    redirect: 'follow',
    referrerPolicy: 'no-referrer',
    body: JSON.stringify(data),
  })
  .then(response => console.log('Success:', response))
  .catch(error => console.error('Error:', error));
}

