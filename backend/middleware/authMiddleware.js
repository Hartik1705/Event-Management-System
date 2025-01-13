import jwt from 'jsonwebtoken';


const userAuth = async (req, res, next) => {

    try {
        const auth = req.headers['authorization'];



        const authToken = auth.split(' ')[1];
        if (!authToken) {
            return res.json({ message: "Invalid Token" });
        }
        const authID = jwt.verify(authToken, "HARTIK_LUHAR");

        console.log("authID", authID.id);
        

        if(authID){
            req._id = authID.id;
            next();
        }
        else{
            return res.json({success : false, message: "Token expired, Login again"})
        }


       
    }

    catch (err) {
        return res.json({ success: false, message: err.message });
    }
}

export default userAuth;