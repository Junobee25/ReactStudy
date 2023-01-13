# _2023-01-11_

## 상품 리스트 랜딩페이지에 나열하기

1. 빈 랜딩 페이지 생성
2. Mongo DB에 저장되어 있는 DB가져오기
3. 랜딩 페이지 UI 만들기
4. 상품 리스트들을 화면에 보여주기 -> map() methods 사용

### 2. Mongo DB에 저장되어 있는 DB가져오기

💡 `useEffect`,`axios` 라이브러리 사용
✅LandingPage.js

```JavaScript
function LandingPage(){
    useEffect(() => {

        axios.post('/api/product/products')
        .then(response=>{
            if(response.data.success){
                console.log(response.data) // 받아온 정보 console => Object

            }else{
                alert("상품들을 가져오는데 실패")
            }
        })
    })
}
```

✅product.js

```Javascript
router.post('/products',(res,req)=>{
    // product collection에 들어 있는 모든 상품 정보를 가져오기
    // Product Model에 collection 찾기 find
    Product.find()  // writer의 ID이용해서 writer의 모든 정보가져오기
    .populate("writer")
    .exec((err,productInfo)=>{
        if(err) return res.status(400).json({success:false,err})
        return res.status(200).json({success:true,productInfo})
    })
})
```

### 3. Landing Page UI 만들기 (Card 만들기)
💡`Done-zone` 해준 Object를 LandingPage.js(UI)로 전달 , Design -> antd 사용
✅LandingPage.js(UI)
```Javascript
 <div style={{ width: "75%", margin: "3rem auto" }}>
    <div style={{ textAlign: 'center' }}>
        <h2>Let's Travel AnyWhere</h2>
    </div>

    <div style={{ justifyContent: 'center' }}>
        <button>더보기</button>
    </div>
 </div>

 <Row gutter={[16,16]}> // gutter 여백 생김
 {renderCards}
 </Row>
```

```JavaScript
import { Icon, Col, Card, Row} from 'antd';
  const [Products, setProducts] = useState([]); // 

  axios.post('/api/product/products')
    .then(response => {
        if (response.data.success){
            console.log(response.data)
            setProducts(response.data.productInfo);
        } else {
            alert("상품들을 가져오는데 실패했다.")
        }
    })

```
product 에는 Object의 정보들이 Collection 형태로 저장되어 있음
```JavaScript
const renderCards = Products.map((product,index)=>{ //map : 으로 product control후 카드로 생성
    return <Col lg={6} md={8} xs={24}> 
    <Card key = {index} cover={
        <img style={{witdh:'100%',maxHeight:'150px'}}src= {`http://localhost:5000/${product.images[0]}`}/>}>
        <Meta title={product.title} description={`$${product.price}`}/>
            </Card>
        </Col>
})

// Card 에는 Image 정보를 Meta에는 Title와 가격에 대한 정보를 받아옴
```
# _2023-01-12_
### 3. Landing Page UI 만들기 (Image Slider)
💡`antd` - `Carousel` 사용 (새로운 컴포넌트로 관리)
client/src/components/utils/ImageSlider.js  
✅ ImageSlider.js  // LandingPage.js에서 사용하기 위해 import ImageSlider 해주기  
`autoplay` -> 슬라이딩 자동으로 해주는 함수
```JavaScript
import React from 'react'
import { Carousel } from 'antd'
//image -> product.images를 props로 가져오고 map으로 컨트롤
function ImageSlider(props) {
  return (
    <div>
        <Carousel autoplay>
            {props.images.map((image,index)=>(
                <div key={index}>
                    <img style={{width:'100%',maxHeight:'150px'}}
                        src={`http://localhost:5000/${image}`}/> 
                </div>
            ))}
        </Carousel>
  </div>
  )
}

export default ImageSlider
```
✅LandingPage.js
ImageSlider 사용
```JavaScript
<Card cover = {<ImageSlider images={product.images}/>}>
</Card>
```
### 더보기 Button 만들기
🚀 *사용된 MongoDB Method : SKIP,LIMIT*  
`SKIP`: 어디서 부터 데이터를 가져오는지에 대한 위치
처음에는 0부터 시작 Limit이 6이라면 다음은 2rd Skip = 0 + 6  
`LIMIT`: 처음 데이터를 가져올때와 더보기 버튼을 눌러서 가져올 때 얼마나 많은 데이터를 한번에 가져오는지
✅LandingPage.js  
`Button` onClick Function을 통해 Control
```JavaScript
// state로 Skip과 Limit를 관리
const [Skip,setSkip] = useState(0)
const [Limit,setLimit] = useState(8)

// Skip,Limit 이용해서 8개만 가져올 수 있게함
useEffect(() =>{
    let body ={
        skip:skip,
        limit:Limit
    }
})
//더보기 Button onClick
const loadMoreHandler = () => {

}
 <button onClick={loadMoreHandler}>더보기</button>
```
✅product.js
```JavaScript
router.post('/products',(res,req)=>{
    // skip 과 limit에 대한 정보 받아주기
     let limit = req.body.limit ? parseInt(req.body.limit) : 20;
     let skip = req.body.skip ? parseInt(req.body.skip) : 0;
    // product collection에 들어 있는 모든 상품 정보를 가져오기
    // Product Model에 collection 찾기 find
    Product.find()  // writer의 ID이용해서 writer의 모든 정보가져오기
    .populate("writer")
    .skip(skip) // MongoDB에 알려주기 
    .limit(limit) // 8개만 가져오기 (state = 8)
    .exec((err,productInfo)=>{
        if(err) return res.status(400).json({success:false,err})
        return res.status(200).json({success:true,productInfo})
    })
})

```

### 더보기버튼(2) Click시 사진 추가 (SKIP,LIMIT) 다시 들어보기
✅LandingPage.js  
```JavaScript
useEffect(() => {
    let body = {
      skip: Skip,
      limit: Limit,
    };
    getProducts(body);
},[])
const getProducts = (body) => {
    axios.post("/api/product/products", body).then((response) => {
      if (response.data.success) {
        if (body.loadMore) {
          setProducts([...Products, ...response.data.productInfo]);
        } else {
          setProducts(response.data.productInfo);
        }
        setPostSize(response.data.postSize)
      } else {
        alert("상품들을 가져오는데 실패 했습니다.");
      }
    });
  };
const loadMoreHandler = () => {

    let skip = Skip + Limit // 0 + 8 -> 8 + 8

    let body = {
      skip: Skip,
      limit: Limit,
      loadMore: true,
    };


    getProducts(body);
    setSkip(skip);

}
```
💡PostSize를 통해 더보기 버튼 없애주기
```JavaScript
const [PostSize, setPostSize] = useState(0);

{PostSize>=Limit &&
        <div style={{ display: "flex", justifyContent: "center" }}>
            <button onClick={loadMoreHandler}>더보기</button>
        </div>
      }
```
✅product.js
```JavaScript
Product.find(findArgs)
    .populate("writer") // 이 사람에 대한 모든 정보 가져오기
    .skip(skip)
    .limit(limit)
    .exec((err, productInfo) => {
      if (err) return res.status(400).json({ success: false });
      return res.status(200).json({ success: true, productInfo,
                                    postSize:productInfo.length});
    });
```
# _2023-01-13_
## CheckBox 만들기
1. CheckBox 리스트 데이터 만들기
2. CheckBox를 위한 UI 만들기
3. onChange Function 만들기
4. Checked State를 부모 Component로 Update하기
### 1. CheckBox 리스트 데이터 만들기
client/src/components/views/LandingPage/Sections/Datas.js
✅Datas.js (Data만들기)
```JavaScript
const continents = [
    {
        "_id":1,
        "name":"Africa"
    },
    {
        "_id":2,
        "name":"Europe"
    },
    {
        "_id":3,
        "name":"Asia"
    },
    {
        "_id":4,
        "name":"North America"
    },
    {
        "_id":5,
        "name":"South America"
    },
    {
        "_id":6,
        "name":"Australia"
    },
    {
        "_id":7,
        "name":"Antarctica"
    }

]

export {
    continents
}
```
### CheckBox UI 만들기
💡`antd` - `Collapse`,`antd`-`CheckBox`로 Design  
📌 CheckBox.js 새로운 컴포넌트 만들어 관리  
client/src/components/views/LandingPage/Sections/Datas.js  
✅CheckBox.js (LandingPage import 해주기)
```JavaScript

import React, { useState } from "react";
import {Collapse,Checkbox} from "antd";

const {Panel} = Collapse;
function CheckBox(props) { //props list

    const [Checked,setChecked] = useState([])

    const handelToggle = (value) => {

      // 누른 것의 Index를 구하고

      const currentIndex = Checked.indexOf(value)

      // 전체 Checked된 State에서 현재 누른 CheckBox가 이미 있다면

      const newChecked = [...Checked]
      // State 젛어준다
      if(currentIndex === -1){
        newChecked.push(value)
      // 빼주고
      } else{
        newChecked.splice(currentIndex,1)
      }
      setChecked(newChecked)
      props.handleFilters(newChecked)
    }

    const renderCheckboxLists = () => props.list && props.list.map((value,index)=>(
        <React.Fragment key={index}>
            <Checkbox onChange={() => handelToggle(value._id)} 
            checked={Checked.indexOf(value._id) === -1 ? false : true}/>
                <span>{value.name}</span> 
        </React.Fragment>
    ))
  return (
    <div>
      <Collapse defaultActiveKey={["1"]}>
        <Panel header="This is panel header 1" key="1">
            {renderCheckboxLists()}
        </Panel>
      </Collapse>
    </div>
  );
}

export default CheckBox;


```
✅LandingPage.js에서 사용
```JavaScript
<Checkbox list={continents} handleFilters={filter=>handleFilters(filter,"continents")}/>
```



