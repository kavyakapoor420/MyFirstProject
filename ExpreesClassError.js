class ExpressError extends Error{ //inheritance 
    //properties of Error class will inherited into ExpreesError class 
    constructor(status,message){
        super();
        this.status=status ;
        this.message=message;
    }
}

module.exports=ExpressError ;