# _2023-01-18_

## 라디오 박스 필터 만들기 (가격에 따라서 요소들 필터링)

1. RadioBox 리스트 데이터들 만들기
2. RadioBox를 위한 UI만들기
3. onChange Function 만들기
4. Checked State를 부모 컴포넌트로 업데이트하기

### 1. RadioBox 리스트 데이터들 만들기

📌 client/src/components/LandingPage/Sections/Datas.js  
_UI에 `export`할 data만들어주기_

### 2. UI 만들기

LandingPage.js

```JavaScript
<Row gutter={[16,16]}>
    <Col lg={12} xs={24}>
        {/** CheckBox */}
        <Checkbox list={continents} handleFilters=
        {filter=>handleFilters(filter,"continents")}/>
    </Col>
    <Col lg={12} xs={24}>
        <RadioBox list ={price} handleFilters=
        {filter=>handleFilters(filter,"price")} >
        </RadioBox>
    </Col>
</Row>
```

### 3,4 onChange Function + useState로 업데이트

RadioBox.js

```JavaScript
import React, { useState } from "react";
import { Collapse, Radio } from "antd";
const {Panel} = Collapse;
function RadioBox(props) {

    const [Value, setValue] = useState(0)

    const renderRadioBox = () => (
        props.list && props.list.map(value => (
            <Radio key={value._id} value={value._id}>{value.name}</Radio>

        ))
    )
   const handleChange = (event) => {
        setValue(event.target.value)
        props.handleFilters(event.target.value)
   }
  return (
    <div>
      <Collapse defaultActiveKey={["0"]}>
        <Panel header="Price" key="1">
            <Radio.Group onChange={handleChange} value={Value}>
                {renderRadioBox()}
            </Radio.Group>
        </Panel>
      </Collapse>
    </div>
  );
}

export default RadioBox;
```

# _2023-01-19_

## 라디오박스 필터 만들기 2

1. handleFilter Function
2. handleFilter를 위한 handlePrice funcion 만들기
3. 필터 기능을 위한 getProduct Router 수정

✅ 1,2 handleFilter Function handleFilter를 위한 handlePrice funcion 만들기  
LandingPage.js

```JavaScript
 const handlePrice = (value) => {
    const data = price;
    let array = [];
    for (let key in data) {
      if (data[key]._id === parseInt(value, 10)) {
        array = data[key].array;
      }
    }
    return array;
  };

  const handleFilters = (filters, category) => {
    const newFilters = { ...Filters };

    newFilters[category] = filters;

    console.log("filters", filters);

    if (category === "price") {
      let priceValues = handlePrice(filters);
      newFilters[category] = priceValues;
    }
    showFilterResults(newFilters);
    setFilters(newFilters)
  };
```

✅ 3. 필터 기능을 위한 getProduct Router 수정

product.js

```JavaScript
for(let key in req.body.filters){

    if(req.body.filters[key].length>0){

      console.log('key',key)  // <----
      if(key === "price"){
        findArgs[key] = {
          // greater than equal 이것보다 크거나 같고
          $gte:req.body.filters[key][0], // 0
          // less than equal [0,199],[200,249],,,,
          $lte:req.body.filters[key][1] // 199
        }

      }else{
        findArgs[key] = req.body.filters[key];
      }

    }

  }
  console.log('findArgs',findArgs)
```

## 검색 기능 만들기

1. SearchFeature Component 만들기
2. Search 기능을 위한 UI 만들기
3. onChange Function 만들기
4. search Data를 부모 컴포넌트에 업데이트 하기

### 1. SearchFeature Component 만들기

✅ client/src/components/views/LandingPage/Sections/SearchFeature.js  
-> rfce 후 LandingPage 에서 import 후 사용

### 2. Search 기능을 위해 UI 만들기

📌 antd - input ,search  
✅ SearchFeature.js

```JavaScript
import React from 'react';
import { Input } from 'antd';
const { Search } = Input;
```

✅ LandingPage.js

```JavaScript
<div style={{display:'flex',justifyContent:'flex-end',margin:'1rem auto'}}>
      <SearchFeature/>
```

### 3. onChange Function

searchHandler and useState  
✅ SearchFeature.js

```JavaScript
function SearchFeature() {

    const [SearchTerm, setSearchTerm] = useState("") // 기본 빈값
    const searchHandler = (event) => {
        setSearchTerm(event.currentTarget.value) // 타이핑할 때마다 바꿔주기
    }
  return (
    <div>
        <Search
    placeholder="input search text"
    onChange={searchHandler}
    style={{ width: 200,}}
    value={SearchTerm}  // value는 use State로 넣어주기
  /></div>
  )
}
```

### 4. search Data를 부모 컴포넌트에 업데이트 하기 (SearchTerm -> LandingPage)

SearchTerm Update
✅ LandingPage.js

```JavaScript
<SearchFeature refreshFunction={updateSearchTerm}/>
```

✅ SearchFeature.js

```JavaScript
function SearchFeature(props) {

    const [SearchTerm, setSearchTerm] = useState("")
    const searchHandler = (event) => {
        setSearchTerm(event.currentTarget.value)
        props.refreshFunction(event.currentTarget.value) // 타이핑 할 때마다 바뀐 값이 LandingPage로 전달
    }
  return (
    <div>
        <Search
    placeholder="input search text"
    onChange={searchHandler}
    style={{ width: 200,}}
    value={SearchTerm}
  /></div>
  )
}
```

✅ LandingPage.js (전달받은 props를 state에 담기)

```JavaScript
const [SearchTerm, setSearchTerm] = useState("")
const updateSearchTerm = (newSearchTerm) => {
    setSearchTerm(newSearchTerm)
  }
```

### 검색기능 만들기2

1. 검색 값을 이용한 getProduct Function을 작동시키기
2. Search 기능을 위해서 getProduct Route 수정하기
3. Search 기능을 가능하게 하기 위해서 Produt Model에 무엇을 추가하기

✅ LadingPage.js

1. 검색 값을 이용한 getProduct Function 작동
   updateSearchTerm에서 `getProducts` 통해 body 값에 맞게  
    back end에서 처리

```JavaScript
 const updateSearchTerm = (newSearchTerm) => {
   let body = {
     skip:0,
     limit:Limit,
     filters:Filters,
     SearchTerm:newSearchTerm
   }
   setSkip(0)
   setSearchTerm(newSearchTerm)
   getProducts(body)
 }
```

2.  Search 기능을 위해서 `getProduct Route` 수정하기
    ✅product.js

```JavaScript
let limit = req.body.limit ? parseInt(req.body.limit) : 20;
 let skip = req.body.skip ? parseInt(req.body.skip) : 0;
 let term = req.body.searchTerm // Input에 입력한 값이 term에 할당

 if(term){

   Product.find(findArgs)
   .find({$text:{$search:term}}) // mongoDB 문법을 써야함 타이핑한 searchTerm에 대해 mongoDB의 Collection과 일치하는 자료를 가져옴
   .populate("writer") // 이 사람에 대한 모든 정보 가져오기
   .skip(skip)
   .limit(limit)
   .exec((err, productInfo) => {
     if (err) return res.status(400).json({ success: false });
     return res.status(200).json({ success: true, productInfo,
                                   postSize:productInfo.length});
   })

 }else{

   Product.find(findArgs)
   .populate("writer") // 이 사람에 대한 모든 정보 가져오기
   .skip(skip)
   .limit(limit)
   .exec((err, productInfo) => {
     if (err) return res.status(400).json({ success: false });
     return res.status(200).json({ success: true, productInfo,
                                   postSize:productInfo.length});
   })

 }
```

3. Search 기능을 가능하게 하기 위해서 Product Model에 무엇을 추가 해주기
   ✅ Product.js

```JavaScript
productSchema.index({
  title:'text',
  description:'text'
},{
  weights:{
    title:5,
    description:1
  }
})
```

# _2022-01-20_

## 상세 보기 페이지 만들기

### 상품의 상세정보를 DB에서 ㅏ져오기

1. 빈 상품 상세 페이지 만들기
2. Product detail page를 위한 Route만들기
3. Product 정보를 DB에서 가져오기
4. Product detail 페이지 UI 만들기

---

1. 상품들의 Unique Id를 이용해서 링크주기

✅ LandingPage.js

```JavaScript
<Card cover=
{<a href={`/product/${product._id}`}><ImageSlider images={product.images}/></a>}
>
```

[고유한ID값으로링크주기](http://localhost:3000/product/63bd7cec55d1aa2d308ac094)  
2. Proudect detail page를 위한 Route만들기  
✅ App.js
유동적으로 바뀌는 url에 대한 path 설정해주기

```JavaScript
<Route exact path="/product/:productId" component={Auth(DetailProductPage, null)} /> {/**아무나 들어갈 수있도록 null */}
```

3. product 정보를 DB에서 가져오기  
   상세보기 창에 보여지는 Price , Sold, View, Description에 대한 정보를 ID를 이용해서 가져오기  
   ✅ DetailProductPage.js _(`useEffect`를 통해서 id값을 쿼리형태로)_

```JavaScript
function DetailProductPage(props) {
    const productId = props.match.params.productId
    useEffect(() => {
        axios.get(`/api/product/products_by_id?id=${productId}&type=single`)
            .then(response => {
                if(response.data.success){

                }else{
                    alert('상세 정보 가져오기를 실패했습니다')
                }
            })
      return () => {

      }
    },[])
```

✅product.js

```Javascript
router.get("/products_by_id", (req, res) => {
  let type = req.query.type
  let productId = req.query.id

  // productId를 이용해서 DB에서 productId와 같은 상품의 정보를 가져온다.
  Product.find({_id:productId})
  .populate('writer')
  .exec((err,product)=>{
    if(err) return res.status(400).send(err)
    return res.status(200).send({success:true,product})
  })

});

```

[response.data](http://localhost:3000/product/63bd7cec55d1aa2d308ac094)

---

### Product detail 페이지 UI 만들기 (갤러리 라이브러리)

💡C:\Users\Bae J\Desktop\성장\ReactStudy\ReactStudy\boilerplate-mern-stack-master\client>  
npm install react-image-gallery --save

### 상세보기 UI, product data

✅ DetailProductPage.js (response로 받은 객체형식의 product data를 state로 관리)

```JavaScript
import React from 'react'
import axios from 'axios'
import { useEffect,useState } from 'react'
function DetailProductPage(props) {
    const productId = props.match.params.productId
    const [Product, setProduct] = useState({}) // 상세보기 response.data state로 관리

    useEffect(() => {
        axios.get(`/api/product/products_by_id?id=${productId}&type=single`)
            .then(response => {
                if(response.data.success){
                    console.log('response.data',response.data)
                    setProduct(response.data.product[0])
                }else{
                    alert('상세 정보 가져오기를 실패했습니다')
                }
            })
      return () => {

      }
    },[])

  return (
    <div style={{width:'100%',padding:'3rem 4rem'}}>
      <div style={{width:'flex',justifyContent:'center'}}>
        <h1>{Product.title}</h1>
      </div>

      <br/>
      {/** ProductImage */}
      {/** ProductInfo */}
    </div>
  )
}
```

### `Image` ,`Info Component` (썸네일 다음에 만들어보기)

```JavaScript
import ProductImage from './Sections/ProductImage'
import ProductInfo from './Sections/ProductInfo'
import { Row, Col } from "antd"; // 반응형으로 만들기


<Row gutter={[16, 16]}>
    <Col lg={12} sm={24}>
      {/** ProductImage */}
      <ProductImage />
    </Col>

    <Col lg={12} sm={24}>
      {/** ProductInfo */}
      <ProductInfo />
      </Col>
</Row>
```

### Image Component

```JavaScript
import React,{useState,useEffect} from 'react';
import ImageGallery from 'react-image-gallery'; // ImageGallery 사용

function ProductImage(props) {

    const [images, setImages] = useState([])

    useEffect(() => {
      if(props.detail.images && props.detail.images.length > 0){
        let images = []

        props.detail.images.map(item => {
            images.push({
                original: `http://localhost:5000/${item}`, // Dynamic하게 바꿔줘야 함
                thumbnail:`http://localhost:5000/${item}`
            })
        })
        setImages(images)
      }

      return () => {

      }
    }, [props.detail]) // props.detail이 바뀔때마다 lift cycle을 한번더 실행


  return (
    <div>
        <ImageGallery items={images}/>
    </div>
  )
}

export default ProductImage
```

### Info Component 만들기 (Antd사용)

```JavaScript
import { Button, Descriptions } from "antd";
import React from "react";
function ProductInfo(props) {
  // props로 정보 가져오기
  return (
    <div>
      <Descriptions title="Product Info" bordered>
        <Descriptions.Item label="Price">{props.detail.price}</Descriptions.Item>
        <Descriptions.Item label="Sold">{props.detail.sold}</Descriptions.Item>
        <Descriptions.Item label="View">{props.detail.views}</Descriptions.Item>
        <Descriptions.Item label="Description">{props.detail.description}</Descriptions.Item>
      </Descriptions>
      <br />
      <br />
      <br />
      <div style={{ display: "flex", justifyContent: "center" }}>
        <Button size="large" shape="round" type="danger">
            Add to Cart
        </Button>
      </div>
    </div>
  );
}

export default ProductInfo;
```

---

### Cart 만들기 (User Collection 에서 데이터 관리)

User Model에 cart, history field 만들기
✅ User.js

```JavaScript
cart:{
      type:Array,
      default: []
    },
history:{
    type:Array,
    default:[]
    }
```

[MongoDBCollection Cart [id,quantity,date]](https://cloud.mongodb.com/v2/635671ed1d73b845fd4a776a#/metrics/replicaSet/63b27a4c854257296a61e7b7/explorer/test/users/find)  
3가지 User Action에 관한 정보는 Redux를 통해 처리

✅ ProductInfo.js

```JavaScript
import { useDispatch } from "react-redux"; // Redux Hook 이용
import { addToCart } from "../../../../_actions/user_actions";
function ProductInfo(props) {
    const dispatch = useDispatch();

  const clickHandler = (event) => {
        // 필요한 정보를 Cart Field에 넣어주기 필요한 것 상품ID,갯수,date정보
        dispatch(addToCart(props.detail._id)) // action name -> addToCart(상품.id)
  }


  <Button size="large" shape="round" type="danger" onClick={clickHandler}>
            Add to Cart
  </Button>
```

### Action

✅ clinet/src/\_actions/user_actions.sjs

```JavaScript
export function addToCart(id){
    let body = {
        productId : id
    }
    const request = axios.post(`${USER_SERVER}/addToCart`,body)
    .then(response => response.data);

    return {
        type: ADD_TO_CART,
        payload: request
    }
}
```

✅types.js

```JavaScript
export const ADD_TO_CART = 'add_to_cart';
```

### Reducer

✅ clinet/src/\_reducers/user_reducers.js

```JavaScript
import {
    LOGIN_USER,
    REGISTER_USER,
    AUTH_USER,
    LOGOUT_USER,
    ADD_TO_CART
} from '../_actions/types';


export default function(state={},action){
    switch(action.type){
        case REGISTER_USER:
            return {...state, register: action.payload }
        case LOGIN_USER:
            return { ...state, loginSucces: action.payload }
        case AUTH_USER:
            return {...state, userData: action.payload }
        case LOGOUT_USER:
            return {...state }
        case ADD_TO_CART:
            return {...state }
        default:
            return state;
    }
}
```
___
### 🔥User routes 구현 server/routes/user.js

📌 카트 안에 내가 추가하는 상품이 이미 있다면 -> 상품 개수 1개 올리기  
📌 이미 있지 않다면 -> Quantity는 1이됨  
📌 이렇게 카트에 상품이 추가 된 정보를 Redux 안에 저장 -> Auth Route 바꾸기 cart field와 history field 추가

```JavaScript
router.post("/addToCart", auth, (req, res) => {
   // 먼저 User Collection에 해당 유저의 정보를 가져오기 (req.user 사용가능 -> middleware auth의 토큰이용)
    User.findeOne({_id:req.user._id},
        (err,userInfo) => {
    // 가져온 정보에서 카트에다 넣으려 하는 상품이 이미 들어 있는지 확인
    let duplicate = false;
            userInfo.cart.forEach((item) => {
                if(item.id === req.body.productId){
                    duplicate = true;
                }
            })
             // 상품이 이미 있을 때
            if(duplicate){
                User.findOneAndUpdate(
                    // user id를 지정하고 해당 상품 cartid를 지정
                    {_id:req.user._id,"cart,id":req.body.productId},
                    {$inc:{"cart.$.quantitiy":1}}, // 갯수 1개 올려줌 2면 2개씩 올려줌
                    {new:true}, // update된 결과 값을 받을려면 new:true옵션 줘야함
                    (err,userInfo) => {
                        if(err) return res.status(400).json({success:false,err})
                        res.status(200).send(userInfo.cart) //cart collection

                    }
                )
            // 상품이 이미 있지 않을 때
            }else{
                User.findOneAndUpdate(
                    {_id:req.user._id},
                    {
                        $push:{  // cart에 id qua,date 넣어주기
                            cart:{
                                id:req.body.productId,
                                quantity:1,
                                date:Date.now()
                            }
                        }
                    },
                    {new:ture},
                    (err,userInfo) => {
                        if(err) return res.status(400).json({success:false,err})
                        res.status(200).send(userInfo.cart)
                    }
                )
            }
        })
});
```
1. if문 통해서 cart data 보내주면 
2. useraction의 request를통해
3. userreducer ADD_TO_CART 해줌

✅ Reducer
```JavaScript
export default function(state={},action){
    switch(action.type){
        case REGISTER_USER:
            return {...state, register: action.payload }
        case LOGIN_USER:
            return { ...state, loginSucces: action.payload }
        case AUTH_USER:
            return {...state, userData: action.payload }
        case LOGOUT_USER:
            return {...state }
        case ADD_TO_CART:
            return {...state,   // 모든 스테이트, 유저 정보 ,기존의 모든 정보,action cart 정보
                    userData:{
                        ...state.userData,
                        cart:action.payload
                    } }
        default:
            return state;
    }
}
```
