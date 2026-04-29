"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.JWT_CONFIG = void 0;
/**
 * JWT Configuration
 *
 * S - Single Responsibility: Centraliza la configuración y utilidades JWT.
 */
exports.JWT_CONFIG = {
    secret: process.env.JWT_SECRET || 'supersafesecretkey_change_in_production',
    expiresIn: '1d',
};
