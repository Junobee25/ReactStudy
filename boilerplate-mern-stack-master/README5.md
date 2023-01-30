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

