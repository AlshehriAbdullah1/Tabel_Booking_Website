



function isSigned(cookie,role){
        console.log(`clicked ! ${role}   ${cookie.Type}`)
        console.log(`cookie.Signed=="true" ???? ${cookie.Signed=="true"}   cookie.Type==role ??? ${cookie.Type==role}`)
    if(cookie.Signed=="true" && cookie.Type==role){
            return true;
    }
    return false;
}


module.exports={isSigned}