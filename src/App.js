import logo from './logo.svg';
import './App.css';
import { useEffect, useState } from 'react';
import buttonOpenSound from './audio/button-open.mp3';

function App() {

  const [level, setLevel] = useState(1);
  const [life, setLife] = useState(5);

  const gameWidth = 90;
  const gameHeight = 90;
  //          variable: 게임의 상태를 표시하기 위한 변수          //
  const [gameState, setGameState] = useState('menu');

  const [answer, setAnswer] = useState([[0, 0], [0, 0]]);
  const [answerPath, setAnswerPath] = useState([]);


  //          variable: 각 스테이지의 정보. N과 M은 반드시 동일해야함!!          //
  const stages = [
    null,
    {N: 5, M: 5, L: 11, time: 3000},
    {N: 5, M: 5, L: 13, time: 3000},
    {N: 6, M: 6, L: 15, time: 3000},
    {N: 6, M: 6, L: 17, time: 3000},
    {N: 6, M: 6, L: 19, time: 3000},
    {N: 6, M: 6, L: 21, time: 3000},
    {N: 6, M: 6, L: 23, time: 3000},
    {N: 7, M: 7, L: 25, time: 3000},
    {N: 7, M: 7, L: 27, time: 3000},
    {N: 7, M: 7, L: 29, time: 3000},
    {N: 7, M: 7, L: 31, time: 3000},
    {N: 8, M: 8, L: 33, time: 3000},
    {N: 8, M: 8, L: 35, time: 3000},
    {N: 8, M: 8, L: 37, time: 3000},
    {N: 9, M: 9, L: 39, time: 3000},
    {N: 9, M: 9, L: 41, time: 3000},
    {N: 9, M: 9, L: 43, time: 3000},
    {N: 10, M: 10, L: 45, time: 3000},
    {N: 10, M: 10, L: 47, time: 3000},
    {N: 10, M: 10, L: 49, time: 3000},
    {N: 11, M: 11, L: 51, time: 3000},
    {N: 11, M: 11, L: 53, time: 3000},
  ];

  //          function: 페이지 제목을 클릭한 경우 핸들러          //
  const onTitleClickHandler = () => {
    window.location.href = '/';
  }


  //          function: 가로 길이 N, 세로 길이 M인 2차원 배열에서 (0, 0), (N-1, M-1)까지 가는 경로들 중 길이가 L인 Path를 2차원 경로로 출력 // 
  const findPath = (N, M, L) => {
    let grid = Array.from({ length: N }, () => Array.from({ length: M }, () => 0));
    let found = false;
    let dy = [0, 0, 1, -1];
    let dx = [1, -1, 0, 0];
    let path = [];

    function randomDirection() {
        return Math.floor(Math.random() * 4);  // 0, 1, 2, 3 중 하나를 반환
    }
    
    function backtrack(x, y, pathLength, path) {
        if (found) return false;
        if (x >= N || x < 0 || y >= M || y < 0 || grid[x][y] === 1) return false;
        if (pathLength > L) return false;
        if (N + M - 2 - x - y > L - pathLength) return false; // for pruning. 

        if (x < N - 1 && y < M - 1 && grid[x+1][y] === 1 && grid[x][y+1] === 1 && grid[x+1][y+1] === 1) return false;
        if (x < N - 1 && y > 0 && grid[x+1][y] === 1 && grid[x][y-1] === 1 && grid[x+1][y-1] === 1) return false;
        if (x > 0 && y > 0 && grid[x-1][y] === 1 && grid[x][y-1] === 1 && grid[x-1][y-1] === 1) return false;
        if (x > 0 && y < M - 1 && grid[x-1][y] === 1 && grid[x][y+1] === 1 && grid[x-1][y+1] === 1) return false;

        grid[x][y] = 1;
        path.push([x, y]);

        if (x === N-1 && y === M-1 && pathLength === L) {
            found = true;
            return true;
        }

        let randomIndex = randomDirection();
        for (let i = 0; i < 4; i++) {
            let k = (randomIndex + i) % 4;  // 현재 랜덤 방향에서 시작하여 순환
            let nx = x + dx[k];
            let ny = y + dy[k];
            if (backtrack(nx, ny, pathLength + 1, path)) {
                return true;
            }
        }

        grid[x][y] = 0;
        path.pop();
        return false;
    }
  
    if (!backtrack(0, 0, 1, path)) {
        return null;
    }
    setAnswerPath(path);

    return grid;
  }

  const tileGapSize = 0.1 // fixed

  const [tileSize, setTileSize] = useState(10); // 초기값을 10으로 설정

  //          state: 타일에 에니메이션을 넣기 위해 각 타일의 표시 상태를 나타내는 state          //
  const [tileDisplay, setTileDisplay] = useState([]); // 각 타일의 표시 상태를 관리

  //          effect: level이 변경될 떄마다 답을 변경함          //
  //          effect: level이 변경될 때마다 타일의 크기를 변경하기 위함          //
  //          effect: level이 변경될 때마다 모든 타일 상태를 검은색으로 설정          //
  useEffect(() => {
    setAnswer(findPath(stages[level].N, stages[level].M, stages[level].L));
    setTileSize((gameWidth - tileGapSize * (stages[level].N + 1)) / stages[level].N);
    setTileDisplay(Array(stages[level].N).fill().map(() => Array(stages[level].M).fill('tile-black')));
  }, [level]);


  useEffect(() => {
    if (gameState === 'tile-visible') {
      const audioList = []; // 오디오 객체를 저장할 배열
      const timers = []; // 타이머 ID를 저장할 배열

      answerPath.forEach(([y, x], index) => {
        const delay = (index * 1000) / answerPath.length;
        const timer = setTimeout(() => {
          const sound = new Audio(buttonOpenSound);  // 각 타이머마다 새로운 Audio 객체 생성
          audioList.push(sound); // 오디오 리스트에 추가
          setTileDisplay(currentDisplay => {
            const newDisplay = currentDisplay.map(row => [...row]);
            newDisplay[y][x] = 'tile-white';
            sound.play().catch(error => console.error("Audio play failed", error));  // 효과음 재생
            return newDisplay;
          });
        }, delay);

        timers.push(timer);
      });

      // 1.1초 후 모든 오디오 중지
      const stopTimer = setTimeout(() => {
        audioList.forEach(audio => {
          audio.pause(); // 오디오 중지
          audio.currentTime = 0; // 재생 위치를 시작으로 리셋
        });
      }, 1100);

      return () => {
        // 타이머 정리 및 오디오 중지 로직
        timers.forEach(clearTimeout);
        clearTimeout(stopTimer); // 오디오 중지 타이머 정리
        audioList.forEach(audio => {
          audio.pause();
          audio.src = ''; // 메모리 정리
        });
      };
    }
  }, [gameState, answerPath]);


  useEffect(() => {

    let timerId; // 타이머 ID를 저장할 변수
    if (gameState === 'tile-visible') {
      timerId = setTimeout(() => {
        setGameState('tile-invisible');
      }, stages[level].time);
    }
    return () => {
      clearTimeout(timerId); // 컴포넌트 언마운트 또는 useEffect 재실행 전에 타이머 정리
    };
  }, [gameState])

  //          state: 몇번째 타일을 클릭하였는지 나타내는 상태          //
  const [currentTileStep, setCurrentTileStep] = useState(0);

  //          state: 타일 각의 상태를 관리하기 위함          //
  const [tileStatus, setTileStatus] = useState(() => {
    const status = new Map();
    return status;
  });

  //          function: START 버튼을 클릭한 경우 핸들러          //
  const startButtonOnclickHandler = () => {
    setGameState('tile-visible')
    setLevel(1);
    setLife(5);
    setTileStatus(() => {
      const status = new Map();
      return status;
    });
    setTileDisplay(Array.from({length: stages[level].N}, () =>
      Array(stages[level].M).fill('tile-black')
    ));

  }

  //          function: 타일을 클릭한 경우 핸들러          //
  const onTileClickHandler = (x, y) => {

    // 게임 규칙상 불가능한 곳을 클릭한 경우
    if (currentTileStep === 0) {
      if (x !== 0 || y !== 0) return;
    } else if (currentTileStep === answerPath.length) {
      return;
    } else {
      if (Math.abs(answerPath[currentTileStep - 1][0] - y) + Math.abs(answerPath[currentTileStep - 1][1] - x) > 1) {
        return;
      }
    }

    const currentKey = `${x}-${y}`;
  
    if (answerPath[currentTileStep][0] === y && answerPath[currentTileStep][1] === x) {
      // 타일 상태 업데이트
      setTileStatus(prev => new Map(prev).set(currentKey, 'correct'));
  
      setCurrentTileStep(currentTileStep + 1);

      // 모든 타일을 맞췄다면
      if (currentTileStep + 1 === stages[level].L) {
        setTimeout(() => { // 1초 대기 후 실행
          setLevel(level + 1); // 다음 레벨로 업데이트
          setCurrentTileStep(0); // 타일 스텝 초기화
          setGameState('tile-visible'); // 게임 상태를 'tile-visible'로 설정
          setTileStatus(new Map()); // 타일 상태 초기화
        }, 1000); // 1초 대기
      }
    } else {
      console.log("Incorrect tile clicked");
      setTileStatus(prev => new Map(prev).set(currentKey, 'wrong'));
      setLife(prev => prev - 1); // 생명 감소
      if (life > 1) {
        
      } else {
        setGameState('gameover');
      }
      
    }
  };


  //          state: 드래그를 전역적으로 처리하기 위한 state          //
  useEffect(() => {
    // 마우스를 뗄 때 호출할 함수
    const handleMouseUpGlobal = () => {
      setIsDragging(false);
    };
  
    // 전역 이벤트 리스너 등록
    window.addEventListener('mouseup', handleMouseUpGlobal);
  
    // 컴포넌트가 언마운트되거나 리렌더링되기 전에 이벤트 리스너 제거
    return () => {
      window.removeEventListener('mouseup', handleMouseUpGlobal);
    };
  }, []);
  

  //          state: 드래그를 처리하기 위한 state          //
  const [isDragging, setIsDragging] = useState(false);

  //          function: 드래그를 처리하기 위한 함수 - 마우스를 누른 경우           //
  const onMouseDownHandler = (x, y) => {
    setIsDragging(true);
    onTileClickHandler(x, y);
  };

  //          function: 드래그를 처리하기 위한 함수 - 마우스를 뗀 경우          //
  const onMouseUpHandler = () => {
    setIsDragging(false);
  };

  const onMouseEnterHandler = (x, y) => {
    if (isDragging) {
      onTileClickHandler(x, y);
    }
  };


  //          function: 리트라이 버튼 클릭 핸들러          //
  const onRetryButtonClickHandler = () => {
    setLevel(1);
    setCurrentTileStep(0);
    setGameState('menu');
    setLife(5); 
    setAnswer(findPath(stages[1].N, stages[1].M, stages[1].L)); // 1단계에서 재시작 시 같은 경로를 반복해서 보여주는 버그 수정
  }


  //          state: 시작색과 끝색을 정하기 위한 변수          //
  const [startColor, setStartColor] = useState({ r: 255, g: 255, b: 255 });
  const [endColor, setEndColor] = useState({ r: 173, g: 216, b: 230 });

  useEffect(() => {
    // 컴포넌트가 마운트될 때 랜덤 색상을 생성
    setStartColor(getRandomColor());
    setEndColor(getRandomColor());
  }, []);

  const getRandomColor = () => {
    const r = Math.floor(Math.random() * 256);
    const g = Math.floor(Math.random() * 256);
    const b = Math.floor(Math.random() * 256);
    return { r, g, b };
  }

  //          function: 타일에 색칠하기 위한 함수          //
  function getTileColor(step, maxSteps, startColor, endColor) {
    const ratio = step / maxSteps;
    const r = Math.round(startColor.r + (endColor.r - startColor.r) * ratio);
    const g = Math.round(startColor.g + (endColor.g - startColor.g) * ratio);
    const b = Math.round(startColor.b + (endColor.b - startColor.b) * ratio);
  
    return `rgb(${r}, ${g}, ${b})`;
  }


  return (
    <div className="App">
      <div className='title-box'>
        <div className='title' onClick={onTitleClickHandler}>
          Memory Of Stair
        </div>
      </div>
      <div>
        <div className='info-box'>
          <div className='score-box'>
            <div className='score-name'>
              LEVEL
            </div>
            <div className='score-value'>
              {level}
            </div>
          </div>
          <div className='life-box'>
            <div className='life-name'>
              LIFE
            </div>
            <div className='life-value'>
              {life}
            </div>
          </div>
        </div>
        <div className='game-box'>
          <div className='game' style={{width: `${gameWidth}vmin`, height: `${gameHeight}vmin`}}>
            { gameState === 'menu' &&
              <div className='gamestate-menu'>
                <button className='start-button' onClick={startButtonOnclickHandler}>
                 START
                </button>
              </div>
            }
            { gameState === 'tile-visible' && 
              <div className='button-container' style={{gap: `${tileGapSize}vmin`}}>
                {tileDisplay.map((row, y) => (
                  <div className='button-row' key={`row-${y}`}>
                    {row.map((tileClass, x) => (
                      <button
                        className={tileClass}
                        style={{width: `${tileSize}vmin`, height: `${tileSize}vmin`, gap: `${tileGapSize}vmin`}}
                        onMouseDown={() => onMouseDownHandler(x, y)}
                        onMouseUp={onMouseUpHandler}
                        onMouseEnter={() => onMouseEnterHandler(x, y)}
                        key={`button-${x}-${y}`}
                      />
                    ))}
                  </div>
                ))}
              </div>
            }
            {gameState === 'tile-invisible' && 
              <div className='button-container' style={{gap: `${tileGapSize}vmin`}}>
                {
                answer.map((buttonRow, y) => {
                  return (
                    <div className='button-row' key={`row-${y}`}>
                      {buttonRow.map((button, x) => {
                        const currentKey = `${x}-${y}`;
                        const status = tileStatus.get(currentKey);
                        let tileClass;
                        let tileStyle = {
                          width: `${tileSize}vmin`,
                          height: `${tileSize}vmin`,
                          gap: `${tileGapSize}vmin`
                        };
                
                        switch (status) {
                          case 'correct':
                            tileClass = `tile-correct`;
                            tileStyle = {
                              ...tileStyle,
                              backgroundColor: getTileColor(currentTileStep, answerPath.length, startColor, endColor)
                            };
                            break;
                          case 'wrong':
                            tileClass = 'tile-wrong';
                            break;
                          default:
                            tileClass = 'tile';
                            break;
                        }
                
                        return (
                          <button
                            className={tileClass}
                            style={tileStyle}
                            onMouseDown={() => onMouseDownHandler(x, y)}
                            onMouseUp={onMouseUpHandler}
                            onMouseEnter={() => onMouseEnterHandler(x, y)}
                            key={`button-${x}-${y}`}
                          />
                        );
                      })}
                    </div>)
                })
                }
              </div>
            }
            {gameState === 'gameover' && 
              <div className='gameover-container'>
                <div className='gameover'>
                  GAME OVER
                </div>
                <div className='score'>
                  SCORE : {level}
                </div>
                <div className='retry' onClick={onRetryButtonClickHandler}>
                  RETRY?
                </div>
              </div>
            }

          </div>
        </div>
      </div>
    </div>
  );
}

export default App;
