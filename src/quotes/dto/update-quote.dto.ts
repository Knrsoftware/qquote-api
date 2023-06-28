import { CreateQuoteDto } from "./create-quote.dto";
import { PartialType } from "@nestjs/swagger";

export class UpdateQuoteDto extends PartialType(CreateQuoteDto) {}
