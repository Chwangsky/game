import './App.css';
import { useCallback, useEffect, useMemo, useState } from 'react';
import buttonOpenSound from './audio/button-open.mp3';
import { Helmet } from 'react-helmet';

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
  const stages = useMemo(() => [
    null,
    // LEVEL 1~
    
    {N: 5, M: 5, L: 9, time : 3000},
    {N: 5, M: 5, L: 11, time: 3200},
    {N: 5, M: 5, L: 13, time: 3400},
    {N: 6, M: 6, L: 15, time: 3600},
    {N: 6, M: 6, L: 17, time: 3800},
    {N: 6, M: 6, L: 19, time: 4000},
    {N: 6, M: 6, L: 21, time: 4200},
    {N: 7, M: 7, L: 23, time: 4400},
    {N: 7, M: 7, L: 25, time: 4600},
    {N: 7, M: 7, L: 27, time: 4800},
    // LEVEL 11~
    // LEVEL 11 부터는 급격하게 어려워져서 추가시간을 더 줌.
    {N: 7, M: 7, L: 29, time: 5000},
    {N: 8, M: 8, L: 31, time: 5300},
    {N: 8, M: 8, L: 33, time: 5600},
    {N: 8, M: 8, L: 35, time: 5900},
    {N: 8, M: 8, L: 37, time: 6200},
    {N: 9, M: 9, L: 39, time: 6500},
    {N: 9, M: 9, L: 41, time: 6800},
    {N: 9, M: 9, L: 43, time: 7100},
    {N: 9, M: 9, L: 45, time: 7400},
    {N: 10, M: 10, L: 47, time: 7700},
    // LEVEL 21~
    {N: 10, M: 10, L: 49, time: 8000},
    {N: 10, M: 10, L: 51, time: 8300},
    {N: 10, M: 10, L: 53, time: 8600},
    {N: 11, M: 11, L: 55, time: 8900},
    {N: 11, M: 11, L: 57, time: 9200},
    {N: 11, M: 11, L: 59, time: 9500},
    {N: 11, M: 11, L: 61, time: 9700},
    {N: 11, M: 11, L: 63, time: 9900},
    {N: 12, M: 12, L: 65, time: 10200},
    {N: 12, M: 12, L: 67, time: 10500},
    // LEVEL 31~
    {N: 12, M: 12, L: 69, time: 10800},
    {N: 12, M: 12, L: 71, time: 11100},
    {N: 12, M: 12, L: 73, time: 11400},
    {N: 12, M: 12, L: 75, time: 11700},
    {N: 13, M: 13, L: 77, time: 12000},
    {N: 13, M: 13, L: 79, time: 12300},
    {N: 13, M: 13, L: 81, time: 12600},
    {N: 13, M: 13, L: 83, time: 12900},
    {N: 13, M: 13, L: 85, time: 13200},
    {N: 13, M: 13, L: 87, time: 13500},
    // LEVEL 41~
    {N: 14, M: 14, L: 89, time: 13800},
    {N: 14, M: 14, L: 91, time: 14100},
    {N: 14, M: 14, L: 93, time: 14400},
    {N: 14, M: 14, L: 95, time: 14700},
    {N: 14, M: 14, L: 97, time: 15000},
    {N: 15, M: 15, L: 99, time: 15300},
    {N: 15, M: 15, L: 101, time: 15600},
    {N: 15, M: 15, L: 103, time: 15900},
    {N: 15, M: 15, L: 105, time: 16200},
    {N: 15, M: 15, L: 107, time: 16500},
    // LEVEL 51~ (from this level, it is impossible to clear without hack)
    {N: 50, M: 50, L: 301, time: 5000},
    {N: 50, M: 50, L: 351, time: 5000},
    {N: 50, M: 50, L: 401, time: 5000},
    {N: 50, M: 50, L: 451, time: 5000},
    {N: 50, M: 50, L: 501, time: 5000},
    {N: 50, M: 50, L: 551, time: 5000},
    {N: 50, M: 50, L: 601, time: 5000},
    {N: 50, M: 50, L: 651, time: 5000},
    {N: 50, M: 50, L: 701, time: 5000},
    {N: 50, M: 50, L: 751, time: 5000},
    // LEVEL 61~
    {N: 50, M: 50, L: 801, time: 5000},
    {N: 50, M: 50, L: 851, time: 5000} //

  ], []); 

  //          function: 페이지 제목을 클릭한 경우 핸들러          //
  const onTitleClickHandler = () => {
    window.location.href = '/';
  }

  //          function: 가로 길이 N, 세로 길이 M인 2차원 배열에서 (0, 0), (N-1, M-1)까지 가는 경로들 중 길이가 L인 Path를 2차원 경로로 출력 //
  // 주어진 경로에서 출발지, 목적지까지 가는데 정확히 길이 L이면서 특정조건을 만족하는 랜덤한 경로를 도출해내는 알고리즘은 NP-complete이다.
  // 아래 알고리즘은 만약 반복하는 횟수가 일정 횟수(여기서는 L * L으로 구현)가 넘어간다면, 처음부터 다시 탐색한다.
  
  //
  // 알고리즘 테스트 결과
  // N:9, M:9, L:55(N=9, M=9일 때, L이 가질 수 있는 최대값)일 때, 1000번정도의 재탐색이 일어난다(1~2초 소요)
  // N:11, M:11, L:77(N=11, M=11일 때, L이 가질 수 있는 최대값)일 때, 1000번정도의 재탐색이 일어난다(3초 소요)
  // N:50, M:50, L:801정도일떄 35번정도 재탐색이 일어나고(1~2초 소요), 그 이상을 넘어가면 탐색시간이 기하급수적으로 증가한다.
  // N:100, M:100, L:1001정도인 경우 30번 정도의 재탐색이 일어난다.
  //

  const findPath = (N, M, L) => {
    let grid = Array.from({ length: N }, () => Array.from({ length: M }, () => 0));
    let found = false;
    let dy = [0, 0, 1, -1];
    let dx = [1, -1, 0, 0];
    let path = [];
    let attemptCount = 0;
    const attemptLimit = L * L + 10000; // heuristic;

    function randomDirection() {
        return Math.floor(Math.random() * 4);  // 0, 1, 2, 3 중 하나를 반환
    }
    
    function backtrack(x, y, pathLength, path) {
        if(attemptCount >= attemptLimit) {
          return false;
        }
        if (found) return false;
        if (x >= N || x < 0 || y >= M || y < 0 || grid[x][y] === 1) return false;
        if (pathLength > L) return false;
        if (N + M - 2 - x - y > L - pathLength) return false; // for pruning. 

        if (x < N - 1 && y < M - 1 && grid[x+1][y] === 1 && grid[x][y+1] === 1 && grid[x+1][y+1] === 1) return false;
        if (x < N - 1 && y > 0 && grid[x+1][y] === 1 && grid[x][y-1] === 1 && grid[x+1][y-1] === 1) return false;
        if (x > 0 && y > 0 && grid[x-1][y] === 1 && grid[x][y-1] === 1 && grid[x-1][y-1] === 1) return false;
        if (x > 0 && y < M - 1 && grid[x-1][y] === 1 && grid[x][y+1] === 1 && grid[x-1][y+1] === 1) return false;

        attemptCount++;

        grid[x][y] = 1;
        path.push([x, y]);

        if (pathLength === L) {
          if (x === N-1 && y === M-1) {
            return true;
          } else {
            
            return false;
          }
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

    while(true) {
      path = [];
      grid = Array.from({ length: N }, () => Array.from({ length: M }, () => 0));
      attemptCount = 0;
      let found = backtrack(0, 0, 1, path);
      if (found === true) {
        setAnswerPath(path);
        break;
      } else {
        continue;
      }
    }

    return grid;
  }

  const tileGapSize = 0.1 // fixed

  //          variable: level이 변경될 때마다 타일의 크기를 변경하기 위함          //
  const tileSize = useMemo(() => {
    return (gameWidth - tileGapSize * (stages[level].N + 1)) / stages[level].N;
  }, [level, stages, gameWidth, tileGapSize]);

  //          state: 타일에 에니메이션을 넣기 위해 각 타일의 표시 상태를 나타내는 state          //
  const [tileDisplay, setTileDisplay] = useState([]); // 각 타일의 표시 상태를 관리

  //          effect: level이 변경될 떄마다 실행되는 함수          //
  useEffect(() => {
    setAnswer(findPath(stages[level].N, stages[level].M, stages[level].L));
    setTileDisplay(Array(stages[level].N).fill().map(() => Array(stages[level].M).fill('tile-black')));

    setStartColor(getRandomColor());
    setEndColor(getRandomColor());
  }, [level, stages]);

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
  }, [gameState, level, stages])

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
    setLastDraggedTile(null);
    setTileStatus(() => {
      const status = new Map();
      return status;
    });
    setTileDisplay(Array.from({length: stages[level].N}, () =>
      Array(stages[level].M).fill('tile-black')
    ));

  }

  //          state: 마지막으로 성 타일의 위치를 저장          //
  const [lastDraggedTile, setLastDraggedTile] = useState(null);

  //          state: 이번 스텝에서 오답을 낸 경우, 오답을 낸 타일의 위치를 저장          //
  const [wrongTilesInThisStep, setWrongTilesInThisStep] = useState([])

  //          function : 한 array안에 다른 array가 포함되고 있는지 여부를 확인하기 위해 쓰는 함수          //
  // 예컨대 arr 배열 안에 target이 포함되었는지 여부를 확인하기 위해서,
  // const containsTarget = arr.some(subArray => arraysEqual(subArray, target)); // true or false
  // 와 같이 써줄 수 있음.

  const isArrayEqual = (a, b) => {
    if (a.length !== b.length) return false;
    for (let i = 0; i < a.length; i++) {
      if (a[i] !== b[i]) return false;
    }
    return true;
  }

  //          function: 타일을 클릭한 경우 핸들러          //
  const onTileClickHandler = useCallback((x, y) => {

    // 동일타일 클릭시 리턴
    if (lastDraggedTile !== null && x === lastDraggedTile[0] && y === lastDraggedTile[1]) {
      console.log('중복타일클릭');
      return;
    }

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

    // 이미 이번 스탭에서 틀린 타일을 한번 더 클릭한 경우 바로 리턴
    if (wrongTilesInThisStep.some(subArray => isArrayEqual(subArray, [x, y]))) return;

    const currentKey = `${x}-${y}`;
  
    if (answerPath[currentTileStep][0] === y && answerPath[currentTileStep][1] === x) {
      // 타일 상태 업데이트
      setTileStatus(prev => new Map(prev).set(currentKey, 'correct'));
  
      setCurrentTileStep(currentTileStep + 1);

      setLastDraggedTile([x, y]);

      setWrongTilesInThisStep([]); //

      // 모든 타일을 맞췄다면
      if (currentTileStep + 1 === stages[level].L) {
        setTimeout(() => { // 1초 대기 후 실행
          setLastDraggedTile(null);
          setLevel(level + 1); // 다음 레벨로 업데이트
          setCurrentTileStep(0); // 타일 스텝 초기화
          setGameState('tile-visible'); // 게임 상태를 'tile-visible'로 설정
          setTileStatus(new Map()); // 타일 상태 초기화
        }, 1000); // 1초 대기
      }
    } else {
      setTileStatus(prev => new Map(prev).set(currentKey, 'wrong'));
      setLife(prev => prev - 1); // 생명 감소
      setWrongTilesInThisStep(prev => [...prev, [x, y]]);
      
      if (life <= 1) {
        setGameState('gameover');
      }
    }
  }, [currentTileStep, lastDraggedTile, life, answerPath, level, stages, wrongTilesInThisStep]);


  //          state: 드래그 및 터치를 전역적으로 처리하기 위한 state          //
  useEffect(() => {
    // 마우스를 뗄 때 호출할 함수
    const handleMouseUpGlobal = () => {
      setIsDragging(false);
    };

    const handleTouchMove = (e) => {
      const touch = e.touches[0];
      const element = document.elementFromPoint(touch.clientX, touch.clientY);
    
      if (element && element.dataset.x && element.dataset.y) {
        const x = parseInt(element.dataset.x, 10); // data-x 값을 정수로 변환
        const y = parseInt(element.dataset.y, 10); // data-y 값을 정수로 변환
        onTileClickHandler(x, y);
      }
    };
    

    // 전역 이벤트 리스너 등록
    window.addEventListener('mouseup', handleMouseUpGlobal);
    window.addEventListener('touchmove', handleTouchMove);

    // 컴포넌트가 언마운트되거나 리렌더링되기 전에 이벤트 리스너 제거
    return () => {
      window.removeEventListener('mouseup', handleMouseUpGlobal);
      window.removeEventListener('touchmove', handleTouchMove);
    };
  }, [onTileClickHandler]);
  

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

  //          function: 드래그를 처리하기 위한 함수 - 마우스가 버튼 위에 있는 경우          //
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
    setAnswer(findPath(stages[1].N, stages[1].M, stages[1].L)); // 1단계에서 재시작한 경우 같은 경로를 반복해서 출력하는 것 방지
  }

  //          state: 시작색과 끝색을 정하기 위한 변수          //
  const [startColor, setStartColor] = useState({ r: 255, g: 255, b: 255 });
  const [endColor, setEndColor] = useState({ r: 173, g: 216, b: 230 });

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
      <Helmet>
        <title>STAIR OF MEMORY</title>
      </Helmet>
      <div className='title-box'>
        <div className='title' onClick={onTitleClickHandler}>
          Stair of Memory
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
                            data-x={x}
                            data-y={y}
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
      <div className='tail'>
        <div className='developer'>
          dev. 0woo
        </div>
      </div>
    </div>
  );
}

export default App;
