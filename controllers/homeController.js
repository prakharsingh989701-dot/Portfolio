import userModel from '../model/userModel.js';

const homeController = async (req, res) => {
    try {
        console.log(req.body);
        res.render('index');
}catch (error) {
        console.log(error);
    }
}

//user contact controller
const ContactUserController = async (req, res) => {
    try {
        const data = await userModel.create({
            name: req.body.name,
            email: req.body.email,
            subject: req.body.subject,
            message: req.body.message
        })
        if(data){
            await data.save();
            console.log("Data Saved Successfully");
        }
        console.log(req.body);
        res.render('index');
    } catch (error) {
        console.log(error);
    }
}

export { homeController, ContactUserController };