/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
export type ResetPasswordDto = {
    /**
     * Password reset token received via email
     */
    token: string;
    /**
     * New password (minimum 8 characters)
     */
    newPassword: string;
};

