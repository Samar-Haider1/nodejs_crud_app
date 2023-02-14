function getAuthorizeToken(req){
    return req?.headers?.authorization?.split(" ")[1]
}

function emailRegex(value){
    return /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(value)
}
module.exports = {getAuthorizeToken,emailRegex}
// module.exports = 


// multiple exports check karna hai ur line number 8 9 pay lagana hai kal lazmi 
