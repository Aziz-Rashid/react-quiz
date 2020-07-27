import React, { useState } from 'react';
import { fetchQuizQuestions } from './API';
import Question from './components/Question';
import { QuestionsState, Difficulty } from './API';
import './app.css'
import Button from '@material-ui/core/Button';
import spinner from './images/spinner.gif'

export type AnswerObject = {
  question: string;
  answer: string;
  correct: boolean;
  correctAnswer: string;
};
 

const App: React.FC = () => {
  const [loading, setLoading] = useState(false);
  const [questions, setQuestions] = useState<QuestionsState[]>([]);
  const [number, setNumber] = useState(0);
  const [userAnswers, setUserAnswers] = useState<AnswerObject[]>([]);
  const [score, setScore] = useState(0);
  const [gameOver, setGameOver] = useState(true);
  const [inp,setinp] = useState(3)
  const [yes,setyes] = useState(false)
  const [select,setselect] = useState({})
  let TOTAL_QUESTIONS = inp;
  const change = (e:any) =>{
    setinp(e.target.value)
  }
  const setdata = () =>{
    if(inp > 3){
      setyes(true)
    }
  }
  const opt = (e:any) =>{
      setselect(e.target.value)
  }
  console.log(select)
  const Quiz = async () => {
    setLoading(true);
    setGameOver(false);
    const newQuestions = await fetchQuizQuestions(
      TOTAL_QUESTIONS,
      Difficulty.EASY
    );
    setQuestions(newQuestions);
    setScore(0);
    setUserAnswers([]);
    setNumber(0);
    setLoading(false);
  };

  const checkAnswer = (e: any) => {
    if (!gameOver) {
      const answer = e.currentTarget.value;
      const correct = questions[number].correct_answer === answer;
      if (correct) setScore((prev) => prev + 1);
      const answerObject = {
        question: questions[number].question,
        answer,
        correct,
        correctAnswer: questions[number].correct_answer,
      };
      setUserAnswers((prev) => [...prev, answerObject]);
    }
  };
  
  const nextQuestion = () => {
    const nextQ = number + 1;

    if (nextQ === TOTAL_QUESTIONS) {
      setGameOver(true);
    } else {
      setNumber(nextQ);
    }
  };
  const [counter, setCounter] = React.useState(500);
  React.useEffect(() => {
    const timer:any = counter > 0 && setInterval(() => setCounter(counter - 1), 1000);
    return () => clearInterval(timer);
  }, [counter]);
  if(yes === false  ){
    return(

    <div className="maindiv">
      <h3 className="heading">Select your quiz questions and Difficulty!</h3>
      <input className="main" type="number" onChange={change} placeholder="How much questions you want to solve!"/>
      <p className="para">select your quiz Difficulty!</p>
      <select onChange={opt} className="option">
        <option value={"EASY"}>Easy</option>
        <option  value={"MEDIUM"}>MEDIUM</option>
        <option value={"HARD"}>HARD</option>
      </select>
      <div className="div">
      <Button className="bt" variant="contained" color="primary" onClick={setdata}>click me </Button>
      </div></div>
    )
  }
  return (
    <div className="bg">
      <h1 >Quiz app! </h1>
      
      {gameOver || userAnswers.length === TOTAL_QUESTIONS ? (
        <div >
          <Button className="btn" variant="contained" color="primary" onClick={Quiz}>
            Start Quiz
              </Button>
        </div>
      ) : null}
      {!gameOver ? <div><h1 className='score'>Score: {score}</h1> <h3 className="time">Time Remaining: {counter}</h3></div>  : null}
     
      {loading ? <img src={spinner} alt=""  width="50%"/> : null}
      {!loading && !gameOver && (
        <Question
          questionNr={number + 1}
          totalQuestions={TOTAL_QUESTIONS}
          question={questions[number].question}
          answers={questions[number].answers}
          userAnswer={userAnswers ? userAnswers[number] : undefined}
          callback={checkAnswer}
        />
      )}
      {!gameOver && !loading && userAnswers.length === number + 1 && number !== TOTAL_QUESTIONS - 1 ? (
        <Button className="btn" variant="contained" color="primary" onClick={nextQuestion}>
          Next Question
        </Button>
      ) : null}
    </div>
  );
};

export default App;
