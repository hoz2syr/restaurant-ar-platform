/******/ (() => { // webpackBootstrap
/******/ 	"use strict";
/******/ 	var __webpack_modules__ = ([
/* 0 */
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
const core_1 = __webpack_require__(1);
const common_1 = __webpack_require__(2);
const helmet_1 = __importDefault(__webpack_require__(3));
const app_module_1 = __webpack_require__(4);
const logging_interceptor_1 = __webpack_require__(35);
async function bootstrap() {
    const logger = new common_1.Logger('Bootstrap');
    const isProduction = process.env.NODE_ENV === 'production';
    const app = await core_1.NestFactory.create(app_module_1.AppModule, {
        logger: isProduction ? ['error', 'warn', 'log'] : ['error', 'warn', 'log', 'debug', 'verbose'],
    });
    if (isProduction) {
        app.set('trust proxy', 1);
    }
    app.disable('x-powered-by');
    app.use((0, helmet_1.default)({
        contentSecurityPolicy: false,
        crossOriginResourcePolicy: { policy: 'cross-origin' },
    }));
    const corsOrigins = process.env.CORS_ORIGIN?.split(',').map(o => o.trim()) || '*';
    app.enableCors({
        origin: corsOrigins,
        credentials: true,
        methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
        allowedHeaders: ['Content-Type', 'Authorization', 'Accept'],
    });
    app.useGlobalPipes(new common_1.ValidationPipe({
        whitelist: true,
        transform: true,
        transformOptions: { enableImplicitConversion: true },
        forbidNonWhitelisted: isProduction,
        forbidUnknownValues: true,
        disableErrorMessages: isProduction,
    }));
    app.useGlobalInterceptors(new logging_interceptor_1.LoggingInterceptor());
    app.setGlobalPrefix('api');
    app.enableShutdownHooks();
    const port = process.env.API_PORT || 3001;
    await app.listen(port);
    logger.log(`🚀 API Server running on: http://localhost:${port}/api`);
    logger.log(`📦 Environment: ${process.env.NODE_ENV || 'development'}`);
}
bootstrap();


/***/ }),
/* 1 */
/***/ ((module) => {

module.exports = require("@nestjs/core");

/***/ }),
/* 2 */
/***/ ((module) => {

module.exports = require("@nestjs/common");

/***/ }),
/* 3 */
/***/ ((module) => {

module.exports = require("helmet");

/***/ }),
/* 4 */
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.AppModule = void 0;
const common_1 = __webpack_require__(2);
const core_1 = __webpack_require__(1);
const throttler_1 = __webpack_require__(5);
const app_controller_1 = __webpack_require__(6);
const app_service_1 = __webpack_require__(7);
const auth_module_1 = __webpack_require__(8);
const admin_module_1 = __webpack_require__(21);
const public_module_1 = __webpack_require__(26);
const orders_module_1 = __webpack_require__(29);
const filters_1 = __webpack_require__(32);
let AppModule = class AppModule {
};
exports.AppModule = AppModule;
exports.AppModule = AppModule = __decorate([
    (0, common_1.Module)({
        imports: [
            throttler_1.ThrottlerModule.forRoot([
                {
                    ttl: Number.parseInt(process.env.THROTTLE_TTL ?? '60', 10),
                    limit: Number.parseInt(process.env.THROTTLE_LIMIT ?? '120', 10),
                },
            ]),
            auth_module_1.AuthModule,
            admin_module_1.AdminModule,
            public_module_1.PublicModule,
            orders_module_1.OrdersModule,
        ],
        controllers: [app_controller_1.AppController],
        providers: [
            app_service_1.AppService,
            {
                provide: core_1.APP_FILTER,
                useClass: filters_1.GlobalExceptionFilter,
            },
            {
                provide: core_1.APP_GUARD,
                useClass: throttler_1.ThrottlerGuard,
            },
        ],
    })
], AppModule);


/***/ }),
/* 5 */
/***/ ((module) => {

module.exports = require("@nestjs/throttler");

/***/ }),
/* 6 */
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var _a;
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.AppController = void 0;
const common_1 = __webpack_require__(2);
const app_service_1 = __webpack_require__(7);
let AppController = class AppController {
    constructor(appService) {
        this.appService = appService;
    }
    getHealth() {
        return this.appService.getHealth();
    }
};
exports.AppController = AppController;
__decorate([
    (0, common_1.Get)('health'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Object)
], AppController.prototype, "getHealth", null);
exports.AppController = AppController = __decorate([
    (0, common_1.Controller)(),
    __metadata("design:paramtypes", [typeof (_a = typeof app_service_1.AppService !== "undefined" && app_service_1.AppService) === "function" ? _a : Object])
], AppController);


/***/ }),
/* 7 */
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.AppService = void 0;
const common_1 = __webpack_require__(2);
let AppService = class AppService {
    getHealth() {
        return {
            status: 'ok',
            timestamp: new Date().toISOString(),
            service: 'Restaurant AR Platform API',
        };
    }
};
exports.AppService = AppService;
exports.AppService = AppService = __decorate([
    (0, common_1.Injectable)()
], AppService);


/***/ }),
/* 8 */
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.AuthModule = void 0;
const common_1 = __webpack_require__(2);
const jwt_1 = __webpack_require__(9);
const passport_1 = __webpack_require__(10);
const auth_service_1 = __webpack_require__(11);
const auth_controller_1 = __webpack_require__(15);
const jwt_strategy_1 = __webpack_require__(19);
const prisma_service_1 = __webpack_require__(12);
const jwtSecret = process.env.JWT_SECRET || 'super-secret-key';
const jwtExpiresIn = process.env.JWT_EXPIRES_IN || '1h';
let AuthModule = class AuthModule {
};
exports.AuthModule = AuthModule;
exports.AuthModule = AuthModule = __decorate([
    (0, common_1.Module)({
        imports: [
            passport_1.PassportModule.register({ defaultStrategy: 'jwt' }),
            jwt_1.JwtModule.register({
                secret: jwtSecret,
                signOptions: { expiresIn: jwtExpiresIn },
            }),
        ],
        controllers: [auth_controller_1.AuthController],
        providers: [auth_service_1.AuthService, jwt_strategy_1.JwtStrategy, prisma_service_1.PrismaService],
        exports: [passport_1.PassportModule, jwt_1.JwtModule, prisma_service_1.PrismaService],
    })
], AuthModule);


/***/ }),
/* 9 */
/***/ ((module) => {

module.exports = require("@nestjs/jwt");

/***/ }),
/* 10 */
/***/ ((module) => {

module.exports = require("@nestjs/passport");

/***/ }),
/* 11 */
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var _a, _b;
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.AuthService = void 0;
const common_1 = __webpack_require__(2);
const jwt_1 = __webpack_require__(9);
const prisma_service_1 = __webpack_require__(12);
const bcrypt = __importStar(__webpack_require__(14));
let AuthService = class AuthService {
    constructor(jwtService, prisma) {
        this.jwtService = jwtService;
        this.prisma = prisma;
    }
    async login(email, password) {
        const user = await this.prisma.user.findUnique({ where: { email } });
        if (!user || !user.isActive) {
            throw new common_1.UnauthorizedException('Invalid credentials');
        }
        const passwordMatches = await bcrypt.compare(password, user.password);
        if (!passwordMatches) {
            throw new common_1.UnauthorizedException('Invalid credentials');
        }
        const payload = {
            sub: user.id,
            email: user.email,
            role: user.role,
        };
        const accessToken = this.jwtService.sign(payload);
        const safeUser = {
            id: user.id,
            email: user.email,
            name: user.name,
            role: user.role,
        };
        return {
            accessToken,
            user: safeUser,
        };
    }
};
exports.AuthService = AuthService;
exports.AuthService = AuthService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [typeof (_a = typeof jwt_1.JwtService !== "undefined" && jwt_1.JwtService) === "function" ? _a : Object, typeof (_b = typeof prisma_service_1.PrismaService !== "undefined" && prisma_service_1.PrismaService) === "function" ? _b : Object])
], AuthService);


/***/ }),
/* 12 */
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.PrismaService = void 0;
const common_1 = __webpack_require__(2);
const database_1 = __webpack_require__(13);
let PrismaService = class PrismaService extends database_1.PrismaClient {
    async onModuleInit() {
        await this.$connect();
    }
    async onModuleDestroy() {
        await this.$disconnect();
    }
};
exports.PrismaService = PrismaService;
exports.PrismaService = PrismaService = __decorate([
    (0, common_1.Injectable)()
], PrismaService);


/***/ }),
/* 13 */
/***/ ((module) => {

module.exports = require("@restaurant/database");

/***/ }),
/* 14 */
/***/ ((module) => {

module.exports = require("bcryptjs");

/***/ }),
/* 15 */
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
var _a, _b;
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.AuthController = void 0;
const common_1 = __webpack_require__(2);
const auth_service_1 = __webpack_require__(11);
const login_dto_1 = __webpack_require__(16);
const jwt_auth_guard_1 = __webpack_require__(18);
let AuthController = class AuthController {
    constructor(authService) {
        this.authService = authService;
    }
    async login(dto) {
        return this.authService.login(dto.email, dto.password);
    }
    async profile(req) {
        return { user: req.user };
    }
};
exports.AuthController = AuthController;
__decorate([
    (0, common_1.Post)('login'),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [typeof (_b = typeof login_dto_1.LoginDto !== "undefined" && login_dto_1.LoginDto) === "function" ? _b : Object]),
    __metadata("design:returntype", Promise)
], AuthController.prototype, "login", null);
__decorate([
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, common_1.Get)('profile'),
    __param(0, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], AuthController.prototype, "profile", null);
exports.AuthController = AuthController = __decorate([
    (0, common_1.Controller)('auth'),
    __metadata("design:paramtypes", [typeof (_a = typeof auth_service_1.AuthService !== "undefined" && auth_service_1.AuthService) === "function" ? _a : Object])
], AuthController);


/***/ }),
/* 16 */
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.LoginDto = void 0;
const class_validator_1 = __webpack_require__(17);
class LoginDto {
}
exports.LoginDto = LoginDto;
__decorate([
    (0, class_validator_1.IsEmail)(),
    __metadata("design:type", String)
], LoginDto.prototype, "email", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.MinLength)(6),
    __metadata("design:type", String)
], LoginDto.prototype, "password", void 0);


/***/ }),
/* 17 */
/***/ ((module) => {

module.exports = require("class-validator");

/***/ }),
/* 18 */
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.JwtAuthGuard = void 0;
const common_1 = __webpack_require__(2);
const passport_1 = __webpack_require__(10);
let JwtAuthGuard = class JwtAuthGuard extends (0, passport_1.AuthGuard)('jwt') {
};
exports.JwtAuthGuard = JwtAuthGuard;
exports.JwtAuthGuard = JwtAuthGuard = __decorate([
    (0, common_1.Injectable)()
], JwtAuthGuard);


/***/ }),
/* 19 */
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.JwtStrategy = void 0;
const common_1 = __webpack_require__(2);
const passport_1 = __webpack_require__(10);
const passport_jwt_1 = __webpack_require__(20);
let JwtStrategy = class JwtStrategy extends (0, passport_1.PassportStrategy)(passport_jwt_1.Strategy) {
    constructor() {
        super({
            jwtFromRequest: passport_jwt_1.ExtractJwt.fromAuthHeaderAsBearerToken(),
            ignoreExpiration: false,
            secretOrKey: process.env.JWT_SECRET || 'super-secret-key',
        });
    }
    async validate(payload) {
        return {
            userId: payload.sub,
            email: payload.email,
            role: payload.role,
        };
    }
};
exports.JwtStrategy = JwtStrategy;
exports.JwtStrategy = JwtStrategy = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [])
], JwtStrategy);


/***/ }),
/* 20 */
/***/ ((module) => {

module.exports = require("passport-jwt");

/***/ }),
/* 21 */
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.AdminModule = void 0;
const common_1 = __webpack_require__(2);
const admin_controller_1 = __webpack_require__(22);
const admin_service_1 = __webpack_require__(23);
const prisma_service_1 = __webpack_require__(12);
const auth_module_1 = __webpack_require__(8);
let AdminModule = class AdminModule {
};
exports.AdminModule = AdminModule;
exports.AdminModule = AdminModule = __decorate([
    (0, common_1.Module)({
        imports: [auth_module_1.AuthModule],
        controllers: [admin_controller_1.AdminController],
        providers: [admin_service_1.AdminService, prisma_service_1.PrismaService],
    })
], AdminModule);


/***/ }),
/* 22 */
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
var _a, _b, _c, _d;
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.AdminController = void 0;
const common_1 = __webpack_require__(2);
const admin_service_1 = __webpack_require__(23);
const jwt_auth_guard_1 = __webpack_require__(18);
const menu_item_dto_1 = __webpack_require__(24);
const update_order_status_dto_1 = __webpack_require__(25);
let AdminController = class AdminController {
    constructor(adminService) {
        this.adminService = adminService;
    }
    async getStats() {
        return this.adminService.getStats();
    }
    async getOrders(page, limit) {
        return this.adminService.getOrders(page ? parseInt(page, 10) : 1, limit ? parseInt(limit, 10) : 10);
    }
    async getOrder(id) {
        return this.adminService.getOrderById(id);
    }
    async getMenuItems(page, limit) {
        return this.adminService.getMenuItems(page ? parseInt(page, 10) : 1, limit ? parseInt(limit, 10) : 10);
    }
    async updateOrderStatus(id, dto) {
        return this.adminService.updateOrderStatus(id, dto.status);
    }
    async getUsers(page, limit) {
        return this.adminService.getUsers(page ? parseInt(page, 10) : 1, limit ? parseInt(limit, 10) : 10);
    }
    async getCategories() {
        return this.adminService.getCategories();
    }
    async getMenuItem(id) {
        const item = await this.adminService.getMenuItemById(id);
        if (!item)
            throw new common_1.NotFoundException('Menu item not found');
        return item;
    }
    async createMenuItem(dto) {
        return this.adminService.createMenuItem(dto);
    }
    async updateMenuItem(id, dto) {
        const existing = await this.adminService.getMenuItemById(id);
        if (!existing)
            throw new common_1.NotFoundException('Menu item not found');
        return this.adminService.updateMenuItem(id, dto);
    }
    async deleteMenuItem(id) {
        const existing = await this.adminService.getMenuItemById(id);
        if (!existing)
            throw new common_1.NotFoundException('Menu item not found');
        await this.adminService.deleteMenuItem(id);
        return { success: true };
    }
};
exports.AdminController = AdminController;
__decorate([
    (0, common_1.Get)('stats'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], AdminController.prototype, "getStats", null);
__decorate([
    (0, common_1.Get)('orders'),
    __param(0, (0, common_1.Query)('page')),
    __param(1, (0, common_1.Query)('limit')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String]),
    __metadata("design:returntype", Promise)
], AdminController.prototype, "getOrders", null);
__decorate([
    (0, common_1.Get)('orders/:id'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], AdminController.prototype, "getOrder", null);
__decorate([
    (0, common_1.Get)('menu'),
    __param(0, (0, common_1.Query)('page')),
    __param(1, (0, common_1.Query)('limit')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String]),
    __metadata("design:returntype", Promise)
], AdminController.prototype, "getMenuItems", null);
__decorate([
    (0, common_1.Patch)('orders/:id/status'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, typeof (_b = typeof update_order_status_dto_1.UpdateOrderStatusDto !== "undefined" && update_order_status_dto_1.UpdateOrderStatusDto) === "function" ? _b : Object]),
    __metadata("design:returntype", Promise)
], AdminController.prototype, "updateOrderStatus", null);
__decorate([
    (0, common_1.Get)('users'),
    __param(0, (0, common_1.Query)('page')),
    __param(1, (0, common_1.Query)('limit')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String]),
    __metadata("design:returntype", Promise)
], AdminController.prototype, "getUsers", null);
__decorate([
    (0, common_1.Get)('categories'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], AdminController.prototype, "getCategories", null);
__decorate([
    (0, common_1.Get)('menu/:id'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], AdminController.prototype, "getMenuItem", null);
__decorate([
    (0, common_1.Post)('menu'),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [typeof (_c = typeof menu_item_dto_1.CreateMenuItemDto !== "undefined" && menu_item_dto_1.CreateMenuItemDto) === "function" ? _c : Object]),
    __metadata("design:returntype", Promise)
], AdminController.prototype, "createMenuItem", null);
__decorate([
    (0, common_1.Put)('menu/:id'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, typeof (_d = typeof menu_item_dto_1.UpdateMenuItemDto !== "undefined" && menu_item_dto_1.UpdateMenuItemDto) === "function" ? _d : Object]),
    __metadata("design:returntype", Promise)
], AdminController.prototype, "updateMenuItem", null);
__decorate([
    (0, common_1.Delete)('menu/:id'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], AdminController.prototype, "deleteMenuItem", null);
exports.AdminController = AdminController = __decorate([
    (0, common_1.Controller)('admin'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    __metadata("design:paramtypes", [typeof (_a = typeof admin_service_1.AdminService !== "undefined" && admin_service_1.AdminService) === "function" ? _a : Object])
], AdminController);


/***/ }),
/* 23 */
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var _a;
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.AdminService = void 0;
const common_1 = __webpack_require__(2);
const prisma_service_1 = __webpack_require__(12);
const database_1 = __webpack_require__(13);
const ORDER_STATUS_TRANSITIONS = {
    [database_1.OrderStatus.PENDING]: database_1.OrderStatus.ACCEPTED,
    [database_1.OrderStatus.ACCEPTED]: database_1.OrderStatus.PREPARING,
    [database_1.OrderStatus.PREPARING]: database_1.OrderStatus.READY,
    [database_1.OrderStatus.READY]: database_1.OrderStatus.COMPLETED,
};
let AdminService = class AdminService {
    constructor(prisma) {
        this.prisma = prisma;
    }
    normalizeOptionalString(value) {
        if (value === undefined)
            return undefined;
        const trimmed = value.trim();
        return trimmed.length ? trimmed : null;
    }
    resolveArPayload(input) {
        const arModelUrl = this.normalizeOptionalString(input.arModelUrl);
        const arModelUrlIos = this.normalizeOptionalString(input.arModelUrlIos);
        const arModelUrlAndroid = this.normalizeOptionalString(input.arModelUrlAndroid);
        const arThumbnail = this.normalizeOptionalString(input.arThumbnail);
        const hasAnyModelUrl = Boolean(arModelUrl || arModelUrlIos || arModelUrlAndroid);
        let hasArModel = input.hasArModel;
        if (hasArModel === undefined && hasAnyModelUrl) {
            hasArModel = true;
        }
        if (hasArModel === true && !hasAnyModelUrl) {
            throw new common_1.BadRequestException('AR model enabled but no model URLs provided');
        }
        if (hasArModel === false && hasAnyModelUrl) {
            throw new common_1.BadRequestException('Disable AR requires clearing AR model URLs');
        }
        return {
            hasArModel,
            arModelUrl,
            arModelUrlIos,
            arModelUrlAndroid,
            arThumbnail,
        };
    }
    async getStats() {
        const [ordersCount, menuItemsCount, reservationsCount, usersCount] = await Promise.all([
            this.prisma.order.count(),
            this.prisma.menuItem.count(),
            this.prisma.reservation.count(),
            this.prisma.user.count(),
        ]);
        return {
            ordersCount,
            menuItemsCount,
            reservationsCount,
            usersCount,
        };
    }
    async getOrders(page = 1, limit = 10) {
        const skip = (page - 1) * limit;
        const [orders, total] = await Promise.all([
            this.prisma.order.findMany({
                skip,
                take: limit,
                orderBy: { createdAt: 'desc' },
                select: {
                    id: true,
                    orderNumber: true,
                    type: true,
                    status: true,
                    customerName: true,
                    total: true,
                    createdAt: true,
                },
            }),
            this.prisma.order.count(),
        ]);
        return {
            data: orders,
            meta: { total, page, limit, pages: Math.ceil(total / limit) },
        };
    }
    async getOrderById(id) {
        const order = (await this.prisma.order.findUnique({
            where: { id },
            select: {
                id: true,
                orderNumber: true,
                tableId: true,
                status: true,
                total: true,
                createdAt: true,
                items: {
                    orderBy: { createdAt: 'asc' },
                    select: {
                        id: true,
                        quantity: true,
                        price: true,
                        subtotal: true,
                        notes: true,
                        itemSnapshot: true,
                    },
                },
            },
        }));
        if (!order) {
            throw new common_1.NotFoundException('Order not found');
        }
        return order;
    }
    async updateOrderStatus(id, status) {
        const order = await this.prisma.order.findUnique({
            where: { id },
            select: { id: true, status: true },
        });
        if (!order) {
            throw new common_1.NotFoundException('Order not found');
        }
        const expectedNext = ORDER_STATUS_TRANSITIONS[order.status];
        if (expectedNext !== status) {
            throw new common_1.ConflictException('Invalid status transition');
        }
        return this.prisma.order.update({
            where: { id },
            data: { status },
            select: {
                id: true,
                status: true,
                updatedAt: true,
            },
        });
    }
    async getMenuItems(page = 1, limit = 10) {
        const skip = (page - 1) * limit;
        const [items, total] = await Promise.all([
            this.prisma.menuItem.findMany({
                skip,
                take: limit,
                orderBy: { createdAt: 'desc' },
                select: {
                    id: true,
                    name: true,
                    nameAr: true,
                    price: true,
                    isAvailable: true,
                    hasArModel: true,
                    category: { select: { name: true, nameAr: true } },
                    createdAt: true,
                },
            }),
            this.prisma.menuItem.count(),
        ]);
        return {
            data: items,
            meta: { total, page, limit, pages: Math.ceil(total / limit) },
        };
    }
    async getUsers(page = 1, limit = 10) {
        const skip = (page - 1) * limit;
        const [users, total] = await Promise.all([
            this.prisma.user.findMany({
                skip,
                take: limit,
                orderBy: { createdAt: 'desc' },
                select: {
                    id: true,
                    email: true,
                    name: true,
                    role: true,
                    isActive: true,
                    createdAt: true,
                },
            }),
            this.prisma.user.count(),
        ]);
        return {
            data: users,
            meta: { total, page, limit, pages: Math.ceil(total / limit) },
        };
    }
    async getCategories() {
        return this.prisma.category.findMany({
            where: { isActive: true },
            select: { id: true, name: true, nameAr: true },
            orderBy: { sortOrder: 'asc' },
        });
    }
    async getMenuItemById(id) {
        return this.prisma.menuItem.findUnique({
            where: { id },
            include: { category: { select: { id: true, name: true, nameAr: true } } },
        });
    }
    async createMenuItem(data) {
        const arData = this.resolveArPayload(data);
        return this.prisma.menuItem.create({
            data: {
                name: data.name,
                nameAr: data.nameAr,
                description: data.description,
                descriptionAr: data.descriptionAr,
                price: data.price,
                preparationTime: data.preparationTime,
                calories: data.calories,
                categoryId: data.categoryId,
                isAvailable: data.isAvailable ?? true,
                hasArModel: arData.hasArModel ?? false,
                arModelUrl: arData.arModelUrl ?? null,
                arModelUrlIos: arData.arModelUrlIos ?? null,
                arModelUrlAndroid: arData.arModelUrlAndroid ?? null,
                arThumbnail: arData.arThumbnail ?? null,
            },
            include: { category: { select: { id: true, name: true, nameAr: true } } },
        });
    }
    async updateMenuItem(id, data) {
        const arInput = {
            hasArModel: data.hasArModel,
            arModelUrl: data.arModelUrl,
            arModelUrlIos: data.arModelUrlIos,
            arModelUrlAndroid: data.arModelUrlAndroid,
            arThumbnail: data.arThumbnail,
        };
        const arProvided = Object.values(arInput).some((value) => value !== undefined);
        const arUpdate = arProvided ? this.resolveArPayload(arInput) : null;
        const updateData = {
            ...data,
            ...(arUpdate?.hasArModel !== undefined ? { hasArModel: arUpdate.hasArModel } : {}),
            ...(arUpdate?.arModelUrl !== undefined ? { arModelUrl: arUpdate.arModelUrl } : {}),
            ...(arUpdate?.arModelUrlIos !== undefined ? { arModelUrlIos: arUpdate.arModelUrlIos } : {}),
            ...(arUpdate?.arModelUrlAndroid !== undefined ? { arModelUrlAndroid: arUpdate.arModelUrlAndroid } : {}),
            ...(arUpdate?.arThumbnail !== undefined ? { arThumbnail: arUpdate.arThumbnail } : {}),
        };
        return this.prisma.menuItem.update({
            where: { id },
            data: updateData,
            include: { category: { select: { id: true, name: true, nameAr: true } } },
        });
    }
    async deleteMenuItem(id) {
        return this.prisma.menuItem.delete({ where: { id } });
    }
};
exports.AdminService = AdminService;
exports.AdminService = AdminService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [typeof (_a = typeof prisma_service_1.PrismaService !== "undefined" && prisma_service_1.PrismaService) === "function" ? _a : Object])
], AdminService);


/***/ }),
/* 24 */
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.UpdateMenuItemDto = exports.CreateMenuItemDto = void 0;
const class_validator_1 = __webpack_require__(17);
class CreateMenuItemDto {
}
exports.CreateMenuItemDto = CreateMenuItemDto;
__decorate([
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateMenuItemDto.prototype, "name", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateMenuItemDto.prototype, "nameAr", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateMenuItemDto.prototype, "description", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateMenuItemDto.prototype, "descriptionAr", void 0);
__decorate([
    (0, class_validator_1.IsNumber)(),
    (0, class_validator_1.Min)(0),
    __metadata("design:type", Number)
], CreateMenuItemDto.prototype, "price", void 0);
__decorate([
    (0, class_validator_1.IsNumber)(),
    (0, class_validator_1.Min)(1),
    __metadata("design:type", Number)
], CreateMenuItemDto.prototype, "preparationTime", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsNumber)(),
    (0, class_validator_1.Min)(0),
    __metadata("design:type", Number)
], CreateMenuItemDto.prototype, "calories", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateMenuItemDto.prototype, "categoryId", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsBoolean)(),
    __metadata("design:type", Boolean)
], CreateMenuItemDto.prototype, "isAvailable", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsBoolean)(),
    __metadata("design:type", Boolean)
], CreateMenuItemDto.prototype, "hasArModel", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateMenuItemDto.prototype, "arModelUrl", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateMenuItemDto.prototype, "arModelUrlIos", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateMenuItemDto.prototype, "arModelUrlAndroid", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateMenuItemDto.prototype, "arThumbnail", void 0);
class UpdateMenuItemDto {
}
exports.UpdateMenuItemDto = UpdateMenuItemDto;
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], UpdateMenuItemDto.prototype, "name", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], UpdateMenuItemDto.prototype, "nameAr", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], UpdateMenuItemDto.prototype, "description", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], UpdateMenuItemDto.prototype, "descriptionAr", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsNumber)(),
    (0, class_validator_1.Min)(0),
    __metadata("design:type", Number)
], UpdateMenuItemDto.prototype, "price", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsNumber)(),
    (0, class_validator_1.Min)(1),
    __metadata("design:type", Number)
], UpdateMenuItemDto.prototype, "preparationTime", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsNumber)(),
    (0, class_validator_1.Min)(0),
    __metadata("design:type", Number)
], UpdateMenuItemDto.prototype, "calories", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], UpdateMenuItemDto.prototype, "categoryId", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsBoolean)(),
    __metadata("design:type", Boolean)
], UpdateMenuItemDto.prototype, "isAvailable", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsBoolean)(),
    __metadata("design:type", Boolean)
], UpdateMenuItemDto.prototype, "hasArModel", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], UpdateMenuItemDto.prototype, "arModelUrl", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], UpdateMenuItemDto.prototype, "arModelUrlIos", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], UpdateMenuItemDto.prototype, "arModelUrlAndroid", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], UpdateMenuItemDto.prototype, "arThumbnail", void 0);


/***/ }),
/* 25 */
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var _a;
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.UpdateOrderStatusDto = void 0;
const class_validator_1 = __webpack_require__(17);
const database_1 = __webpack_require__(13);
const ADMIN_ALLOWED_ORDER_STATUSES = [
    database_1.OrderStatus.ACCEPTED,
    database_1.OrderStatus.PREPARING,
    database_1.OrderStatus.READY,
    database_1.OrderStatus.COMPLETED,
];
class UpdateOrderStatusDto {
}
exports.UpdateOrderStatusDto = UpdateOrderStatusDto;
__decorate([
    (0, class_validator_1.IsEnum)(database_1.OrderStatus),
    (0, class_validator_1.IsIn)(ADMIN_ALLOWED_ORDER_STATUSES),
    __metadata("design:type", typeof (_a = typeof database_1.OrderStatus !== "undefined" && database_1.OrderStatus) === "function" ? _a : Object)
], UpdateOrderStatusDto.prototype, "status", void 0);


/***/ }),
/* 26 */
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.PublicModule = void 0;
const common_1 = __webpack_require__(2);
const menu_controller_1 = __webpack_require__(27);
const menu_service_1 = __webpack_require__(28);
const prisma_service_1 = __webpack_require__(12);
let PublicModule = class PublicModule {
};
exports.PublicModule = PublicModule;
exports.PublicModule = PublicModule = __decorate([
    (0, common_1.Module)({
        controllers: [menu_controller_1.PublicMenuController],
        providers: [menu_service_1.PublicMenuService, prisma_service_1.PrismaService],
        exports: [menu_service_1.PublicMenuService],
    })
], PublicModule);


/***/ }),
/* 27 */
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
var _a;
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.PublicMenuController = void 0;
const common_1 = __webpack_require__(2);
const menu_service_1 = __webpack_require__(28);
let PublicMenuController = class PublicMenuController {
    constructor(publicMenuService) {
        this.publicMenuService = publicMenuService;
    }
    async getMenuItems(page, limit) {
        const pageNumber = page ? Number.parseInt(page, 10) : 1;
        const limitNumber = limit ? Number.parseInt(limit, 10) : 10;
        return this.publicMenuService.getMenuItems(pageNumber, limitNumber);
    }
    async getCategories() {
        return this.publicMenuService.getCategories();
    }
    async getMenuItem(id) {
        return this.publicMenuService.getMenuItemById(id);
    }
    async getMenuItemAr(id) {
        return this.publicMenuService.getMenuItemArInfo(id);
    }
    async getMenuItemArReadiness(id, userAgent) {
        return this.publicMenuService.getMenuItemArReadiness(id, userAgent);
    }
};
exports.PublicMenuController = PublicMenuController;
__decorate([
    (0, common_1.Get)(),
    __param(0, (0, common_1.Query)('page')),
    __param(1, (0, common_1.Query)('limit')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String]),
    __metadata("design:returntype", Promise)
], PublicMenuController.prototype, "getMenuItems", null);
__decorate([
    (0, common_1.Get)('categories'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], PublicMenuController.prototype, "getCategories", null);
__decorate([
    (0, common_1.Get)(':id'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], PublicMenuController.prototype, "getMenuItem", null);
__decorate([
    (0, common_1.Get)(':id/ar'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], PublicMenuController.prototype, "getMenuItemAr", null);
__decorate([
    (0, common_1.Get)(':id/ar/readiness'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Headers)('user-agent')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String]),
    __metadata("design:returntype", Promise)
], PublicMenuController.prototype, "getMenuItemArReadiness", null);
exports.PublicMenuController = PublicMenuController = __decorate([
    (0, common_1.Controller)('public/menu'),
    __metadata("design:paramtypes", [typeof (_a = typeof menu_service_1.PublicMenuService !== "undefined" && menu_service_1.PublicMenuService) === "function" ? _a : Object])
], PublicMenuController);


/***/ }),
/* 28 */
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var _a;
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.PublicMenuService = void 0;
const common_1 = __webpack_require__(2);
const prisma_service_1 = __webpack_require__(12);
let PublicMenuService = class PublicMenuService {
    constructor(prisma) {
        this.prisma = prisma;
    }
    async getMenuItems(page = 1, limit = 10) {
        const take = Math.max(1, Math.min(limit, 50));
        const skip = (page - 1) * take;
        const [items, total] = await Promise.all([
            this.prisma.menuItem.findMany({
                skip,
                take,
                orderBy: { createdAt: 'desc' },
                select: {
                    id: true,
                    name: true,
                    nameAr: true,
                    description: true,
                    descriptionAr: true,
                    price: true,
                    preparationTime: true,
                    isAvailable: true,
                    hasArModel: true,
                    arThumbnail: true,
                    category: { select: { id: true, name: true, nameAr: true } },
                    createdAt: true,
                },
            }),
            this.prisma.menuItem.count({ where: { isActive: true, isAvailable: true } }),
        ]);
        return {
            data: items,
            meta: {
                total,
                page,
                limit: take,
                pages: Math.max(1, Math.ceil(total / take)),
            },
        };
    }
    async getMenuItemById(id) {
        return this.prisma.menuItem.findUnique({
            where: { id },
            include: {
                category: { select: { id: true, name: true, nameAr: true } },
            },
        });
    }
    async getCategories() {
        return this.prisma.category.findMany({
            where: { isActive: true },
            select: { id: true, name: true, nameAr: true, sortOrder: true },
            orderBy: { sortOrder: 'asc' },
        });
    }
    async getMenuItemArInfo(id) {
        const item = await this.prisma.menuItem.findUnique({
            where: { id },
            select: {
                hasArModel: true,
                arModelUrl: true,
                arModelUrlIos: true,
                arModelUrlAndroid: true,
                arThumbnail: true,
            },
        });
        if (!item) {
            throw new common_1.NotFoundException('Menu item not found');
        }
        return {
            hasArModel: item.hasArModel,
            arModelUrl: item.arModelUrl,
            arModelUrlIos: item.arModelUrlIos,
            arModelUrlAndroid: item.arModelUrlAndroid,
            arThumbnail: item.arThumbnail,
        };
    }
    async getMenuItemArReadiness(id, userAgent) {
        const item = await this.prisma.menuItem.findUnique({
            where: { id },
            select: {
                hasArModel: true,
                arModelUrl: true,
                arModelUrlIos: true,
                arModelUrlAndroid: true,
                arThumbnail: true,
            },
        });
        if (!item || !item.hasArModel) {
            return {
                isReady: false,
                supportedFormats: [],
                reason: 'No AR model available',
            };
        }
        const isIOS = userAgent?.includes('iPhone') || userAgent?.includes('iPad') || userAgent?.includes('iPod');
        const isAndroid = userAgent?.includes('Android');
        let modelUrl = null;
        const supportedFormats = [];
        if (isIOS && item.arModelUrlIos) {
            modelUrl = item.arModelUrlIos;
            supportedFormats.push('USDZ');
        }
        else if (isAndroid && item.arModelUrlAndroid) {
            modelUrl = item.arModelUrlAndroid;
            supportedFormats.push('GLB');
        }
        else if (item.arModelUrl) {
            modelUrl = item.arModelUrl;
            supportedFormats.push('GLB', 'USDZ');
        }
        if (!modelUrl) {
            return {
                isReady: false,
                supportedFormats: [],
                reason: 'No compatible AR model for this device',
            };
        }
        try {
            const response = await fetch(modelUrl, { method: 'HEAD' });
            const contentLength = response.headers.get('content-length');
            if (contentLength) {
                const sizeMB = parseInt(contentLength, 10) / (1024 * 1024);
                if (sizeMB > 25) {
                    return {
                        isReady: false,
                        supportedFormats,
                        reason: 'AR model exceeds size limit (25MB)',
                    };
                }
            }
        }
        catch (error) {
        }
        return {
            isReady: true,
            supportedFormats,
            modelUrl,
            thumbnailUrl: item.arThumbnail || undefined,
        };
    }
};
exports.PublicMenuService = PublicMenuService;
exports.PublicMenuService = PublicMenuService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [typeof (_a = typeof prisma_service_1.PrismaService !== "undefined" && prisma_service_1.PrismaService) === "function" ? _a : Object])
], PublicMenuService);


/***/ }),
/* 29 */
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.OrdersModule = void 0;
const common_1 = __webpack_require__(2);
const orders_controller_1 = __webpack_require__(30);
const orders_service_1 = __webpack_require__(31);
const prisma_service_1 = __webpack_require__(12);
const auth_module_1 = __webpack_require__(8);
let OrdersModule = class OrdersModule {
};
exports.OrdersModule = OrdersModule;
exports.OrdersModule = OrdersModule = __decorate([
    (0, common_1.Module)({
        imports: [auth_module_1.AuthModule],
        controllers: [orders_controller_1.OrdersController],
        providers: [orders_service_1.OrdersService, prisma_service_1.PrismaService],
    })
], OrdersModule);


/***/ }),
/* 30 */
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
var _a;
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.OrdersController = void 0;
const common_1 = __webpack_require__(2);
const orders_service_1 = __webpack_require__(31);
let OrdersController = class OrdersController {
    constructor(ordersService) {
        this.ordersService = ordersService;
    }
    async createOrder(body) {
        return this.ordersService.createOrder(body);
    }
    async getPublicOrderStatus(orderId) {
        return this.ordersService.getPublicOrderStatus(orderId);
    }
};
exports.OrdersController = OrdersController;
__decorate([
    (0, common_1.Post)(),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], OrdersController.prototype, "createOrder", null);
__decorate([
    (0, common_1.Get)(':id'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], OrdersController.prototype, "getPublicOrderStatus", null);
exports.OrdersController = OrdersController = __decorate([
    (0, common_1.Controller)('public/orders'),
    __metadata("design:paramtypes", [typeof (_a = typeof orders_service_1.OrdersService !== "undefined" && orders_service_1.OrdersService) === "function" ? _a : Object])
], OrdersController);


/***/ }),
/* 31 */
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var _a;
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.OrdersService = void 0;
const common_1 = __webpack_require__(2);
const prisma_service_1 = __webpack_require__(12);
const database_1 = __webpack_require__(13);
let OrdersService = class OrdersService {
    constructor(prisma) {
        this.prisma = prisma;
    }
    async createOrder(payload) {
        if (!payload.tableId) {
            throw new common_1.BadRequestException('tableId is required');
        }
        if (!payload.items || payload.items.length === 0) {
            throw new common_1.BadRequestException('items cannot be empty');
        }
        const normalizedItems = payload.items.reduce((acc, item) => {
            if (item.quantity <= 0) {
                throw new common_1.BadRequestException('quantity must be greater than 0');
            }
            acc[item.menuItemId] = (acc[item.menuItemId] || 0) + item.quantity;
            return acc;
        }, {});
        const menuItemIds = Object.keys(normalizedItems);
        const menuItems = await this.prisma.menuItem.findMany({
            where: { id: { in: menuItemIds } },
            select: { id: true, name: true, nameAr: true, price: true, isAvailable: true },
        });
        if (menuItems.length !== menuItemIds.length) {
            const missingIds = menuItemIds.filter((id) => !menuItems.some((item) => item.id === id));
            throw new common_1.NotFoundException(`Menu item(s) not found: ${missingIds.join(', ')}`);
        }
        for (const menuItem of menuItems) {
            if (!menuItem.isAvailable) {
                throw new common_1.ConflictException(`Menu item not available: ${menuItem.nameAr || menuItem.name}`);
            }
        }
        const orderItemsPayload = menuItems.map((menuItem) => {
            const quantity = normalizedItems[menuItem.id];
            const subtotal = Number((menuItem.price * quantity).toFixed(2));
            return {
                menuItemId: menuItem.id,
                quantity,
                price: menuItem.price,
                subtotal,
                itemSnapshot: {
                    name: menuItem.name,
                    nameAr: menuItem.nameAr,
                },
            };
        });
        const total = orderItemsPayload.reduce((acc, item) => acc + item.subtotal, 0);
        const tableIdValue = String(payload.tableId);
        const tableRecord = await this.prisma.table.findUnique({
            where: { id: tableIdValue },
            select: { id: true, number: true, branchId: true },
        });
        if (!tableRecord) {
            throw new common_1.NotFoundException(`Table not found: ${tableIdValue}`);
        }
        const orderData = {
            tableId: tableRecord.id,
            branchId: tableRecord.branchId,
            type: database_1.OrderType.DINE_IN,
            customerName: `Table ${tableRecord.number}`,
            customerPhone: '0000000000',
            status: database_1.OrderStatus.PENDING,
            subtotal: total,
            tax: 0,
            discount: 0,
            total,
            orderNumber: `ORD-${Date.now()}`,
            items: {
                create: orderItemsPayload,
            },
        };
        const order = await this.prisma.order.create({
            data: orderData,
            select: {
                id: true,
                status: true,
                total: true,
            },
        });
        return {
            orderId: order.id,
            status: order.status,
            total: order.total,
        };
    }
    async getPublicOrderStatus(orderId) {
        const order = await this.prisma.order.findUnique({
            where: { id: orderId },
            select: {
                id: true,
                status: true,
                total: true,
                createdAt: true,
            },
        });
        if (!order) {
            throw new common_1.NotFoundException('Order not found');
        }
        return {
            orderId: order.id,
            status: order.status,
            total: order.total,
            createdAt: order.createdAt,
        };
    }
};
exports.OrdersService = OrdersService;
exports.OrdersService = OrdersService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [typeof (_a = typeof prisma_service_1.PrismaService !== "undefined" && prisma_service_1.PrismaService) === "function" ? _a : Object])
], OrdersService);


/***/ }),
/* 32 */
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __exportStar = (this && this.__exportStar) || function(m, exports) {
    for (var p in m) if (p !== "default" && !Object.prototype.hasOwnProperty.call(exports, p)) __createBinding(exports, m, p);
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
__exportStar(__webpack_require__(33), exports);


/***/ }),
/* 33 */
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var GlobalExceptionFilter_1;
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.GlobalExceptionFilter = void 0;
const common_1 = __webpack_require__(2);
const shared_1 = __webpack_require__(34);
let GlobalExceptionFilter = GlobalExceptionFilter_1 = class GlobalExceptionFilter {
    constructor() {
        this.logger = new common_1.Logger(GlobalExceptionFilter_1.name);
    }
    catch(exception, host) {
        const ctx = host.switchToHttp();
        const response = ctx.getResponse();
        const request = ctx.getRequest();
        const isProduction = process.env.NODE_ENV === 'production';
        let status;
        let message;
        let error;
        let details;
        let code = shared_1.ERROR_CODES.INVALID_INPUT.code;
        if (exception instanceof common_1.HttpException) {
            status = exception.getStatus();
            const exceptionResponse = exception.getResponse();
            if (typeof exceptionResponse === 'string') {
                message = exceptionResponse;
                error = common_1.HttpStatus[status] || 'Error';
            }
            else if (typeof exceptionResponse === 'object') {
                const resp = exceptionResponse;
                message = resp.message || exception.message;
                error = resp.error || common_1.HttpStatus[status] || 'Error';
                details = resp.message;
            }
            else {
                message = exception.message;
                error = common_1.HttpStatus[status] || 'Error';
            }
        }
        else {
            status = common_1.HttpStatus.INTERNAL_SERVER_ERROR;
            message = isProduction ? 'Internal server error' : exception?.message || 'Unknown error';
            error = 'Internal Server Error';
            code = shared_1.ERROR_CODES.INTERNAL_SERVER_ERROR?.code || 'GEN_001';
            this.logger.error(`Unexpected error: ${exception?.message}`, exception?.stack);
        }
        if (status === common_1.HttpStatus.UNAUTHORIZED) {
            code = shared_1.ERROR_CODES.AUTH_UNAUTHORIZED.code;
        }
        else if (status === common_1.HttpStatus.FORBIDDEN) {
            code = shared_1.ERROR_CODES.AUTH_INSUFFICIENT_PERMISSIONS.code;
        }
        else if (status === common_1.HttpStatus.NOT_FOUND) {
            code = shared_1.ERROR_CODES.MENU_ITEM_NOT_FOUND.code;
        }
        else if (status === common_1.HttpStatus.TOO_MANY_REQUESTS) {
            code = 'SYS_429';
        }
        else if (status === common_1.HttpStatus.BAD_REQUEST) {
            code = shared_1.ERROR_CODES.VALIDATION_ERROR.code;
        }
        const errorResponse = {
            statusCode: status,
            code,
            message,
            error,
            timestamp: new Date().toISOString(),
            path: request.url,
            details: !isProduction ? details : undefined,
        };
        if (!isProduction && exception instanceof Error) {
            errorResponse.stack = exception.stack;
        }
        response.status(status).json(errorResponse);
    }
};
exports.GlobalExceptionFilter = GlobalExceptionFilter;
exports.GlobalExceptionFilter = GlobalExceptionFilter = GlobalExceptionFilter_1 = __decorate([
    (0, common_1.Catch)()
], GlobalExceptionFilter);


/***/ }),
/* 34 */
/***/ ((module) => {

module.exports = require("@restaurant/shared");

/***/ }),
/* 35 */
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.LoggingInterceptor = void 0;
const common_1 = __webpack_require__(2);
const operators_1 = __webpack_require__(36);
let LoggingInterceptor = class LoggingInterceptor {
    constructor() {
        this.logger = new common_1.Logger('HTTP');
    }
    intercept(context, next) {
        const request = context.switchToHttp().getRequest();
        const { method, url } = request;
        const ip = request.ip || 'unknown';
        const userAgent = request.headers?.['user-agent'] || 'unknown';
        const start = Date.now();
        return next.handle().pipe((0, operators_1.tap)(() => {
            const duration = Date.now() - start;
            const logPayload = {
                type: 'http_request',
                method,
                url,
                ip,
                userAgent,
                durationMs: duration,
                timestamp: new Date().toISOString(),
            };
            this.logger.log(JSON.stringify(logPayload));
        }));
    }
};
exports.LoggingInterceptor = LoggingInterceptor;
exports.LoggingInterceptor = LoggingInterceptor = __decorate([
    (0, common_1.Injectable)()
], LoggingInterceptor);


/***/ }),
/* 36 */
/***/ ((module) => {

module.exports = require("rxjs/operators");

/***/ })
/******/ 	]);
/************************************************************************/
/******/ 	// The module cache
/******/ 	var __webpack_module_cache__ = {};
/******/ 	
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/ 		// Check if module is in cache
/******/ 		var cachedModule = __webpack_module_cache__[moduleId];
/******/ 		if (cachedModule !== undefined) {
/******/ 			return cachedModule.exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = __webpack_module_cache__[moduleId] = {
/******/ 			// no module.id needed
/******/ 			// no module.loaded needed
/******/ 			exports: {}
/******/ 		};
/******/ 	
/******/ 		// Execute the module function
/******/ 		__webpack_modules__[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/ 	
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/ 	
/************************************************************************/
/******/ 	
/******/ 	// startup
/******/ 	// Load entry module and return exports
/******/ 	// This entry module is referenced by other modules so it can't be inlined
/******/ 	var __webpack_exports__ = __webpack_require__(0);
/******/ 	
/******/ })()
;