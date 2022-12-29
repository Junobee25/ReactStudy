# _리액트 Study 1주차 학습노트_

> ## _섹션 4. 섹션 5. Redux_ 
### **`Redux`** 란?
풀룩스 데이터 아키텍쳐를 좀 더 편하게 사용할 수 있게해주는 라이브러리, (app의 상태를 관리)  
### **`사용 이유`**
컴포넌트끼리 데이터 교류 및 state 관리를 쉽고 효율적으로 할 수있게 해줌  
### **`Redux의 3가지 원칙`**
1. Single Source of Truth  
APP의 state를 위해 단 한개의 store를 사용 Flux 와의 주요 차이.
2. State is Read - only  
APP에서 store의 state를 직접 변경할 수 없다.  
state를 변경하기 위해선 무조건 action이 dispatch 되어야 합니다.
3. Changes are made with pure Functions  
**action** 객체를 처리하는 함수를 reducer라고 부름  
**reducer**는 정보를 받아서 상태를 어떻게 업데이트 할지 정의  
**reducer**는 '순수 함수'로 작성되어야 함  
즉,네트워크 및 데이터베이스 접근 X, 인수 변경X  
같은 인수로 실행된 함수는 언제나 같은 결과를 반환  
'순수하지 않은' API 사용 불가(Date.now(),Math.random())

### **`데이터 흐름(the data flow)`**
1. View가 Action을 요청. 액션 생성자가 포맷을 변환한 뒤 돌려준다.
2. `bindActionCreators()`가 준비과정에서 사용됬을 때 자동으로 액션이 보내짐, 그게 아니면 뷰가 직접 액션을 보냄
3. 스토어가 액션을 받는다. 현재 APP 상태 트리와 액션을 루트 리듀서에게 보낸다.
4. 루트 리듀서는 상태 트리를 조각으로 나눈 뒤 알맞은 서브 리듀서로 상태 조각들을 넘겨준다.
5. 서브 리듀서는 받은 상태 조각을 복사하고, 변경한다. 루트 리듀서에게 변경된 복사본을 돌려준다.
6. 루트 리듀서는 받은 상태 조각을 모아 상태 트리로 만든 뒤 스토어로 돌려준다. 이때 스토어는 상태 트리를 최신화 한다.
7. 스토어는 뷰 레이어 바인딩에게 APP 상태가 변경되었다는 것을 알린다.
8. 뷰 레이어 바인딩은 스토어에게 새로운 상태를 보내달라고 요청한다.
9. 뷰 레이어 바인딩은 뷰에게 화면을 업데이트하도록 요청한다.

### **`Redux Project를 위한 도구 설치 및 프로젝트 생성 `**
```bash
    npm install -g create-react-app ## 프로젝트 도구 설치
    create-react-app redux-example ## 프로젝트 생성
    npm install --save redux react-redux ## 뷰 레이어 바인딩 설치 (컴포넌트에서 리덕스 쉽게 연결 가)
```

### **`숫자 카운트 Project`**
1. 버튼1 : 값 1씩 증가
2. 버튼2 : 값 1씩 감소
3. 버튼3 : 배경화면 색상 랜덤화


### **`컴포넌트 생성`**  
## _Value.js Control.js Counter.js_
* Value.js : 숫자를 보여줄 컴포넌트 (Dumb Component)
* Control.js : 버튼 3개를 보여줄 컴포넌트 (Dumb Component)
* Counter.js : Value.js , Control.js를 담고있는 부모 컴포넌트 (Smart Component)  

### _Value.js_
```Javascript
import React,{Component} from 'react';
import PropTypes from 'prop-types';

/* 숫자로 PropTypes 설정*/
const propTypes = {
    number: PropTypes.number
};
/* 기본값 설정*/
const defaultProps = {
    number : -1
};

class Value extends Component{
  
    render(){
        return(
            
            <div>
                {/*number props를 rendering*/}       
                <h1>{this.props.number}</h1>
            </div>
        );
    }
}

Value.propTypes = propTypes;
Value.defaultProps = defaultProps;

export default Value;
```

### _Control.js_
```JavaScript
import React, { Component } from "react";
import PropTypes from "prop-types";

/* 함수의 propTypes 설정*/
const propTypes = {
  onPlus: PropTypes.func, // 플러스
  onSubtract: PropTypes.func, // 마이너스
  onRandomizeColor: PropTypes.func, // 색변
};

/* 경고를 만드는 함수를 만드는 또 다른 함수*/
function createWarning(funcName) {
  return () => console.warn(funcName + " is not defined");
}

 /* 기본값으로 해당 함수가 설정되지 않았음을 알려주는 함수로 설정*/
const defalutProps = {
  onPlus:createWarning("onPlus"),
  onSubtract:createWarning("onSubtract"),
  onRandomizeColor:createWarning("onRandomizeColor"),
};

class Control extends Component {
  render() {
    return (
      <div>
        {/*Buttion 3개 렌더링 클릭시 실행될 함수를 props로 받아오기*/}
        <button onClick={this.props.onPlus}>+</button>
        <button onClick={this.props.onSubtract}>-</button>
        <button onClick={this.props.onRandomizeColor}>Randomize Color</button>
      </div>
    );
  }
}

Control.propTypes = propTypes;
Control.defalutProps = defalutProps;

export default Control;
```
### _Counter.js (Value.js,Control.js를 불러와서 렌더링 하는 Smart Component)_
```JavaScript
import React, { Component } from "react";
import Value from "./Value"; // Dumb 불러오기
import Control from "./Control"; // Dumb 불러오기
// import {connect, bindActionCreators} from "react-redux";
// redux에 연결하기 위해 connect 불러오기
import { connect } from "react-redux";
import * as actions from "../actions";

class Counter extends Component {
  constructor(props) {
    super(props);
    this.setRandomColor = this.setRandomColor.bind(this);
  }
    // 색변경 함수 생성
  setRandomColor() {
    const color = [
      Math.floor(Math.random() * 55 + 200),
      Math.floor(Math.random() * 55 + 200),
      Math.floor(Math.random() * 55 + 200)
    ];

    this.props.handleSetColor(color);
  }
  render() {
    const color = this.props.color;
    // 표현식으로 색 전달
    const style = {
      backgroud: `rgb(${color[0]},${color[1]},${color[2]})`,
    };
    return (
      <div style={style}>
        {/*Value, Control 렌더링*/}
        {/*props 전달받음*/}
        <Value number={this.props.number} />
        <Control
          onPlus={this.props.handleIncrement}
          onSubtract={this.props.handleDecrement}
          onRandomizeColor={this.setRandom}
        />
      </div>
    );
  }
}

// redux에 state 안에 있는 것을 Counter component의 props로 연결
const mapStateToProps = (state) => {
  return {
    number: state.counter.number, // counter.number <-> state 안의 값
    color: state.ui.color // ui.color <-> state 안의 값
  };
};

// action을 dispatch하는 함수를 prop로 연결
const mapDispatchToProps = (dispatch) => {
  // return bindActionCreators(actions,dispatch);
  return {
    handleIncrement: () => {
      dispatch(actions.increment());
    },
    handleDecrement: () => {
      dispatch(actions.decrement());
    },
    handleSetColor: (color) => {
      dispatch(actions.setColor(color));
    }
  };
};

// mapStateToProps, mapDispatchToProps를 사용해서 Counter 컴포넌트를 Redux에 연결
// connect 함수 사용
export default connect(mapStateToProps, mapDispatchToProps)(Counter);

```

### _App.js_ 
```JavaScript
import React, { Component } from "react";
import { render } from "@testing-library/react";
import { applyMiddleware } from "redux";
import Counter from "./Counter";
/*App 컴포넌트에서 Counter를 불러와서 렌더링을 통해 브라우저에서 확인 */
class App extends Component {
  render() {
    return(
    <Counter/>
    );
  }
}
export default App;

```
### **`Action 생성`**
1. 값 증가 액션
2. 값 감소 액션
3. 새로운 색상 설정 액션

### _ActionTypes.js_
```JavaScript
// 액션 이름 설정 후 다른 파일로 내보내기
export const INCREMENT = "INCREMENT"; 
export const DECREMENT = "DECREMENT";
export const SET_COLOR = "SET_COLOR";
```
### _actions/index.js_
```JavaScript
// 액션 객체 가져다 쓸 액션 생성자 만드는 공간
import * as types from "./ActionTypes";

export function increment() {
  return {
    type: types.INCREMENT,
  };
}

export function decrement() {
  return {
    type: types.DECREMENT,
  };
}

// 변수 있음
export function setColor(color) {
  return {
    type: types.SET_COLOR,
    color
  };
}

```

### **`reducer`생성**
### _reducers/counter.js_
```JavaScript
import { type } from "@testing-library/user-event/dist/type";
import * as types from "../actions/ActionTypes"; // 사용할 actiontypes 불러오기

// 초기상태 정하기 숫자세기
const initialState = {
  number: 0,
  dummy: "dumbdumb",
  dumbObject: {
    d: 0,
    u: 1,
    m: 2,
    b: 3,
  },
};

// 내보내기 위한 함수 state가 undefined일경우 기본 인수 사용
export default function counter(state = initialState, action) {
  /* ...*/
  switch (action.type) {
    // action type이 증가함수 일때 
    case type.INCREMENT:
      return {
        // 기존 스테이트를 복사하고 변화줄때 ...state 사용
        // 덮어 씌우기
        ...state,
        // 증가
        number: state.number + 1,
        // 기존에 것을 냅두고 u값만 바꾸고 싶다.
        dumbObject: { ...state.dumbObject, u: 0 },
      };
    case types.DECREMENT:
      return {
        ...state,
        number: state.number - 1,
      };
      // action types가 주어지지 않았을 때 기본 값은 state
    default:
      return state;
  }
}
```
### _ui.js 카운터의 배경색 담당_
```JavaScript
import * as types from '../actions/ActionTypes';

// 초기상태 흰색
const initialState = {
    color: [255,255,255]
};

export default function ui(state = initialState, action) {
    if(action.type == types.SET_COLOR) {
        return {
            color: action.color
        };
    } else {
        return state;
    }
}

```
### _reducers/index.js_
리듀서가 여러개일 때 합쳐줘야 함
```JavaScript
import { combineReducers } from "redux"; // 리덕스에서 제공하는 함수 불러오기
import counter from "./counter";
import ui from "./ui";

// combineReducers 사용
const reducers = combineReducers({
  counter,
  ui,
});
// 내보내주기
export default reducers;

```
### **`Store`생성** (Redux -> 단 하나의 스토어)
### _redux-example/src/index.js_
```JavaScript
import React from "react";
import * as ReactDOM from 'react-dom/client'
import App from './components/App'
import { createStore } from "redux"; // 스토어 만들기 위한 함수 가져오기
import reducers from "./reducers"; // 리듀서 불러오기
import {Provider} from 'react-redux';

const store = createStore(reducers); // 스토어 생성 인수에는 reducers

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
    /*App component와 Counter Component에서 store접근을 쉽게 해줌 -> 
    뷰 레이어 바인딩 (설정 필요)*/ 
    <Provider store={store}>
        <App/>
    </Provider>
    );
```
### **`Store`가 하는일**
3,4,5,6








