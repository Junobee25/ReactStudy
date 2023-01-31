const express = require('express');
const router = express.Router();
const { User } = require("../models/User");
const {Product} = require("../models/Product")

const { auth } = require("../middleware/auth");

//=================================
//             User
//=================================

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

router.post("/register", (req, res) => {

    const user = new User(req.body);

    user.save((err, doc) => {
        if (err) return res.json({ success: false, err });
        return res.status(200).json({
            success: true
        });
    });
});

router.post("/login", (req, res) => {
    User.findOne({ email: req.body.email }, (err, user) => {
        if (!user)
            return res.json({
                loginSuccess: false,
                message: "Auth failed, email not found"
            });

        user.comparePassword(req.body.password, (err, isMatch) => {
            if (!isMatch)
                return res.json({ loginSuccess: false, message: "Wrong password" });

            user.generateToken((err, user) => {
                if (err) return res.status(400).send(err);
                res.cookie("w_authExp", user.tokenExp);
                res
                    .cookie("w_auth", user.token)
                    .status(200)
                    .json({
                        loginSuccess: true, userId: user._id
                    });
            });
        });
    });
});

router.get("/logout", auth, (req, res) => {
    User.findOneAndUpdate({ _id: req.user._id }, { token: "", tokenExp: "" }, (err, doc) => {
        if (err) return res.json({ success: false, err });
        return res.status(200).send({
            success: true
        });
    });
});

router.post("/addToCart", auth, (req, res) => {
   // 먼저 User Collection에 해당 유저의 정보를 가져오기 (req.user 사용가능 -> middleware auth의 토큰이용)
    User.findOne({_id:req.user._id},
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
                    {_id:req.user._id,"cart.id":req.body.productId},
                    {$inc:{"cart.$.quantity":1}}, // 갯수 1개 올려줌 2면 2개씩 올려줌
                    {new:true}, // update된 결과 값을 받을려면 new:true옵션 줘야함
                    (err,userInfo) => {
                        if(err) return res.status(200).json({success:false,err})
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
                    {new:true},
                    (err,userInfo) => {
                        if(err) return res.status(400).json({success:false,err})
                        res.status(200).send(userInfo.cart)
                    }
                )
            }
            
        })


  


   
});

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

router.post('/successBuy',auth,(req,res)=>{

    // 1. User Collection 안에 History 필드 안에 간단한 결제 정보 넣어주기
    let history = [];
    let transactionData = {};

    req.body.cartDetail.forEach((item) => {
        history.push({
            dateOfPurchase:Date.now(),
            name:item.title,
            id:item._id,
            price:item.price,
            quantity:item.quantity,
            paymentId:req.body.paymentData.paymentId
        })
    })
    // 2. Payment Collection 안에 자세한 결제 정보들 넣어주기

    // 3. Product Collection 안에 있는 sold 필드 정보 업데이트 시켜주기
    
})

module.exports = router;
