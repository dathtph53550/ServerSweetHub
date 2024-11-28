var express = require('express');
var router = express.Router();

// const Upload = require('../config/common/upload');
const Upload = require('../config/common/upload');
const Products = require('../models/products');
const Categorys = require('../models/categorys');
const Users = require('../models/users');

router.get('/getListCategory', async (req, res) => {
    try {
        const data = await Categorys.find();
        res.json({
            "status": 200,
            "messenger": "Danh sách Category",
            "data": data
        })
    } catch (error) {
        console.log(error);
    }
})

//Thêm model
router.post('/add_Catagory',async (req,res) => {
    try{
        const data = req.body;
        const newDistributor = new Categorys({
            name: data.name
        });
        const result = await newDistributor.save();
        if(result){
            const list = await Categorys.find().populate();
            res.json({
                "status":200,
                "msg":"Thêm thành công !!",
                "data": list
            });
        }
        else{
            res.json({
                "status":400,
                "msg":"Lỗi, thêm không thành công !!",
                "data": []
            })
        }
    }catch(error){
        console.log(error);
    }
});


//API Thêm Fruit
router.post('/add_product', async (req,res) =>{
    try{
        const data = req.body;
        const newFruit = new Products({
            name: data.name,
            price: data.price,
            describe: data.describe,
            status: data.status,
            isFavorite: data.isFavorite,
            Image: data.image,
            quantity: data.quantity,
            id_category: data.id_category
        });
        const result = await newFruit.save();
        if(result){
            res.json({
                "status":200,
                "msg":"Thêm thành công !!",
                "data": result
            });
        }
        else{
            res.json({
                "status":400,
                "msg":"Lỗi, thêm không thành công !!",
                "data": []
            })
        }
    }catch(error){
        console.log(error);
    }
});

router.get('/get_list_product', async(req,res) =>{
    try{
        const data = await Products.find().populate('id_category');
        res.json({
            "status":200,
                "msg":"Thêm thành công !!",
                "data": data
        });
    }catch(error){
        console.log(error);
    }
});


router.get('/get_ProductById/:id', async(req,res) =>{
    try{
        const {id} = req.params;
        const data = await Products.findById(id).populate('id_category');
        res.json({
            "status":200,
            "msg":"Thêm thành công !!",
            "data": data
        });
    }catch(error){
        console.log(error);
    }
});

router.get('/get_list_ProductInPrice', async(req,res) =>{
    try{
        const {price_start,price_end} = req.query;
        const query = {price:{$gte:price_start,$lte: price_end}};
        const data = await Products.find(query,'name price describe id_category')
                                .populate('id_category')
                                .sort({quantity: -1})
                                .skip(0)
                                .limit(2)
        res.json({
            "status":200,
            "msg":"Thêm thành công !!",
            "data": data
        });
    }catch(error){
        console.log(error);
    }
})


router.get('/get_list_ProductHaveNameAorX', async (req,res) => {
    try{
        const query = {$or: [
            {name:{$regex:'T'}},
            {name:{$regex:'X'}},
        ]};
        const data = await Products.find(query,'name price describe id_category')
                                .populate('id_category');
        res.json({
            "status":200,
            "msg":"Thêm thành công !!",
            "data": data
        });
    }catch(error){
        console.log(error);
    }
})


//API cập nhật fruit
router.put('/update-product-by-id/:id', async (req,res) => {
    try{
        const {id} = req.params;
        const data = req.body;
        const updateFruit = await Products.findById(id);
        let result = null;
        if(updateFruit){
            updateFruit.name = data.name ?? updateFruit.name;
            updateFruit.describe = data.describe ?? updateFruit.describe;
            updateFruit.price = data.price ?? updateFruit.price;
            updateFruit.status = data.status ?? updateFruit.status;
            updateFruit.Image = data.Image ?? updateFruit.Image;
            updateFruit.isFavorite = data.isFavorite ?? updateFruit.isFavorite;
            updateFruit.id_category = data.id_category ?? updateFruit.id_category;
            result = await updateFruit.save();
        }

        if(result){
            res.json({
                "status":200,
                "msg":"Thêm thành công !!",
                "data": result
            });
        }
        else{
            res.json({
                "status":400,
                "msg":"Thêm không thành công !!",
                "data": []
            });
        }
    }catch(error){
        console.log(error);
    }
});

router.put('/update_ProductById/:id',Upload.array('image',5), async (req, res) => {
    try {
        const { id } = req.params
        const data = req.body;
        const { files } = req;

        let url1;
        const updatefruit = await Products.findById(id)
        if (files && files.length > 0) {
            url1 = files.map((file) => `${req.protocol}://${req.get("host")}/uploads/${file.filename}`);

        }
        if (url1 == null) {
            url1 = updatefruit.image;
        }

        let result = null;
        if (updatefruit) {
                updatefruit.name = data.name ?? updatefruit.name,
                updatefruit.describe = data.describe ?? updatefruit.describe,
                updatefruit.price = data.price ?? updatefruit.price,
                updatefruit.status = data.status ?? updatefruit.status,
                updatefruit.Image = url1,
                updatefruit.isFavorite = data.isFavorite ?? updatefruit.isFavorite,
                updatefruit.id_category = data.id_category ?? updatefruit.id_category,
                result = (await updatefruit.save()).populate("id_category");;
        }
        if (result) {
            res.json({
                'status': 200,
                'messenger': 'Cập nhật thành công',
                'data': result
            })
        } else {
            res.json({
                'status': 400,
                'messenger': 'Cập nhật không thành công',
                'data': []
            })
        }
    } catch (error) {
        console.log(error);
    }
})


router.put('/updateCategoryById/:id', async (req, res) => {
    try {
        const { id } = req.params
        console.log(id);
        const data = req.body
        const updateDistributor = await Categorys.findById(id)
        let result = null;
        if (updateDistributor) {
            updateDistributor.name = data.name ?? updateDistributor.name

            result = await updateDistributor.save();
        }
        if (result) {

            const list = await Categorys.find().populate();
            res.json({
                'status': 200,
                'messenger': 'Cập nhật thành công',
                'data': list
            })
        } else {
            res.json({
                'status': 400,
                'messenger': 'Cập nhật không thành công',
                'data': []
            })
        }
    } catch (error) {
        console.log(error);
    }
})


router.delete('/destroy_ProductById/:id', async (req,res) => {
    try{
        const {id} = req.params;
        const result = await Products.findByIdAndDelete(id);
        if(result){
            res.json({
                "status": 200,
                "msg":"Thêm thành công !!",
                "data": result
            })
        }else{
            res.json({
                "status":400,
                "msg":"Thêm không thành công !!",
                "data": []
            });
        }
    }catch(error){
        console.log(error);
    }
});

router.delete('/destroyCategoryById/:id', async (req, res) => {
    try {
        const { id } = req.params
        const result = await Categorys.findByIdAndDelete(id);
        if (result) {

            const list = await Categorys.find().populate();
            res.json({
                "status": 200,
                "messenger": "Xóa thành công",
                "data": list
            })
        } else {
            res.json({
                "status": 400,
                "messenger": "Lỗi! xóa không thành công",
                "data": []
            })
        }
    } catch (error) {
        console.log(error);
    }
});



// router.post('/add-fruit-with-file-image', Upload.array('image', 5), async (req, res) => {
//     //Upload.array('image',5) => up nhiều file tối đa là 5
//     //upload.single('image') => up load 1 file
//     try {
//         const data = req.body; // Lấy dữ liệu từ body
//         const { files } = req //files nếu upload nhiều, file nếu upload 1 file
//         const urlsImage =
//             files.map((file) => `${req.protocol}://${req.get("host")}/uploads/${file.filename}`)
//         //url hình ảnh sẽ được lưu dưới dạng: http://localhost:3000/upload/filename
//         const newfruit = new Furits({
//             name: data.name,
//             quantity: data.quantity,
//             price: data.price,
//             status: data.status,
//             image: urlsImage, /* Thêm url hình */
//             description: data.description,
//             id_distributor: data.id_distributor
//         }); //Tạo một đối tượng mới
//         const result = (await newfruit.save()).populate("id_distributor"); //Thêm vào database
//         if (result) {// Nếu thêm thành công result !null trả về dữ liệu
//             res.json({
//                 "status": 200,
//                 "messenger": "Thêm thành công",
//                 "data": result
//             })
//         } else {// Nếu thêm không thành công result null, thông báo không thành công
//             res.json({
//                 "status": 400,
//                 "messenger": "Lỗi, thêm không thành công",
//                 "data": []
//             })
//         }
//     } catch (error) {
//         console.log(error);
//     }
// });



router.post('/ProductWithImage', Upload.array('image',5),async (req,res) => {
    try{
        const data = req.body;
        const {files} = req;
        const urlsImage = files.map((file)=>`${req.protocol}://${req.get("host")}/uploads/${file.filename}`);
        console.log(urlsImage);
        const newFruit = new Products({
            name: data.name,
            price: data.price,
            describe: data.describe,
            status: data.status,
            image: urlsImage,
            isFavorite: data.isFavorite,
            id_category: data.id_category,
            quantity: data.quantity
        });
        console.log(newFruit.quantity);
        const result = (await newFruit.save()).populate('id_category');
        console.log('Product saved:', result);  
        if(result){
            res.json({
                "status": 200,
                "msg":"Thêm thành công !!",
                "data": result
            });
        }else{
            res.json({
                "status":400,
                "msg":"Thêm không thành công !!",
                "data": []
            });
        }
    }catch(error){
        console.log(error);
    }
});





// router.post('/registerSendMail',Upload.single('avater'), async (req,res) => {
//     try{
//         const data = req.body;
//         const {file} = req;
//         const newUser = new Users({
//             username: data.username,
//             password: data.password,
//             email: data.email,
//             name: data.name,
//             avatar: `${req.protocol}://${req.get("host")}/uploads/${file.filename}`
//         });
//         const result = await newUser.save();
//         if(result){
//             const mailOption = {
//                 from: "hoangdat07082005@gmail.com",
//                 to: result.email,
//                 subject: "Dang ky thanh cong",
//                 text: "Cam on ban da dang ky"
//             };
//             await Transporter.sendMail(mailOption);
//             res.json({
//                 "status": 200,
//                 "msg":"Thêm thành công !!",
//                 "data": result
//             });
//         }else{
//             res.json({
//                 "status":400,
//                 "msg":"Thêm không thành công !!",
//                 "data": []
//             });
//         }
//     }catch(error){
//         console.log(error);
//     }
// });

//search
router.get('/search-Category', async (req, res) => {
    try {
        const key = req.query.key

        const data = await Categorys.find({ name: { "$regex": key, "$options": "i" } })
            // .sort({ createdAt: -1 });

        if (data) {
            res.json({
                "status": 200,
                "messenger": "Thành công",
                "data": data
            })
        } else {
            res.json({
                "status": 400,
                "messenger": "Lỗi, không thành công",
                "data": []
            })
        }
    } catch (error) {
        console.log(error);
    }
})





module.exports = router;