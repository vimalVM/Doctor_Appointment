function Validation(values){
    alert("")
    let error={}
    const email_pattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    const password_pattern = /^.{8,}$/



    if(values.email === ""){
        error.email = "Email should not be empty"
    }
    else if(!email_pattern.test(values.email)){
        error.email = "Wrong email format"
    }
    else{
        error.email =""
    }

    if(values.password === ""){
        error.password = "Password should not be empty"
    }
    else if(!password_pattern.test(values.password)){
        error.password = "Minimum length 8"
    }
    else{
        error.password =""
    }
    return error;
}
export default Validation;