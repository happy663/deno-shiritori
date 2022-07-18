const gameJudge = (previousWord, para) => {
  if (previousWord.slice(-1) === 'ん') {
    para.innerText = 'ゲーム終了';
    const nextWordSendButton = document.querySelector('#nextWordSendButton');
    nextWordSendButton.disabled = true;
  } else {
    para.innerText = `前の単語：${previousWord}`;
  }
};

window.onload = async () => {
  const response = await fetch('/shiritori');
  const previousWord = await response.text();
  const para = document.querySelector('#previousWord');
  gameJudge(previousWord, para);

  const history = document.querySelector('#history');
  const usedWords = await fetch('/history').then((res) => res.json());

  usedWords.forEach((word) => {
    const div = document.createElement('div');
    const newText = document.createTextNode(word);
    div.appendChild(newText);
    history.appendChild(div);
  });
};

document.querySelector('#nextWordSendButton').onclick = async () => {
  const nextWord = document.querySelector('#nextWordInput').value;
  const response = await fetch('/shiritori', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ nextWord }),
  });

  if (response.status / 100 !== 2) {
    alert(await response.text());
    return;
  }
  const previousWord = await response.text();
  const para = document.querySelector('#previousWord');
  gameJudge(previousWord, para);
  nextWordInput.value = '';

  //履歴を更新する
  const history = document.querySelector('#history');
  const div = document.createElement('div');
  const newText = document.createTextNode(previousWord);
  div.appendChild(newText);
  history.appendChild(div);
  //newTextの最後の文字が「ん」で終わる場合
};

document.querySelector('#reset').onclick = async () => {
  await fetch('/reset', {
    method: 'POST',
  });
  location.reload();
};
