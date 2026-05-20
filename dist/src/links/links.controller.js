"use strict";
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
Object.defineProperty(exports, "__esModule", { value: true });
exports.LinksController = void 0;
const common_1 = require("@nestjs/common");
const create_link_dto_1 = require("./DTO/create-link.dto");
const links_service_1 = require("./links.service");
const jwt_auth_guard_1 = require("../auth/jwt-auth.guard");
let LinksController = class LinksController {
    linkService;
    constructor(linkService) {
        this.linkService = linkService;
    }
    async postUrl(createLinkDto) {
        const url = createLinkDto.url;
        const returnUrl = await this.linkService.shortenerUrl(url);
        return returnUrl;
    }
    async getUrl(code) {
        const returnUrl = await this.linkService.returnUrlByCode(code);
        if (!returnUrl)
            throw new common_1.NotFoundException();
        return { url: returnUrl.url, statusCode: 302 };
    }
};
exports.LinksController = LinksController;
__decorate([
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, common_1.Post)(),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [create_link_dto_1.CreateLinkDto]),
    __metadata("design:returntype", Promise)
], LinksController.prototype, "postUrl", null);
__decorate([
    (0, common_1.Get)(':code'),
    (0, common_1.Redirect)(),
    __param(0, (0, common_1.Param)('code')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], LinksController.prototype, "getUrl", null);
exports.LinksController = LinksController = __decorate([
    (0, common_1.Controller)('links'),
    __metadata("design:paramtypes", [links_service_1.LinksService])
], LinksController);
