const { body} = require('express-validator')

function checkDecimal(value) {
    if (value === undefined || value === null) return true

    const stringValue = String(value); 
    const parts = stringValue.split('.');
    const integerPart = parts[0];
    const decimalPart = parts[1] || '';

    if (integerPart.length + decimalPart.length > 10) {
        throw new Error('Field exceeds total digit limit (10)');
    }

    if (decimalPart.length > 2) {
        throw new Error('Field exceeds decimal place limit (2)');
    }
    return true;
}

exports.createUserValidator = [
    body('username')
        .notEmpty().withMessage('Username is required!')
        .isString().withMessage('Username must be of string data type!')
        .trim().escape()
        .matches(/^[a-zA-Z0-9_.\- ]+$/) 
        .withMessage('Username can only contain alphanumeric characters, underscores, dots, spaces, and hyphens!')
        .isLength({min: 3, max: 32})
        .withMessage(('Username length must be between 3 to 32 characters long!')),

    body('email')
        .notEmpty().withMessage('Email is required!')
        .trim().escape()
        .isEmail().withMessage('Invalid email address!')
        .normalizeEmail(),

    body('password')
        .notEmpty().withMessage('Password is required!')
        .isString().withMessage('Password must be of string data type!')
        .isLength({min: 8, max: 255})
        .withMessage(('Password length must be between 8 to 255 characters long!'))
];

exports.updateUserValidator = [
    body('new_username')
        .optional()
        .notEmpty().withMessage('Username is required!')
        .isString().withMessage('Username must be of string data type!')
        .trim().escape()
        .matches(/^[a-zA-Z0-9_.\- ]+$/) 
        .withMessage('Username can only contain alphanumeric characters, underscores, dots, spaces, and hyphens!')
        .isLength({min: 3, max: 32})
        .withMessage(('Username length must be between 3 to 32 characters long!')),

    body('new_email')
        .optional()
        .notEmpty().withMessage('Email is required!')
        .trim().escape()
        .isEmail().withMessage('Invalid email address!')
        .normalizeEmail(),

    body('password')
        .notEmpty().withMessage('Password is required!')
        .isString().withMessage('Password must be of string data type!')
        .isLength({min: 8, max: 255})
        .withMessage(('Password length must be between 8 to 255 characters long!'))
]

exports.emailValidator = [
     body('email')
        .notEmpty().withMessage('Email is required!')
        .trim().escape()
        .isEmail().withMessage('Invalid email address!')
        .normalizeEmail(),
]

exports.foodValidator = [
    body('item_name')
        .notEmpty().withMessage('Food name is required!')
        .isString().withMessage('Food name must be of string data type!'),

    body('dine_in_price')
        .isDecimal().withMessage('Dine in price must be a valid decimal number')
        .custom(checkDecimal).withMessage('Online price must be numeric(10,2)'),

    body('category')
        .optional()
        .isIn(['main-dish', 'beverages', 'vegetables', 'add-ons'])
        .withMessage('Category must be main-dish, beverages, vegetables, or add-ons!'),

    body('online_price')
        .isDecimal().withMessage('Online price must be a valid decimal number')
        .custom(checkDecimal).withMessage('Online price must be numeric(10,2)'),

    body('description')
        .optional()
        .isString()
        .trim().escape()
        .withMessage('Description must be of string data type!'),

    body('image_base64_url')
        .notEmpty().withMessage('Image is required!')
        .trim()
        .custom((value) => {
            // data:image/png;base64,...
            let fileType = value.split(':')
            fileType = fileType[1].split('/')[0]
            console.log('The file', fileType)

            if (fileType !== 'image'){
                throw new Error('File must be a image!')
            }

            const acceptedFormat = ['jpg', 'jpeg', 'webp', 'png']
            const matched = value.match(/^data:image\/(\w+);base64,/);
            // console.log('matched array', matched)

            if (!matched){
                throw new Error('Image must be a valid base 64 data URL!')
            }

            const imageFormat = matched[1]
            
            if (!acceptedFormat.includes(imageFormat)) 
                throw new Error('Image format must be jpg, jpeg, webp, or png!')

            const validBase64 = /^(?:[A-Za-z0-9+/]{4})*(?:[A-Za-z0-9+/]{2}==|[A-Za-z0-9+/]{3}=)?$/;
            const base64Data = value.split(',')[1]

            if (!validBase64.test(base64Data)){
                throw new Error('Image data must be a valid base 64 string!')
            }
            console.log(base64Data.substring(0, 16))

            return true;
        })
];

exports.updateFoodValidator = [
    body('item_name')
        .optional()
        .trim().escape()
        .isString().withMessage('Food name must be of string data type!'),

    body('dine_in_price')
        .optional()
        .isDecimal().withMessage('Dine in price must be a valid decimal number')
        .custom(checkDecimal).withMessage('Online price must be numeric(10,2)'),

    body('category')
        .optional()
        .isIn(['main-dish', 'beverages', 'vegetables', 'add-on'])
        .withMessage('Category must be main-dish, beverages, vegetables, or add-ons!'),

    body('online_price')
        .optional()
        .isDecimal().withMessage('Online price must be a valid decimal number')
        .custom(checkDecimal).withMessage('Online price must be numeric(10,2)'),

    body('description')
        .optional()
        .isString()
        .trim().escape()
        .withMessage('Description must be of string data type!'),

    body('image_base64_url')
        .optional()
        .trim()
        .custom((value) => {
            // data:image/png;base64,...
            let fileType = value.split(':')
            fileType = fileType[1].split('/')[0]
            console.log('The file', fileType)

            if (fileType !== 'image'){
                throw new Error('File must be a image!')
            }

            const acceptedFormat = ['jpg', 'jpeg', 'webp', 'png']
            const matched = value.match(/^data:image\/(\w+);base64,/);
            // console.log('matched array', matched)

            if (!matched){
                throw new Error('Image must be a valid base 64 data URL!')
            }

            const imageFormat = matched[1]
            
            if (!acceptedFormat.includes(imageFormat)) 
                throw new Error('Image format must be jpg, jpeg, webp, or png!')

            const validBase64 = /^(?:[A-Za-z0-9+/]{4})*(?:[A-Za-z0-9+/]{2}==|[A-Za-z0-9+/]{3}=)?$/;
            const base64Data = value.split(',')[1]

            if (!validBase64.test(base64Data)){
                throw new Error('Image data must be a valid base 64 string!')
            }
            console.log(base64Data.substring(0, 16))

            return true;
        })
];

exports.addAddressValidator = [
    body('alamat_lengkap')
        .trim().escape()
        .isString().withMessage('alamat_lengkap must be of string data type!'),
    body('kelurahan')
        .trim().escape()
        .isString().withMessage('kelurahan must be of string data type!'),
    body('kabupaten_kota')
        .trim().escape()
        .isString().withMessage('kabupaten_kota must be of string data type!'),
    body('provinsi')
        .trim().escape()
        .isString().withMessage('provinsi must be of string data type!')
]

exports.updateAddressValidator = [
    body('alamat_lengkap')
        .optional()
        .trim().escape()
        .isString().withMessage('alamat_lengkap must be of string data type!'),
    body('kelurahan')
        .optional()
        .trim().escape()
        .isString().withMessage('kelurahan must be of string data type!'),
    body('kabupaten_kota')
        .optional()
        .trim().escape()
        .isString().withMessage('kabupaten_kota must be of string data type!'),
    body('provinsi')
        .optional()
        .trim().escape()
        .isString().withMessage('provinsi must be of string data type!')
]

exports.reviewValidator = [
    body('stars')
        .isInt({min: 1, max: 5}).withMessage('Rating must be between 1 - 5 stars!'),
    body('comment')
        .trim().escape()
        .isString().withMessage('Comment must be of string data type!')
]

exports.restaurantReviewsEnumValidator = [
    body('overviews')
        .optional()
        .isArray().withMessage('Overviews must be an array field!'),
    body('overviews.*')
        .optional()
        .isIn(['rasa-enak', 'porsi-pas', 'bersih', 'lainnya'])
        .withMessage('Review overview must be rasa-enak, porsi-pas, bersih, or "lainnya"!'),
]