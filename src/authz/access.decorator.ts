import { SetMetadata } from "@nestjs/common";

export const isPublic = () => SetMetadata("isPublic", true);
export const check_permissions = (...permissions: string[]) => SetMetadata("permissions", permissions);
