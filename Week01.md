# _리액트 Study 1주차 학습노트_

> ## _섹션 0. 섹션 1. 오리엔테이션, React.Js 소개_

### **`용어 정리`**

- `React js` : 페이스북에서 Ui를 구현하기 위해 만든 Javascript기반 라이브러리
- `Redux` : 페이스북의 풀룩스 데이터 아키텍쳐 구현체 라이브러리, (app의 상태를 관리)
- `WebPack` : 모듈 번들러, 로더 및 플러그인을 통해 프로젝트를 빌드하는 작업을 도와줌
- `Express` : Node.js 환경에서 서버를 열기 쉽게 해주는 프레임워크
- `mongoose` : Node.js 서버에서 MongoDB를 간편하게 사용할 수 있게 해주는 프레임워크

### **`React.js 의 장점`**

- ✨ `Virtual DOM` 을 사용
- 서버 사이드 렌더링 & 클라이언트 사이드 렌더링 지원
- Garbage Colletion, 메모리, 성능 측면에서 좋음

### **`React.js 의 단점`**

- View기능만 있음 -> DB 모델링, 라우팅, ajax 기능이 없음
- IE8 이하의 버전은 지원X

>### **`🚀Advanced:`**

1. Virtual DOM 이란? : DOM이 생성되기 전, 이전 상태 값과 수정사항을 비교하여 달라진 부분만 DOM에게 한번에 업데이트 하는 가상DOM
2. Virtual DOM 사용시 성능이 좋은 이유 : 코드 수정 시 <b>렌더링이 한번</b>만 일어남 => 연산횟수 1번
3. 서버 사이드 렌더링 : 화면을 그리는 주체가 <b>서버</b>
4. 클라이언트 사이드 렌더링 : 화면을 그리는 주체는 <b>브라우저</b>

---

> ## _섹션 1. 섹션 2. React.Js 시작하기_
>
 ### **`JSX 란?`**
 ```JavaScript
 const element = <h1>Hello, world!</h1>
 ```  
 * 위에 태그 문법은 문자열,HTML도 아닌 JSX(JavaScript XML)라는 JavaScript XML을 추가하여  
 확장한 문법이다.
 * JSX는 **React ''엘리먼트(element)''** 를 생성한다. React 엘리먼트는 브라우저 DOM  
 엘리먼트와 달리 일반 객체이다.
 * React는 JSX 사용이 필수가 아니지만, JS 코드 안에서 UI관련 작업을 할 수 있기 때문에 시각적  
 으로 더 도움이 된다. 또한 JSX를 사용하면 React가 더욱 도움이 되는 에러 및 경고 메세지를 표시할 수 있게 해준다.

### **`문법`**
1. `Nested Element`  
컴포넌트에서 여러 Element를 렌더링 할때 꼭 container element 안에 포함해야함  
2. `JavaScript Expression`  
JSX 안에서 JavaScript를 표현하는 방법은 {}로 감싸주기  
3. `Inline Style`  
객체를 만들고 Inline Stlye에 표현식을 넣어주면 
4. `Comments`  
JSX 안에서는 {/*...*/}형식으로 주석 작성 ❗**container element** 안에

```JavaScript
class Codelab extends React.Component{
    render(){
        let text ='Hi i am codelab';
        let style = {
            backgroudColor : 'aqua'
        }
        return(
            <div style={style}>{text}</div>
        );
    }
}
class App extends React.Component{
    render(){
        return(
            <Codelab/>
        )
    }
}

ReactDOM.render(<App/>,document.getElementById('root'));
```
### **`props란?`**
- 프로퍼티, props(properties의 줄임말)라고 한다.
- 상위 컴포넌트가 하위 컴포넌트에 값을 전달할때 사용한다.
- 프로퍼티는 수정할 수 없는 읽기 전용 데이터 임  
### **`기본 값 설정`** 
* Component.defaultProps = {...}
### **`Type 검증`**
* Component.propTypes = {...}
* 특정 props 값 특정 Type 이 아니거나 필수 props 값이 입력되지 않았을 경우 경고창 띄울 수 있음
* 코드의 **유지보수** 를 위해서 설정할 필요가 있음

```JavaScript
class Codelab extends React.Component{
    render(){
        return(
            <div>
                <h1>Hello{this.props.name}</h1>
                <h2>{this.props.number}</h2>
                <div>{this.props.children}</div>
            </div>
        )
    }
}

/*Type 검증*/
Codelab.propTypes = {
    name:React.PropTypes.string,
    number:React.PropTypes.number.isRequired
};
/*defaultProps설정*/
Codelab.defaultProps={
    name:'Unknown'
};

class App extends React.Component{
    render(){
        return(
            <Codelab name={this.props.name} number={this.props.number}>{this.props.children}</Codelab>
        );
    }
};
/* App-Component의 Codelab-Component로 전달> props 값 설정 */
ReactDom.render(<App number={5}>I am your child</App>,document.getElementById('root'));
```
### **`state란?`**
* Component에서 유동적인 데이터를 보여줄 때 사용
* 초기값 설정이 필수,생성자(constructor)에서 `this.state={}`으로 설정
* 값을 수정 할때에는 this.setState({...}),렌더링 된 다음엔 `this.state=`사용❌❌
```JavaScript
class Counter extends React.Component{
    constructor(props){
        super(props);
        this.state = {
            value : 0
        };
        this.handleClick = this.handleClick.bind(this);
    }

    handleClick(){
        this.setState({
            value:this.state.value+1
        });
    }
    render(){
        return(
            <div>
                <h2>{this.state.value}</h2>
                <button onClick={this.handleChilck}>Press Me</button>
            </div>
        );
    }
};

class App extends React.Component{
    render(){
        return(
            <Counter/>
        );
    }
};
ReactDOM.render(
    <App></App>
    document.getElementById('root')
);
```
### **`Component Mapping이란?`**
* 데이터 배열을 리액트에서 렌더링할 때는 JS 내장함수인 `map()`사용
* `map()`은 파라미터로 전달 된 함수를 통하여 배열 내의 각 요소를 처리해서 그 결과로 새로운  
배열을 생성한다.
### **`map()`사용문법**
```JavaScript
arr.map(callback,[thisArg])
```
* `callback` : 새로운 배열의 요소를 생성하는 함수로서 다음 세가지 인수를 가진다.
  * `currentValue` : 현재 처리되고 있는 요소
  * `index` : 현재 처리되고 있는 요소의 index값
  * `array` : 메소드가 불려진 배열
* `thisArg` : callback 함수 내부에서 사용할 this값 설정 
```JavaScript
class ContactInfo extends React.Component{
    render(){
        return(
            <div>{this.props.contact.name}{this.props.contact.phone
            }</div>
        );
    }
};
class Contact extends React.Component{
    constructor(props){
        super(props);
        this.state={
            contactData:[
                {name:'Abet',phone:'010-0000-0001'},
                {name:'Betty',phone:'010-0000-0002'},
                {name:'Charlie',phone:'010-0000-0003'},
                {name:'David',phone:'010-0000-0004'}
            ]
        }
    }
    render(){
        const mapToComponent = (data) =>{
            return data.map((contact,i)=>{
                return(<ContactInfo contact={contact} key={i}/>)
            });
        };
        return(
            <div>
                {mapToComponent(this.state.contactData)}
            </div>
        )
    }
}

class App extends React.Component{
    render(){
        return(
            <Contact/>
        );
    }
};

ReactDOM.render(
    <App></App>
    document.getElementById('root')
);
```
>### **`🚀Advanced`**:
1. props vs state : 
---

> ## _섹션 2. 섹션 3. 개발환경 설정, 프로젝트 진행_
>
> 📖 배운 내용:


>### 🚀**Advanced**:

---

> ## _섹션 3. 섹션 4. 주소록 (Contact) 만들기_
>
> 📖 배운 내용:  
> ❓ 궁금증:

---
