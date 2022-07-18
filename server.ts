import { serve } from 'https://deno.land/std@0.138.0/http/server.ts';

import { serveDir } from 'https://deno.land/std@0.138.0/http/file_server.ts';
import { randomFirstWord } from './randomFirstWord.ts';

let previousWord = randomFirstWord();
const usedWords = [previousWord];

console.log('Listening on http://localhost:8000');

serve(async (req) => {
  const pathname = new URL(req.url).pathname;
  console.log(pathname);
  if (req.method === 'GET' && pathname === '/shiritori') {
    return new Response(previousWord);
  }

  if (req.method === 'POST' && pathname === '/shiritori') {
    const requestJson = await req.json();
    const nextWord = requestJson.nextWord;

    //ひらがなでなければエラー
    if (!nextWord.match(/^[\u3040-\u309F]+$/)) {
      return new Response('ひらがなで入力してください', { status: 400 });
    }

    if (
      nextWord.length > 0 &&
      previousWord.charAt(previousWord.length - 1) !== nextWord.charAt(0)
    ) {
      return new Response('前の単語に続いていません', { status: 400 });
    }
    if (usedWords.includes(nextWord)) {
      return new Response('すでに使用済みです', { status: 400 });
    }

    usedWords.push(nextWord);
    previousWord = nextWord;

    return new Response(previousWord);
  }

  if (req.method === 'POST' && pathname === '/reset') {
    previousWord = randomFirstWord();
    //useWordをリセットする
    usedWords.length = 0;
    usedWords.push(previousWord);
    return new Response(previousWord);
  }

  //履歴を表示する
  if (req.method === 'GET' && pathname === '/history') {
    //配列を返す
    return new Response(JSON.stringify(usedWords));
  }

  return serveDir(req, {
    fsRoot: 'public',
    urlRoot: '',
    showDirListing: true,
    enableCors: true,
  });
});
