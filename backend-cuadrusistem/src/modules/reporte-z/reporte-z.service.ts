import { Injectable, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ReporteZEntity } from './reporte-z.entity';
import { CreateReporteZDto } from './dto/create-reporte-z.dto';
import { parseReporteZ } from '../../../parseReporteZ'; // Assuming parseReporteZ.ts is in the root
import { LocalEntity } from '../locales/local.entity'; // For finding the local

@Injectable()
export class ReporteZService {
  constructor(
    @InjectRepository(ReporteZEntity)
    private readonly reporteZRepository: Repository<ReporteZEntity>,
    @InjectRepository(LocalEntity)
    private readonly localRepository: Repository<LocalEntity>,
  ) {}

  async create(
    file: Express.Multer.File,
    createReporteZDto: CreateReporteZDto,
  ): Promise<ReporteZEntity> {
    const { fechaOperacion, turno, localId } = createReporteZDto;

    const local = await this.localRepository.findOne({
      where: { id: localId },
    });
    if (!local) {
      throw new BadRequestException('Local not found');
    }

    // IMPORTANT: Simplification - In a real scenario, OCR would extract text from the image.
    // For now, we'll use a mock text to demonstrate the parsing logic.
    const mockTextoZ = `
      0508 COM ITALIANO SUPER        3
      4869 PROMO SCHOP 2X1           5
      1234 PRODUCTO TEST           10
      0508 COM ITALIANO SUPER        2
    `;

    const parsedSales = parseReporteZ(mockTextoZ);

    const items = Array.from(parsedSales.entries()).map(([codigo, cantidad]) => ({
      codigo,
      nombre: `Producto ${codigo}`, // Placeholder name, should come from product catalog
      cantidad,
      seccion: 'BAR', // Placeholder section
    }));

    const newReporteZ = this.reporteZRepository.create({
      turno,
      fechaOperacion,
      local,
      archivoOriginal: file.path, // Store the path where multer saved the file
      items: items as any, // TypeORM jsonb column expects this type
      checksum: 'mock-checksum-' + Date.now(), // Placeholder for a unique checksum
      procesado: false,
      cargadoPor: null, // TODO: Link to actual user once auth is implemented
    });

    return this.reporteZRepository.save(newReporteZ);
  }
}
