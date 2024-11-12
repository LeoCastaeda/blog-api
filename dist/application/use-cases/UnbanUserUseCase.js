"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UnbanUserUseCase = void 0;
class UnbanUserUseCase {
    constructor(userService) {
        this.userService = userService;
    }
    execute(userId) {
        return this.userService.unbanUser(userId);
    }
}
exports.UnbanUserUseCase = UnbanUserUseCase;
