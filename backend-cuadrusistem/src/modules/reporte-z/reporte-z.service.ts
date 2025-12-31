import {
  Injectable,
  BadRequestException,
  InternalServerErrorException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ReporteZEntity } from './reporte-z.entity';
import { CreateReporteZDto } from './dto/create-reporte-z.dto';
import { parseReporteZ } from '../../../parseReporteZ';
import { LocalEntity } from '../locales/local.entity';
// import { createWorker } from 'tesseract.js';
import { OcrService } from './ocr.service';
import { CATALOGO_BASE } from '../../domain/catalogo/catalogo.base'; // Import CATALOGO_BASE
import { TurnoEntity } from '../turnos/turno.entity'; // Import TurnoEntity
import { TurnosService } from '../turnos/turnos.service'; // Import TurnosService

@Injectable()
export class ReporteZService {
  constructor(
    @InjectRepository(ReporteZEntity)
    private readonly reporteZRepository: Repository<ReporteZEntity>,
    @InjectRepository(LocalEntity)
    private readonly localRepository: Repository<LocalEntity>,
    private readonly ocrService: OcrService,
    private readonly turnosService: TurnosService, // Inject TurnosService
  ) {}

  async create(
    file: Express.Multer.File,
    createReporteZDto: CreateReporteZDto,
  ): Promise<ReporteZEntity> {
    if (!file) {
      throw new BadRequestException('No file uploaded');
    }

    const { fechaOperacion, turnoId, localId } = createReporteZDto;

    const local = await this.localRepository.findOne({
      where: { id: localId },
    });
    if (!local) {
      throw new BadRequestException('Local not found');
    }

    const turno = await this.turnosService.findOne(turnoId); // Fetch TurnoEntity
    if (!turno) {
      throw new BadRequestException(`Turno with ID ${turnoId} not found.`);
    }

    let textoExtraido: string;
    try {
      textoExtraido = await this.ocrService.processImage(file.buffer);
    } catch (error) {
      console.error('OCR Error:', error);
      throw new InternalServerErrorException('Failed to process image with OCR');
    } finally {
      // The OcrService manages its worker lifecycle, so no need to terminate here.
    }

    if (!textoExtraido) {
      throw new BadRequestException('Could not extract text from image');
    }

    const parsedSales = parseReporteZ(textoExtraido);

    const items = Array.from(parsedSales.entries()).map(([codigo, cantidad]) => {
      const producto = CATALOGO_BASE.get(codigo);
      let seccion: 'BAR' | 'COCINA' | 'EMPANADAS' | 'DESCONOCIDO' = 'DESCONOCIDO';

      if (producto) {
        switch (producto.tipo) {
          case 'BEBESTIBLE':
            seccion = 'BAR';
            break;
          case 'MENU':
            seccion = 'COCINA';
            break;
          case 'EMPANADA':
            seccion = 'EMPANADAS';
            break;
        }
      }

      return {
        codigo,
        nombre: producto ? producto.nombre : `Producto ${codigo} (Desconocido)`,
        cantidad,
        seccion: seccion, // Use the mapped seccion
      };
    });

    const newReporteZ = this.reporteZRepository.create({
      turno,
      fechaOperacion,
      local,
      archivoOriginal: file.path, // Store the path where multer saved the file
      items: items as any, // TypeORM jsonb column expects this type
      checksum: 'mock-checksum-' + Date.now(), // Placeholder for a unique checksum
      procesado: false,
      cargadoPor: undefined, // TODO: Link to actual user once auth is implemented
    });

    return this.reporteZRepository.save(newReporteZ);
  }

  async findAll(procesado?: boolean): Promise<ReporteZEntity[]> {
    const findOptions: any = {
      relations: ['local', 'turno'], // Include related entities
    };
    if (procesado !== undefined) {
      findOptions.where = { procesado };
    }
    return this.reporteZRepository.find(findOptions);
  }

  async findOne(id: string): Promise<ReporteZEntity | null> {
    return this.reporteZRepository.findOne({
      where: { id },
      relations: ['local', 'turno'],
    });
  }
}
