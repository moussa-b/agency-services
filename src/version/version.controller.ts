import { Controller, Get } from "@nestjs/common";

@Controller('version')
export class VersionController {
  @Get()
  getVersion(): { version: string } {
    const version = require('../../package.json').version;
    return { version };
  }
}
