import { Property } from "../../../domain/entities/property";
import { PropertyEntity } from "../entities/property_entity";
import { PropertyMapper } from "./property_mapper";


describe("PropertyMapper", () => {
    it("deve converter PropertyEntity em Property corretamente", async () => {
        const propertyEntity = new PropertyEntity();
        propertyEntity.id = "1";
        propertyEntity.name = "Property 1";
        propertyEntity.description = "Description 1";
        propertyEntity.basePricePerNight = 100;
        propertyEntity.maxGuests = 2;


        const property = PropertyMapper.toDomain(propertyEntity);
        expect(property).toBeInstanceOf(Property);
        expect(property.getId()).toBe("1");
        expect(property.getName()).toBe("Property 1");
        expect(property.getDescription()).toBe("Description 1");
        expect(property.getBasePricePerNight()).toBe(100);
        expect(property.getMaxGuests()).toBe(2);


    });

    it("deve lançar erro de validação ao faltar campos obrigatórios no PropertyEntity", async () => {
        const propertyEntity = new PropertyEntity();
        expect(() => PropertyMapper.toDomain(propertyEntity)).toThrow("PropertyEntity is not valid");
    });

    it("deve converter Property em PropertyEntity corretamente", async () => {
        const property = new Property("1", "Property 1", "Description 1", 100, 2);
        const propertyEntity = PropertyMapper.toPersistence(property);
        expect(propertyEntity).toBeInstanceOf(PropertyEntity);
        expect(propertyEntity.id).toBe("1");
        expect(propertyEntity.name).toBe("Property 1");
        expect(propertyEntity.description).toBe("Description 1");
        expect(propertyEntity.basePricePerNight).toBe(2);
        expect(propertyEntity.maxGuests).toBe(100);
    });



});