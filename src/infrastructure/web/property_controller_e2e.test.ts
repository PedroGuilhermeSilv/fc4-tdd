import express from "express";
import request from "supertest";
import { DataSource } from "typeorm";
import { PropertyService } from "../../application/services/property_service";
import { BookingEntity } from "../persistence/entities/booking_entity";
import { PropertyEntity } from "../persistence/entities/property_entity";
import { UserEntity } from "../persistence/entities/user_entity";
import { TypeORMPropertyRepository } from "../repositories/typeorm_property_repository";
import { TypeORMUserRepository } from "../repositories/typeorm_user_repository";
import { PropertyController } from "./property_controller";

const app = express();
app.use(express.json());

let dataSource: DataSource;
let userRepository: TypeORMUserRepository;
let propertyRepository: TypeORMPropertyRepository;
let propertyService: PropertyService;
let propertyController: PropertyController;

beforeAll(async () => {
    dataSource = new DataSource({
        type: "sqlite",
        database: ":memory:",
        dropSchema: true,
        entities: [PropertyEntity, UserEntity, BookingEntity],
        synchronize: true,
        logging: false,
    });

    await dataSource.initialize();

    userRepository = new TypeORMUserRepository(
        dataSource.getRepository(UserEntity)
    );

    propertyRepository = new TypeORMPropertyRepository(
        dataSource.getRepository(PropertyEntity)
    );

    propertyService = new PropertyService(propertyRepository);
    propertyController = new PropertyController(propertyService);

    app.post("/properties", (req, res, next) => {
        propertyController.createProperty(req, res).catch((err) => next(err));
    });
});

afterAll(async () => {
    if (dataSource.isInitialized) {
        await dataSource.destroy();
    }
});

describe("PropertyController", () => {
    it("deve criar uma propriedade com sucesso", async () => {
        const response = await request(app).post("/properties").send({
            name: "Propriedade de Teste",
            description: "Descrição da propriedade",
            basePricePerNight: 100,
            maxGuests: 2,
        });

        expect(response.status).toBe(201);
        expect(response.body.message).toBe("Propriedade criada com sucesso");
        expect(response.body.property).toHaveProperty("id");
        expect(response.body.property).toHaveProperty("name");
        expect(response.body.property).toHaveProperty("description");
        expect(response.body.property).toHaveProperty("basePricePerNight");
        expect(response.body.property).toHaveProperty("maxGuests");
    });

    it("deve retornar erro com código 400 e mensagem 'O nome da propriedade é obrigatório.' ao enviar um nome vazio", async () => {
        const response = await request(app).post("/properties").send({
            name: "",
            description: "Descrição da propriedade",
            basePricePerNight: 100,
            maxGuests: 2,
        });

        expect(response.status).toBe(400);
        expect(response.body.message).toBe("O campo nome é obrigatório.");
    });

    it("deve retornar erro com código 400 e mensagem 'A capacidade máxima deve ser maior que zero.' ao enviar maxGuests igual a zero ou negativo", async () => {
        const response = await request(app).post("/properties").send({
            name: "Propriedade de Teste",
            description: "Descrição da propriedade",
            basePricePerNight: 100,
            maxGuests: 0,
        });

        expect(response.status).toBe(400);
        expect(response.body.message).toBe("A capacidade máxima deve ser maior que zero.");
    });
    it("deve retornar erro com código 400 e mensagem 'O preço base por noite é obrigatório.' ao enviar basePricePerNight ausente", async () => {
        const response = await request(app).post("/properties").send({
            name: "Propriedade de Teste",
            description: "Descrição da propriedade",
            maxGuests: 2,
        });

        expect(response.status).toBe(400);
        expect(response.body.message).toBe("O preço base por noite é obrigatório.");
    });
});
