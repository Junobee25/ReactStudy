# _2023-01-04_
### **초기설정**
**`Error`**
1. 프로젝트 생성하고 npm install 시 bcript 문제 :     
**npm remove bcrypt 후 → npm install bcryptjs 하고 bcrypt부분 bcryptjs로 전부 바꾸기**
2. npm run dev 문제 : **Node js 버전 다운그레이드 하기**
3. [참고] MongoDB 접속 오류 : **querySrv ENODATA (MongoDB Atlas에 접속되지 않는 이슈)**  
Connect your application의 VERSION -> 2.2.12 or later로 변경
### **업로드 페이지  만들기**
**`Error`**
1. MongooseError [MongooseServerSelectionError]: bad auth : Authentication failed.  
 (npm run dev 시 로그인도 안했는데 Logout페이지로 가는 오류) : dev에서 mongoURI 설정 시 꺽새 안에 아이디 비번을 입력해야됨  

  

### 📌기본 UI 설계
✅ client/src/components/views/UploadProductPage 경로에 UploadProductPage.js 생성  
UploadProductPage.js
```JavaScript
<div style={{ maxWidth: "700px", margin: "2rem auto" }}>
      <div style={{ textAlign: "center", marginBottom: "2rem" }}>
        <h2>여행 상품 업로드</h2>
      </div>

      <Form>
        {/* DropZone */}
        <br />
        <br />
        <label>이름</label>
        <Input onChange={titleChangeHandler} value={Title} />
        <br />
        <br />
        <label>설명</label>
        <TextArea onChange={descriptionChangeHandler} value={Description}/>
        <br />
        <br />
        <label>가격($)</label>
        <Input type="number" onChange={priceChangeHandler} value={Price}/>
        <br />
        <br />
        <select>
          <option></option>
        </select>
        <br />
        <br />
        <Button>확인</Button>
      </Form>
    </div>

```
### 📌 UI에 onChange Event 부여
`onChange` 이벤트 실행시 각각의 애로우fuc 실행  
UploadProductPage.js  
```JavaScript
import React , {useState} from "react";

function UploadProductProductPage() {

  const [Title,setTitle] = useState("")
  const [Description,setDescription] = useState("")
  const [Price,setPrice] = useState(0)
  const [Continent,setContinent] = useState(1)
  const [Images,setImages] = useState([])

  const titleChangeHandler = (event) => {
    setTitle(event.currentTarget.value)
  }
  const descriptionChangeHandler = (event) =>{
    setDescription(event.currentTarget.value)
  }
  const priceChangeHandler = (event) => {
    setPrice(event.currentTarget.value)
  }
}
```



