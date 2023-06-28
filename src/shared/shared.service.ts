import { Injectable } from "@nestjs/common";

@Injectable()
export class SharedService {
  successResponse(msg: string, data: any = {}, code = 200) {
    return {
      statusCode: code,
      message: msg,
      data: data,
      error: null,
    };
  }
}
