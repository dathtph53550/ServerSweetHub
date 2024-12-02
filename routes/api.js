var express = require('express');
var router = express.Router();

// const Upload = require('../config/common/upload');
const Upload = require('../config/common/upload');
const Products = require('../models/products');
const Categorys = require('../models/categorys');
const Users = require('../models/users');
const Orders = require('../models/orders');

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
            quantity: data.quantity,
            id_category: data.id_category
            
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
});

//search
router.get('/search-Product', async (req, res) => {
    try {
        const key = req.query.key

        const data = await Products.find({ name: { "$regex": key, "$options": "i" } })
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
});

//Favourite
router.put('/toggle-favourite/:id', async (req, res) => {
    try {
        const { id } = req.params;

        // Tìm sản phẩm theo ID
        const product = await Products.findById(id);


        // Đổi giá trị isFavourite
        product.isFavorite = !product.isFavorite;

        // Lưu lại sản phẩm đã chỉnh sửa
        const result = await product.save();

        if (result) {
            res.json({
                "status": 200,
                "messenger": "Thành công",
                "data": await Products.find()
            });
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
});

router.get('/getListProductByFavourite', async (req, res) => {
    // const { isFavorite } = req.query; // Lấy isFavorite từ query parameter

    try {
        const products = await Products.find({ isFavorite: true }).populate('id_category');
        res.status(200).json({ status: 200, msg: 'Lấy sản phẩm thành công', data: products });
    } catch (err) {
        res.status(500).json({ status: 500, msg: 'Lỗi server', error: err.message });
    }
});


router.get('/getListProductByCategory', async (req, res) => {
    try {
        // Lấy id_category từ query string
        const { id_category } = req.query; 

        if (!id_category) {
            return res.status(400).json({
                status: 400,
                message: 'id_category không được phép trống.',
                data: []
            });
        }

        // Tìm sản phẩm theo id_category và trả về thông tin chi tiết của từng sản phẩm
        const products = await Products.find({ id_category: id_category }).populate('id_category', 'name');

        if (products.length > 0) {
            res.status(200).json({
                status: 200,
                message: 'Lấy sản phẩm theo danh mục thành công',
                data: products
            });
        } else {
            res.status(404).json({
                status: 404,
                message: 'Không tìm thấy sản phẩm trong danh mục này.',
                data: []
            });
        }
    } catch (error) {
        console.log(error);
        res.status(500).json({
            status: 500,
            message: 'Lỗi server',
            error: error.message
        });
    }
});



router.post('/add-order', async (req, res) => {
    try {
        const data = req.body;
        const newOrder = new Orders({
            order_code: data.order_code,
            id_user: data.id_user
        })
        const result = await newOrder.save(); // Thêm vào database
        if (result) {
            res.json({
                "status": 200,
                "messenger": "Thêm thành công",
                "data": result
            })
        } else {
            // Nếu thêm không thành công result null, thông báo không thành công
            res.json({
                "status": 400,
                "messenger": "Lỗi, thêm không thành công",
                "data": null
            })
        }
    } catch (error) {
        console.log(error);
    }

    
});



router.get('/get-list-order', async (req, res) => {
    try {
        const { id_user } = req.query;

        const result = await Orders.find({ id_user: id_user }); 
        if (result) {
            // Nếu thành công, trả về dữ liệu đơn hàng
            res.json({
                "status": 200,
                "messenger": "Thêm thành công",
                "data": result
            })
        } else {
            // Nếu thất bại, thông báo lỗi
            res.json({
                "status": 400,
                "messenger": "Lỗi, thêm không thành công",
                "data": null
            })
        }
    } catch (error) {
        console.log(error);
    }
});

// const Transporter = require('../config/common/mail')
// router.post('/register-send-email', Upload.single('avartar'), async (req, res) => {
//     try {
//       const data = req.body;
//       const { file } = req;    
//     //   const avatarUrl = `${req.protocol}://${req.get("host")}/uploads/${file.filename}`;
  
//     //   const newUser = new Users({
//     //     email,
//     //     password,
//     //     avartar: avatarUrl // Lưu đường dẫn đến ảnh
//     //   });

//     const newUser = Users({
//         email: data.email,
//         password: data.password,
//         avartar: `${req.protocol}://${req.get("host")}/uploads/${file.filename}`
//     });

//       const result = await newUser.save();
//       if (result) {
//         res.json({
//           status: 200,
//           message: "Registration successful",
//           data: result
//         });
//       } else {
//         res.status(400).json({
//           status: 400,
//           message: "Failed to register user"
//         });
//       }
//     } catch (error) {
//       console.error(error);
//       res.status(500).json({ message: "Internal Server Error" });
//     }
// });


  router.post('/register-send-email', Upload.single('avartar'), async (req, res) => {
    try {
        const data = req.body;
        const { file } = req
        console.log(data);
        const newUser = Users({
            username: data.username,
            password: data.password,
            email: data.email,
            name: data.name,
            avartar: `${req.protocol}://${req.get("host")}/uploads/${file.filename}`,
        })
        const result = await newUser.save();
        if (result) {
            res.json({
            status: 200,
            message: "Registration successful",
            data: result
            });
        } else {
            res.status(400).json({
            status: 400,
            message: "Failed to register user"
            });
        }
        } catch (error) {
        console.error(error);
        }
});


const JWT = require('jsonwebtoken');
const SECRETKEY = "FPTPOLYTECHNIC"
router.post('/login', async (req, res) => {
    try {
        const { username, password } = req.body;
        const user = await Users.findOne({ username, password });
        console.log(username + '-' + password);
        if (user) {
            const token = JWT.sign({ id: user._id }, SECRETKEY, { expiresIn: '1h' });
            const refreshToken = JWT.sign({ id: user._id }, SECRETKEY, { expiresIn: '1d' })
            //expiresIn thời gian token
            res.json({
                "status": 200,
                "messenger": "Đăng nhâp thành công",
                "data": user,
                "token": token,
                "refreshToken": refreshToken
            })
        } else {
            res.json({
                "status": 404,
                "messenger": "Lỗi, đăng nhập không thành công",
                "data": []
            })
        }
    } catch (error) {
        console.log(error);
    }
})

// router.post('/login', async (req, res) => {
//     try {
//         const { email, password } = req.body;  // Lấy dữ liệu từ request body

//         // Kiểm tra xem email có tồn tại trong DB không
//         const user = await User.findOne({ email });
//         if (!user) {
//             return res.status(400).json({ message: 'Email không tồn tại' });
//         }

//         // So sánh mật khẩu từ client với mật khẩu đã mã hóa trong DB
//         const isMatch = await bcrypt.compare(password, user.password);
//         if (!isMatch) {
//             return res.status(400).json({ message: 'Mật khẩu không đúng' });
//         }

//         // Nếu đăng nhập thành công, tạo JWT token
//         const token = jwt.sign(
//             { userId: user._id, email: user.email },
//             'secretKey', // Mã bí mật cho JWT (cần thay đổi thành giá trị bảo mật hơn)
//             { expiresIn: '1h' }  // Token hết hạn sau 1 giờ
//         );

//         // Trả về token và thông tin người dùng
//         res.json({
//             status: 200,
//             message: 'Đăng nhập thành công',
//             token,  // Trả về token JWT cho client
//             user: {
//                 email: user.email,
//                 avatar: user.avatar,  // Nếu có trường avatar trong DB
//             }
//         });
//     } catch (error) {
//         console.error(error);
//         res.status(500).json({ message: 'Lỗi server' });
//     }
// });


module.exports = router;