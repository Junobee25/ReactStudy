import {
    LOGIN_USER,
    REGISTER_USER,
    AUTH_USER,
    LOGOUT_USER,
    ADD_TO_CART,
    GET_CART_ITEMS,
    REMOVE_CART_ITEM
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
            return {...state,   // 모든 스테이트, 유저 정보 ,기존의 모든 정보,action cart 정보
                    userData:{
                        ...state.userData,
                        cart:action.payload
                    } }
        case GET_CART_ITEMS:
            return {...state,cartDetail:action.payload}
        case REMOVE_CART_ITEM:
            return {...state,cartDetail:action.payload.productInfo,
                        userData:{
                            ...state.userData,
                            cart:action.payload.cart
                        }}
        default:
            return state;
    }
}