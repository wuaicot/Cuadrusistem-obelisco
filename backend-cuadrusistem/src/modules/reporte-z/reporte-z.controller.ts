import {
  Controller,
  Post,
  UseInterceptors,
  UploadedFile,
  Body,
  Get,
  Query,
  Param,
  ParseBoolPipe,
  NotFoundException,
  ParseFilePipe, // Import ParseFilePipe
  MaxFileSizeValidator, // Import MaxFileSizeValidator
  FileTypeValidator, // Import FileTypeValidator
  BadRequestException, // Import BadRequestException for file presence check
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { ReporteZService } from './reporte-z.service';
import { CreateReporteZDto } from './dto/create-reporte-z.dto';
import { diskStorage } from 'multer';
import { extname } from 'path';
import { ReporteZEntity } from './reporte-z.entity';

@Controller('reporte-z')
export class ReporteZController {
  constructor(private readonly reporteZService: ReporteZService) {}

  @Post()
  @UseInterceptors(
    FileInterceptor('file', {
      storage: diskStorage({
        destination: './uploads',
        filename: (req, file, cb) => {
          const randomName = Array(32)
            .fill(null)
            .map(() => Math.round(Math.random() * 16).toString(16))
            .join('');
          cb(null, `${randomName}${extname(file.originalname)}`);
        },
      }),
    }),
  )
  async uploadReporteZ(
    @UploadedFile(
      new ParseFilePipe({
        validators: [
          new MaxFileSizeValidator({ maxSize: 1024 * 1024 * 5 }), // 5MB limit
          new FileTypeValidator({ fileType: 'image/(png|jpeg|jpg)' }),
        ],
      }),
    )
    file: Express.Multer.File,
    @Body() createReporteZDto: CreateReporteZDto,
  ) {
    if (!file) {
      throw new BadRequestException('No file uploaded');
    }
    // DTO validation is handled by NestJS automatically if ValidationPipe is set up globally
    return this.reporteZService.create(file, createReporteZDto);
  }

  @Get()
  async findAll(@Query('procesado') procesado?: string): Promise<ReporteZEntity[]> {
    if (procesado !== undefined) {
      const processedBoolean = procesado === 'true'; // Manual conversion for now, or use ParseBoolPipe
      return this.reporteZService.findAll(processedBoolean);
    }
    return this.reporteZService.findAll();
  }

  @Get(':id')
  async findOne(@Param('id') id: string): Promise<ReporteZEntity> {
    const reporteZ = await this.reporteZService.findOne(id);
    if (!reporteZ) {
      throw new NotFoundException(`ReporteZ with ID ${id} not found.`);
    }
    return reporteZ;
  }
}
