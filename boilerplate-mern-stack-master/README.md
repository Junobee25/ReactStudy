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

# _2023-01-05_
### 📌 UploadPage Select Option 처리하기
`onChange` 이벤트를 통해 콜백함수 실행시 key : value 값에 따라 Option에서 Continent를 Select
```JavaScript
const Continents = [
  {key:1, value:"Africa"},
  {key:2, value:"Europe"},
  {key:3, value:"Asia"},
  {key:4, value:"North America"},
  {key:5, value:"South America"},
  {key:6, value:"Australia"},
  {key:7, value:"Antarctica"}
]


const continentChangeHandler = (event) => {
  setContinent(event.currentTarget.value)
}

        <select onChange={continentChangeHandler} value={Continent}>
          {Continents.map(item =>(
            <option key={item.key} value={item.key}>{item.value}</option>
          ))}
        </select>
```
### 📌 Drop-Zone 적용
`Drop-Zone`은 UploadPage 뿐만 아니라 다른 페이지에서도 사용될 수 있다.  
따라서 새로운 컴포넌트 폴더로 관리한다. (client/src/components/utils/FileUpload.js)

✅ UploadProductPage.js
```JavaScript
// UploadProductPage.js 에서 사용하기 위해 import
import FileUpload from '../../utils/FileUpload';

<Form>
        {/* DropZone */}
        <FileUpload/>
</Form>
```

`Drop-Zone`라이브러리 다운 받기
```JavaScript
npm install react-dropzone --save
```
`Drop-Zone` npm 사용방법  
✅ FileUpload.js
```JavaScript
import React from "react";
import Dropzone from 'react-dropzone'
import { Icon } from 'antd'  // antd 디자인
function FileUpload() {
  return (
    <div style={{ display:'flex', justifyContent:'space-between'}}>
      <Dropzone onDrop={(acceptedFiles) => console.log(acceptedFiles)}>
        {({ getRootProps, getInputProps }) => (
          
            <div
                style={{ width:300,height:240,border:'1px solid lightgray',
                display:'flex', alignItems:'center',justifyContent:'center'
            }}   
            {...getRootProps()}>
              <input {...getInputProps()} />
              <Icon type="plus" style={{fontsize: '3rem'}}/>
            </div>
          
        )}
      </Dropzone>
    </div>
  );
}

export default FileUpload;

```
# _2023-01-06_
### 📌 Drop-zone 파일 Back End로 보내기 
✅ FileUpload.js 의 Drop-zone `dropHandler`
```JavaScript
import axios from "axios"; // Front End 선택한 파일 -> Back End로 전달

function FileUpload(props) {
  const [Images, setImages] = useState([]);
  const dropHandler = (files) => {
    let formData = new FormData();
    const config = {
      headers: { "content-type": "multipart/form-data" },
    };
    formData.append("file", files[0]);
    axios.post("/api/product/image", formData, config).then((response) => {
      if (response.data.success) {
        setImages([...Images, response.data.filePath]);
        props.refreshFunction([...Images, response.data.filePath])

      } else {
        alert("파일을 저장하는데 실패 했습니다.");
      }
    });
  };
<Dropzone onDrop={dropHandler}>
        {({ getRootProps, getInputProps }) => (
          <div
            style={{
              width: 300,
              height: 240,
              border: "1px solid lightgray",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
            {...getRootProps()}
          >
            <input {...getInputProps()} />
            <Icon type="plus" style={{ fontsize: "3rem" }} />
          </div>
        )}
  </Dropzone>

```
### 📌 axios.post -> router로 받고,저장 (server/routes/product.js)
✅ product.js (가져온 이미지를 저장 -> multer 라이브러리를 사용해야 함)  
[multer사용법](https://www.npmjs.com/package/multer) `install`
```JavaScript
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "uploads/");  // 파일 저장 공간
  },
  filename: function (req, file, cb) {
    cb(null, `${Date.now()}_${file.originalname}`);  // 저장 시 이름
  },
});

const upload = multer({ storage: storage }).single("file");  // 가져온 이미지

router.post("/image", (req, res) => {
  // 가져온 이미지를 저장해주면 됨.
  upload(req, res, (err) => {
    if (err) {
      return req.json({ success: false, err });
    }
    return res.json({
      success: true,
      filePath: res.req.file.path,  // 파일 저장 경로
      fileName: res.req.file.filename,  // 파일 이름
    });
  });
});

```
### 📌 이미지에 대한 정보 {success,filePath,fileName} 를 BackEnd로 전달하기 위해 state로 저장
```JavaScript
function FileUpload(props) {
  const [Images, setImages] = useState([]);  // 배열 -> 이미지 여러개
  const dropHandler = (files) => {
    let formData = new FormData();
    const config = {
      headers: { "content-type": "multipart/form-data" },
    };
    formData.append("file", files[0]);
    axios.post("/api/product/image", formData, config).then((response) => {
      if (response.data.success) {
        setImages([...Images, response.data.filePath]);
        props.refreshFunction([...Images, response.data.filePath])

      } else {
        alert("파일을 저장하는데 실패 했습니다.");
      }
    });
  };
```
✅ Drop한 이미지에 대한 UI
```JavaScript
<div
        style={{
          display: "flex",
          width: "350px",
          height: "240px",
          overflowX: "scroll",
        }}
      >
        {Images.map((image, index) => (
          <div onClick={() => deleteHandler(image)} key={index}>
            <img
              style={{ minWidth: "300px", width: "300px", height: "240px" }}
              src={`http://localhost:5000/${image}`}
            />
          </div>
        ))}
      </div>

```







