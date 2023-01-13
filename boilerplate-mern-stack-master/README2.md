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