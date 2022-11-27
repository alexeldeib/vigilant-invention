
import { useState, useEffect } from 'react'
import { default as wordlist } from 'an-array-of-english-words'
import { Trie } from '@datastructures-js/trie';
import './App.css'

const alphabet = 'abcdefghijklmnopqrstuvwxyz'
const consonants = 'bcdfghjklmnpqrstvwxyz';
const vowels = 'aeiou'
const alphabetLength = 26;
const allValidWords = wordlist.filter(word => word.length > 3)

function checkValidWords(words: string[], letters: string[]) {
  let numbers = Array(26).fill(0)
  for (const letter of letters) {
    numbers[letter.charCodeAt(0) - 97]++
  }

  let middleCharCode = letters[3].charCodeAt(0) - 97;

  let count = 0
  let validWords = []
  outer:
  for (const word of words) {
    let middleCharFound = false;
    // let wordNumbers = Array(26).fill(0);
    for (const letter of word) {
      let charCode = letter.charCodeAt(0) - 97;
      // wordNumbers[letter.charCodeAt(0) - 97]++
      if (numbers[charCode] == 0) {
        continue outer
      }
      if (charCode === middleCharCode) {
        middleCharFound = true;
      }
    }
    if (middleCharFound) {
      validWords.push(word)
      count++
    }
  }
  return validWords
}

function getSevenRandomLetters() {
  // let candidateLetters = Array.from(alphabet.slice())
  // let chosenLetters = [];
  // for (let i = 0; i < 7; i++) {
  //   const index = getRandomLetter(candidateLetters.length)
  //   chosenLetters.push(candidateLetters[index])
  //   candidateLetters.splice(index, 1)
  // }
  let candidateLetters = Array.from(consonants.slice())
  let chosenLetters = [];
  candidateLetters = Array.from(consonants.slice())
  for (let i = 0; i < 5; i++) {
    const index = getRandomLetter(candidateLetters.length)
    chosenLetters.push(candidateLetters[index])
    candidateLetters.splice(index, 1)
  }
  candidateLetters = Array.from(vowels.slice())
  for (let i = 0; i < 2; i++) {
    const index = getRandomLetter(candidateLetters.length)
    chosenLetters.push(candidateLetters[index])
    candidateLetters.splice(index, 1)
  }
  return chosenLetters
}

function validateGuess(trie: Trie, found: string[], guess: string): boolean {
  const valid = trie.has(guess)
  const exists = found.includes(guess)
  return valid && !exists
}

function getRandomLetter(max: number) {
  return Math.floor(Math.random() * max);
}

function App() {
  const [currentWord, setCurrentWord] = useState('')

  const [dict, setDict] = useState(() => {
    const allwords = new Trie();
    for (let word of allValidWords) {
      allwords.insert(word)
    }
    return allwords;
  });

  const [letters, setLetters] = useState([] as string[])
  const [validWords, setValidWords] = useState([] as string[])
  const [foundWords, setFoundWords] = useState([] as string[])
  const [gameOver, setGameOver] = useState(false)

  useEffect(() => {
    initialize()
  }, []);

  const initialize = () => {
    setFoundWords([])
    setGameOver(false)
    let initLetters = getSevenRandomLetters()
    let initValidWords = checkValidWords(allValidWords, initLetters);
    let iterations = 1;
    // while (initValidWords.length < 20 || initValidWords.length > 50) {
    while (initValidWords.length > 20 || !initValidWords.some((val) => initLetters.every((letter) => {val.includes(letter)}))) {
      console.log("iterations", iterations)
      initLetters = getSevenRandomLetters()
      initValidWords = checkValidWords(allValidWords, initLetters);
      iterations++;
    }
    console.log("iterations", iterations)
    console.log("initLetters", initLetters)
    console.log("validWords", initValidWords)
    setLetters(initLetters)
    setValidWords(initValidWords)
  }

  const handleKeyDown = ((e: React.KeyboardEvent<HTMLButtonElement>) => {
    // let charCode = e.key.charCodeAt(0) - 97;
    console.log(e.key);
    let index = letters.indexOf(e.key);
    console.log(index);
    if (index != -1) {
      setCurrentWord(currentWord.concat(letters[index]));
    }
  })

  const validateGuess = ((trie: Trie, valid: string[], found: string[], guess: string) => {
    const isValid = trie.has(guess)
    const exists = found.includes(guess)
    if (isValid && !exists) {
      console.log("good guess!")
      const newWords = found.concat(guess);
      if (valid.length == newWords.length) {
        setGameOver(true)
        console.log("game over")
      }
      setFoundWords(newWords)
      setCurrentWord('')
      console.log(newWords)
    } else {
      console.log("bad guess!")
      console.log(found)
      console.log(foundWords)
      setCurrentWord('')
    }
  })

  return (
    <div className="App">
      <h1>Spelling Bee</h1>

      {gameOver && <GameOver initialize={initialize} />}
      <div className="currentWord">{currentWord}</div>
      <button className="validate" onClick={() => validateGuess(dict, validWords, foundWords, currentWord)}>Enter Word</button>
      <button className="clear" onClick={() => setCurrentWord('')}>Clear Guess</button>
      <div className="totalCount">Found {foundWords.length}/{validWords.length} words </div>

      <div className="row">
        <button onKeyDown={(e) => handleKeyDown(e)} onClick={() => setCurrentWord(currentWord.concat(letters[0]))}>{letters[0]}</button>
        <button onKeyDown={(e) => handleKeyDown(e)} onClick={() => setCurrentWord(currentWord.concat(letters[1]))}>{letters[1]}</button>
      </div>
      <div className="row">
        <button onKeyDown={(e) => handleKeyDown(e)} onClick={() => setCurrentWord(currentWord.concat(letters[2]))}>{letters[2]}</button>
        <button onKeyDown={(e) => handleKeyDown(e)} onClick={() => setCurrentWord(currentWord.concat(letters[3]))}>{letters[3]}</button>
        <button onKeyDown={(e) => handleKeyDown(e)} onClick={() => setCurrentWord(currentWord.concat(letters[4]))}>{letters[4]}</button>
      </div>
      <div className="row">
        <button onKeyDown={(e) => handleKeyDown(e)} onClick={() => setCurrentWord(currentWord.concat(letters[5]))}>{letters[5]}</button>
        <button onKeyDown={(e) => handleKeyDown(e)} onClick={() => setCurrentWord(currentWord.concat(letters[6]))}>{letters[6]}</button>
      </div>

      <div className="foundWords">
        {foundWords.map((word, index) => { return <div key={word}>{word}</div> })}
      </div>
    </div >
  )
}

function Tile(props: { letter: string }) {
  return (
    <div className="tile">
      {props.letter}
    </div>
  )
}

function GameOver(props: { initialize: () => void }) {
  return (
    <div className="gameOver">
      <div>Game Over!</div>
      <button onClick={() => props.initialize()}>Play Again</button>
    </div>
  )
}

export default App
