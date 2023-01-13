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
