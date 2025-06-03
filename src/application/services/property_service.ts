import { v4 as uuidv4 } from 'uuid';
import { Property } from "../../domain/entities/property";
import { PropertyRepository } from "../../domain/repositories/property_repository";
export class PropertyService {
  constructor(private readonly propertyRepository: PropertyRepository) { }

  async findPropertyById(id: string): Promise<Property | null> {
    return this.propertyRepository.findById(id);
  }

  async createProperty(name: string, description: string, basePricePerNight: number, maxGuests: number): Promise<Property> {

    if (!name) {
      throw new Error("O campo nome é obrigatório.");
    }
    if (maxGuests <= 0) {
      throw new Error("A capacidade máxima deve ser maior que zero.");
    }
    if (!basePricePerNight) {
      throw new Error("O preço base por noite é obrigatório.");
    }

    const property = new Property(uuidv4(), name, description, basePricePerNight, maxGuests);
    await this.propertyRepository.save(property);
    return property;
  }
}
