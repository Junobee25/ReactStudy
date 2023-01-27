# _2023-01-23_
## 쇼핑카트 페이지 만들기
1. 빈 쇼핑 카트 페이지 만들기  (Component)
2. 카트 페이지 Route 만들기 (another page -> cart page app.js)
3. Cart 페이지를 위한 탭을 만들기 (rightmenu.js login됬을때)
4. 카트 안에 들어가 있는 상품들을 DB에서 가져오기
# _2023-01-25_
### 📌 1. auth 요청에 cart,history가 있다면 Redux Store에 넣어주기
```JavaScript
router.get("/auth", auth, (req, res) => {
    res.status(200).json({
        _id: req.user._id,
        isAdmin: req.user.role === 0 ? false : true,
        isAuth: true,
        email: req.user.email,
        name: req.user.name,
        lastname: req.user.lastname,
        role: req.user.role,
        image: req.user.image,
        cart: req.user.cart, // auth 통과 후 cart , history가 있다면 Redux Store에 넣어줌
        history: req.user.history
    });
});
```
### 📌 2. CartPage Route만들기 (다른 페이지 -> Cart 페이지)
✅ App.js
```JavaScript
import CartPage from './views/CartPage/CartPage'; 
<Route exact path="/user/cart" component={Auth(CartPage, true)} />
// exact path = cart 페이지의 경로 , 로그인 한 사람만 Add Cart 가능하므로 null -> true
```
### 📌 3. CartPage를 위한 Tap 만들기
-> antd에서 Icon,Badge 스타일 가져오기 (Login 됬을때 사용가능해야 함)  
✅ RightMenu.js
```JavaScript
<Menu.Item key="cart" style={{paddingBotton:3}}>
    <Badge count={5}>
        <a href="/user/cart" style={{marginRight:-22,color:'#667777'}}>
          <Icon
            type="shopping-cart"
            style={{ fontSize: 30, marginBotton: 3 }}
          />
        </a>
      </Badge>
</Menu.Item>
```
### 📌 4. Cart안에 들어가 있는 상품들을 DB에서 가져오기
-> userData에 들어있는 cart 상품의 quantity를 product로 합쳐주기

# _2023-01-26_
### 📌 4. Cart안에 들어가 있는 상품들을 DB에서 가져오기 2
✅ user_actions.js  
CartPage에 
ADD 한상품의 id와 productDeail의 id가 같다면 quantitiy를 ReduxState에 추가해줌
```JavaScript
export function getCartItems(cartItems,userCart){
    
    const request = axios.get(`/api/product/products_by_id?id=${cartItems}&type=array`)
    .then(response =>{
            // response 안에 들어있는 것은 product 상품의 정보
            // CartItems들에 해당하는 정보들을 Product Collection에서 가져온 후에
            // Quantity 정보를 넣어준다.
            userCart.forEach(cartItems=>{
                response.data.product.forEach((productDetail,index)=>{
                    if(cartItems.id === productDetail._id){
                        response.data.product[index].quantity = cartItems.quantity
                    }
                })
            })
            return response.data
    });
        return {
        type: GET_CART_ITEMS,
        payload: request
    }
}
```
## 쇼핑카트 페이지 만들기 2
1. CartPage를 위한 UI 만들기 -> UserCardBlock Component
2. DB에서 가져온 DB를 Browser에서 보여주기
3. 카트 안에 있는 상품 총 금액 계산 -> item price x quantity
4. 카트에서 제거하는 기능 만들기
### 📌 1. CartPage를 위한 UI 만들기 -> UserCardBlock Component , 2. DB를 브라우저에서 보여주기
✅ UserCardBlock.js 생성 (UserCardBlock.css) -> CartPage로 import
```JavaScript
import React from 'react'
import "./UserCardBlock.css"
function UserCardBlock(props) {
    const renderCartImage = (images)=>{
        if(images.length>0){
            let image = images[0]
            return `http://localhost:5000/${image}`
        }
    }
    const renderItems=()=>(
        props.products && props.products.map(product=>(
            <tr>
                <td>
                    <img style={{width:'70px'}} alt="product" src={renderCartImage(product.images)}/>
                </td>
                <td>
                    {product.quantity}EA
                </td>
                <td>
                    $ {product.price}
                </td>
                <td>
                    <button>
                        Remove
                    </button>
                </td>
            </tr>
        ))
    )
  return (
    <div>
        <table>
            <thead>
                <tr>
                    <th>Product Image</th>
                    <th>Product Quantity</th>
                    <th>Product Price</th>
                    <th>Remove from Cart</th>
                </tr>
            </thead>
            <tbody>
                {renderItems()}
            </tbody>
        </table>
    </div>
  )
}

export default UserCardBlock
```
### 💡Product Depts 제거
###  📌 3. 카트 안에 있는 상품 총 금액 계산 -> item price x quantity
✅ CartPage.js
useState통해서 Total 값 관리 
```JavaScript
import React,{useEffect,useState} from 'react'
import {useDispatch} from 'react-redux'
import {getCartItems} from '../../../_actions/user_actions'
import UserCardBlock from './Sections/UserCardBlock';

function CartPage(props) {
  const dispatch = useDispatch();
  const [Total, setTotal] = useState(0)
  useEffect(() => {
    let cartItems=[]
    // 리덕스 User state안에 cart안에 상품이 들어있는지 확인
    if(props.user.userData && props.user.userData.cart){
      if(props.user.userData.cart.length>0){
        props.user.userData.cart.forEach(item=>{
          cartItems.push(item.id)
        })
        dispatch(getCartItems(cartItems,props.user.userData.cart)) // action 실행
        .then(response => {calculateTotal(response.payload)}) 
      }
    }

  }, [props.user.userData])

  let calculateTotal = (cartDetail) => {
    let total = 0;

    cartDetail.map(item => {
      total += parseInt(item.price,10) * item.quantity
    })
    setTotal(total)
  }
  
  return (
    <div style ={{width:'85%',margin:'3rem auto'}}>
        <h1>My Cart</h1>
      <div>
        <UserCardBlock products={props.user.cartDetail}/>
      </div>
      <div style={{marginTop:'3rem'}}>
        <h2>Total Amount: ${Total}</h2> 
      </div>
    </div>
  )
}

export default CartPage
```
# _2023-01-27_
## 카트에 들어 있는 상품 지우기
### 📌 props로 id 값을 가져와서 삭제
✅ UserCardBlock.js
```JavaScript
<button onClick={() => props.removeItem(product._id)}> {/**CartPage에 removeItem이 작동 */}
  Remove
</button>
```

✅ CartPage.js  
```JavaScript
let calculateTotal = (cartDetail) => {
    let total = 0;

    cartDetail.map(item => {
      total += parseInt(item.price,10) * item.quantity
    })
    setTotal(total)
    setShowTotal(true)  // 정보다 있다면 true
  }
let removeFromCart = (productId) => {
    dispatch(removeCartItem(productId))
    .then(response=>{
      if(response.payload.productInfo.length<=0){ // payload에 상품이 없을 때 state에 false줌
        setShowTotal(false)
      }
    })
  }
```

✅user.js  
router에 get요청 -> pull로 상품 삭제 및 새로운 데이터 갱신
```JavaScript
router.get('/removeFromCart',auth,(req,res)=>{

    //먼저 cart안에 내가 지우려고 한 상품을 지워주기
    User.findOneAndUpdate(
        {_id:req.user._id}, // auth middleware로 작성가능
        {
            "$pull":
            {"cart":{"id":req.query.id}}
        },
        {new:true},
        (err,userInfo) => {
            let cart = userInfo.cart;
            let array = cart.map(item=>{
                return item.id
            })
            //product collection에서 현재 남아있는 상품들의 정보를 가져오기
            Product.find({_id:{$in:array}})
            .populate('writer')
            .exec((err,productInfo)=>{
                return res.status(200).json({
                    productInfo,
                    cart
                })
            })
        }
    ) 
})
```
### 🤔 user_actions -> type -> reducer 

### 카트에 있는 모든 상품 지운 다음
📌 antd - empty로 UI 구현

