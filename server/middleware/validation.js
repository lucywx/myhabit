// 数据验证中间件
const { body, param, query, validationResult } = require('express-validator');
const Joi = require('joi');

// 通用验证结果处理
const handleValidationErrors = (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({
            error: '数据验证失败',
            details: errors.array().map(err => ({
                field: err.path,
                message: err.msg,
                value: err.value
            }))
        });
    }
    next();
};

// 用户注册验证 - 新密码系统
const validateUserRegistration = [
    body('username')
        .trim()
        .isLength({ min: 3, max: 20 })
        .withMessage('用户名长度必须在3-20个字符之间')
        .matches(/^[a-zA-Z0-9_\u4e00-\u9fa5]+$/)
        .withMessage('用户名只能包含字母、数字、下划线和中文'),

    body('hashedPassword')
        .notEmpty()
        .withMessage('加密密码不能为空'),

    body('salt')
        .notEmpty()
        .withMessage('盐值不能为空'),

    body('email')
        .isEmail()
        .withMessage('邮箱格式不正确')
        .normalizeEmail(),

    handleValidationErrors
];

// 用户登录验证 - 接收前端哈希密码
const validateUserLogin = [
    body('username')
        .trim()
        .notEmpty()
        .withMessage('用户名不能为空'),

    body('hashedPassword')
        .notEmpty()
        .withMessage('加密密码不能为空'),

    handleValidationErrors
];

// 银行信息验证
const validateBankInfo = [
    body('accountNumber')
        .trim()
        .isLength({ min: 16, max: 19 })
        .withMessage('账户号码长度必须在16-19位之间')
        .matches(/^\d+$/)
        .withMessage('账户号码只能包含数字'),

    body('expiryDate')
        .matches(/^\d{2}\/\d{2}$/)
        .withMessage('有效期格式不正确，请使用MM/YY格式'),

    body('cvv')
        .isLength({ min: 3, max: 4 })
        .withMessage('CVV长度必须在3-4位之间')
        .matches(/^\d+$/)
        .withMessage('CVV只能包含数字'),

    handleValidationErrors
];

// 目标设置验证
const validateGoalSetting = [
    body('goalContent')
        .trim()
        .isLength({ min: 5, max: 200 })
        .withMessage('目标内容长度必须在5-200个字符之间'),

    handleValidationErrors
];

// 价格设置验证
const validatePriceSetting = [
    body('enabled')
        .isBoolean()
        .withMessage('enabled必须是布尔值'),

    body('amount')
        .isInt({ min: 1, max: 10000 })
        .withMessage('金额必须在1-10000之间'),

    body('type')
        .isIn(['platform', 'friend'])
        .withMessage('类型必须是platform或friend'),

    handleValidationErrors
];

// 邀请验证
const validateInvite = [
    body('friendEmail')
        .isEmail()
        .withMessage('朋友邮箱格式不正确')
        .normalizeEmail(),

    body('inviteLink')
        .notEmpty()
        .withMessage('邀请链接不能为空'),

    handleValidationErrors
];

// 打卡验证
const validateCheckin = [
    body('day')
        .isInt({ min: 1, max: 7 })
        .withMessage('打卡天数必须在1-7之间'),

    handleValidationErrors
];

// 用户ID参数验证
const validateUserId = [
    param('userId')
        .isMongoId()
        .withMessage('用户ID格式不正确'),

    handleValidationErrors
];

// 查询参数验证
const validatePagination = [
    query('page')
        .optional()
        .isInt({ min: 1 })
        .withMessage('页码必须是正整数'),

    query('limit')
        .optional()
        .isInt({ min: 1, max: 100 })
        .withMessage('每页数量必须在1-100之间'),

    handleValidationErrors
];

// Joi验证器
const goalSchema = Joi.object({
    goalContent: Joi.string()
        .min(5)
        .max(200)
        .required()
        .messages({
            'string.min': '目标内容至少5个字符',
            'string.max': '目标内容最多200个字符',
            'any.required': '目标内容不能为空'
        }),

    startDate: Joi.date()
        .iso()
        .required()
        .messages({
            'date.base': '开始日期格式不正确',
            'any.required': '开始日期不能为空'
        })
});

const bankInfoSchema = Joi.object({
    bankName: Joi.string()
        .min(2)
        .max(50)
        .pattern(/^[\u4e00-\u9fa5a-zA-Z\s]+$/)
        .required()
        .messages({
            'string.min': '银行名称至少2个字符',
            'string.max': '银行名称最多50个字符',
            'string.pattern.base': '银行名称只能包含中文、英文和空格',
            'any.required': '银行名称不能为空'
        }),

    accountName: Joi.string()
        .min(2)
        .max(20)
        .pattern(/^[\u4e00-\u9fa5a-zA-Z\s]+$/)
        .required()
        .messages({
            'string.min': '账户姓名至少2个字符',
            'string.max': '账户姓名最多20个字符',
            'string.pattern.base': '账户姓名只能包含中文、英文和空格',
            'any.required': '账户姓名不能为空'
        }),

    accountNumber: Joi.string()
        .min(16)
        .max(19)
        .pattern(/^\d+$/)
        .required()
        .messages({
            'string.min': '账户号码至少16位',
            'string.max': '账户号码最多19位',
            'string.pattern.base': '账户号码只能包含数字',
            'any.required': '账户号码不能为空'
        })
});

// Joi验证中间件
const validateWithJoi = (schema) => {
    return (req, res, next) => {
        const { error, value } = schema.validate(req.body, { abortEarly: false });

        if (error) {
            const details = error.details.map(detail => ({
                field: detail.path.join('.'),
                message: detail.message,
                value: detail.context?.value
            }));

            return res.status(400).json({
                error: '数据验证失败',
                details
            });
        }

        // 验证通过，更新请求体
        req.body = value;
        next();
    };
};

module.exports = {
    validateUserRegistration,
    validateUserLogin,
    validateBankInfo,
    validateGoalSetting,
    validatePriceSetting,
    validateInvite,
    validateCheckin,
    validateUserId,
    validatePagination,
    goalSchema,
    bankInfoSchema,
    validateWithJoi,
    handleValidationErrors
}; 