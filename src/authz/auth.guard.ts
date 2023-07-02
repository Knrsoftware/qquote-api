import { BadRequestException, CanActivate, ExecutionContext, Injectable, UnauthorizedException } from "@nestjs/common";
import * as jwksClient from "jwks-rsa";
import * as jwt from "jsonwebtoken";
import { Reflector } from "@nestjs/core";

@Injectable()
export class AuthorizationGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const req = context.getArgByIndex(0);
    // const res = context.getArgByIndex(1);
    const token = req.headers.authorization;
    if (!token) {
      const isPublic = this.reflector.get<string[]>("isPublic", context.getHandler());
      if (isPublic) {
        return true;
      }
      throw new UnauthorizedException("Token required");
    } else {
      try {
        const bearerToken = token.split(" ")[1];
        const client = jwksClient({
          jwksUri: `${process.env.AUTH0_ISSUER_URL}.well-known/jwks.json`,
        });
        const getKey = (header, callback) => {
          client.getSigningKey(header.kid, function (error, key: any) {
            if (error) {
              callback("Invalid token");
            } else {
              const signingKey = key.publicKey || key.rsaPublicKey;
              callback(null, signingKey);
            }
          });
        };
        const user = await this.validateUser(bearerToken, getKey);
        req["user"] = user;
        const permissions = this.reflector.get<string[]>("permissions", context.getHandler());
        if (permissions) {
          // console.log(user.permissions, permissions);
          return user.permissions.some((e: string) => permissions.includes(e));
        }
        return true;
      } catch (error) {
        console.error(error);
        throw new BadRequestException(error.message);
      }
    }
  }

  async validateUser(bearerToken: string, getKey: jwt.Secret | jwt.GetPublicKeyOrSecret): Promise<any> {
    return new Promise((resolve, reject) => {
      jwt.verify(
        bearerToken,
        getKey,
        {
          audience: process.env.AUTH0_AUDIENCE,
          issuer: `${process.env.AUTH0_ISSUER_URL}`,
          algorithms: ["RS256"],
        },
        (error, decoded) => {
          if (error) {
            reject(error);
          }
          if (decoded) {
            Object.keys(decoded).forEach(elem => {
              if (elem.includes(process.env.AUTH0_AUDIENCE)) {
                const old_key = elem;
                const new_key = elem.replace(process.env.AUTH0_AUDIENCE + "/", "");
                delete Object.assign(decoded, { [new_key]: decoded[old_key] })[old_key];
              }
            });
            let permissions = decoded["permissions"];
            if (decoded["_permissions"]) {
              permissions = permissions.concat(decoded["_permissions"]);
              decoded["permissions"] = permissions;
              delete decoded["_permissions"];
            }
            // console.log(decoded);
            resolve(decoded);
          }
        },
      );
    });
  }
}
