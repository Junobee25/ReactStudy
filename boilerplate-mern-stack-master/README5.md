# _2023-01-30_
## Paypal로 결제 하기(1)
1. SandBox Paypal 회원 가입 
2. Paypal을 위한 test ID 만들기
3. Payment Model 만들기 -> user,data,product
4. Paypal Button 만들기 -> npm install react-paypal-express-checkout--save

### 📌 Payment Model 만들기
```JavaScript
const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const paymentSchema = mongoose.Schema({
    // field는 user data product
    user:{
        type:Array,
        default:[]
    },
    data:{
        type:Array,
        default:[]
    },
    product:{
        type:Array,
        default:[]
    }
 
},{timestamps:true});



const Payment = mongoose.model("Payment", paymentSchema);

module.exports = { Payment };

```
### 📌 CartPage에 Paypal 보여주기 위해 컴포넌트 만들기
✅ Paypal.js
1. 페이팔 사이트에 있는 react-paypal-express-checkout를 가져온다
2. Component 이름만 Paypal로 바꿔준다.
3. CartPage에 import 해준다.
4. Button에 Style 적용한다.

### 📌 추가 -> CartPage에 상품이 있을 때만 Paypal 보여주기
```JavaScript
{ShowTotal&&
<Paypal/>
}
```
### 📌 페이팔 client 는 강사님꺼 Paypal login은 내꺼

### 📌 결제창에뜨는 Total 수정
결제 창에뜨는 Total은 CartPage의 Total state로 가져와서 props를 주기
✅ Paypal.js
```JavaScript
let env = 'sandbox'; // you can set here to 'production' for production
let currency = 'USD'; // or you can set this value from your props or state
let total = this.props.total;
``` 
### 📌 결제 후에 해야 할 일 1 User Collection 안에 History 필드 안에 간단한 결제 정보 넣어주기
1. 카트 비우기
2. 결제 정보 저장하기
- Payment Collection (Detailed)
- User Collection (Simple)

### 📌2. Payment Collection 안에 자세한 결제 정도 넣어주기




