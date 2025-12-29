import {
  Controller,
  Post,
  UseInterceptors,
  UploadedFile,
  Body,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { ReporteZService } from './reporte-z.service';
import { CreateReporteZDto } from './dto/create-reporte-z.dto';
import { diskStorage } from 'multer';
import { extname } from 'path';

@Controller('reporte-z')
export class ReporteZController {
  constructor(private readonly reporteZService: ReporteZService) {}

  @Post()
  @UseInterceptors(
    FileInterceptor('file', {
      storage: diskStorage({
        destination: './uploads', // Directory where files will be stored
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
    @UploadedFile() file: Express.Multer.File,
    @Body() createReporteZDto: CreateReporteZDto,
  ) {
    // TODO: Validate DTO and file
    return this.reporteZService.create(file, createReporteZDto);
  }
}
