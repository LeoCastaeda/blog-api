"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserUnbanned = exports.UserBanned = exports.UserPasswordUpdated = exports.UserEmailUpdated = void 0;
class UserEmailUpdated {
    constructor(id, email) {
        this.id = id;
        this.email = email;
    }
}
exports.UserEmailUpdated = UserEmailUpdated;
class UserPasswordUpdated {
    constructor(id, password) {
        this.id = id;
        this.password = password;
    }
}
exports.UserPasswordUpdated = UserPasswordUpdated;
class UserBanned {
    constructor(id) {
        this.id = id;
    }
}
exports.UserBanned = UserBanned;
class UserUnbanned {
    constructor(id) {
        this.id = id;
    }
}
exports.UserUnbanned = UserUnbanned;
