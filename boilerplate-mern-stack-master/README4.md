# _2023-01-23_
## 쇼핑카트 페이지 만들기
1. 빈 쇼핑 카트 페이지 만들기  (Component)
2. 카트 페이지 Route 만들기 (another page -> cart page app.js)
3. Cart 페이지를 위한 탭을 만들기 (rightmenu.js login됬을때)
4. 카트 안에 들어가 있는 상품들을 DB에서 가져오기
# _2023-01-25_
### 📌1. auth 요청에 cart,history가 있다면 Redux Store에 넣어주기
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
### 📌2. CartPage Route만들기 (다른 페이지 -> Cart 페이지)
✅ App.js
```JavaScript
import CartPage from './views/CartPage/CartPage'; 
<Route exact path="/user/cart" component={Auth(CartPage, true)} />
// exact path = cart 페이지의 경로 , 로그인 한 사람만 Add Cart 가능하므로 null -> true
```
### 📌3. CartPage를 위한 Tap 만들기
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