import { useEffect, useState } from "react";
import "./App.css";
import logo from "./microphone.svg";
import classNames from "classnames";

export interface IWindow extends Window {
  webkitSpeechRecognition: any;
}

function setupRecognition(): any {
  const recognition = new (
    window as IWindow & typeof globalThis
  ).webkitSpeechRecognition();
  recognition.continuous = false;
  recognition.lang = "ru-RU";
  recognition.interimResults = true;
  recognition.maxAlternatives = 1;
  return recognition;
}

function randInt() {
  return Math.ceil(Math.random() * 10_000);
}

const recognition = setupRecognition();

function App() {
  const [lockButton, setLockButton] = useState(false);
  const [transcript, setTranscript] = useState<string>();

  const handleClick = () => {
    setLockButton(true);
    setTranscript("")
    recognition.start();
  };

  useEffect(() => {
    recognition.onresult = (event: any) => {
      const transcript = event.results[0][0].transcript;
      setTranscript(transcript + " " + randInt().toString());
    };

    recognition.onend = () => {
      setLockButton(false);
    };

    return () => {
      recognition.abort();
    };
  }, []);

  return (
    <div className="App">
      <button
        className={classNames("App-button", {
          "App-button-disabled": lockButton,
        })}
        onClick={handleClick}
        disabled={lockButton}
      >
        <img src={logo} className="App-logo" alt="logo" />
      </button>
      <div className="App-text">{transcript}</div>
    </div>
  );
}

export default App;
