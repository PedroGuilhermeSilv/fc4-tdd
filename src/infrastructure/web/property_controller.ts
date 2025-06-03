import { Request, Response } from "express";
import { PropertyService } from "../../application/services/property_service";

export class PropertyController {
    private propertyService: PropertyService;

    constructor(propertyService: PropertyService) {
        this.propertyService = propertyService;
    }

    async createProperty(req: Request, res: Response): Promise<Response> {
        try {
            const name = req.body.name;
            const description = req.body.description;
            const basePricePerNight = req.body.basePricePerNight;
            const maxGuests = req.body.maxGuests;

            const property = await this.propertyService.createProperty(name, description, basePricePerNight, maxGuests);

            return res.status(201).json({
                message: "Propriedade criada com sucesso",
                property: {
                    id: property.getId(),
                    name: property.getName(),
                    description: property.getDescription(),
                    basePricePerNight: property.getBasePricePerNight(),
                    maxGuests: property.getMaxGuests(),
                },
            });
        } catch (error: any) {
            return res
                .status(400)
                .json({ message: error.message || "Erro ao criar propriedade" });
        }
    }


}
