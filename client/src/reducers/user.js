const istate={
    token:null,
    isAuthenticated:false,
    user:{}
}

const userReducer=(state=istate,action)=>{
    switch(action.type){
        case "Login":
            return action.payload 
         default:
             return state;   
    }
}

export default userReducer;