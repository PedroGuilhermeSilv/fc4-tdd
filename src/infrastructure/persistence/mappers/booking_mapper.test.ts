import { Booking } from "../../../domain/entities/booking";
import { Property } from "../../../domain/entities/property";
import { User } from "../../../domain/entities/user";
import { DateRange } from "../../../domain/value_objects/date_range";
import { BookingEntity } from "../entities/booking_entity";
import { PropertyEntity } from "../entities/property_entity";
import { UserEntity } from "../entities/user_entity";
import { BookingMapper } from "./booking_mapper";
import { PropertyMapper } from "./property_mapper";


describe("BookingMapper", () => {
    it("deve converter BookingEntity em Booking corretamente", async () => {
        const propertyEntity = new PropertyEntity();
        propertyEntity.id = "1";
        propertyEntity.name = "Property 1";
        propertyEntity.description = "Description 1";
        propertyEntity.basePricePerNight = 100;
        propertyEntity.maxGuests = 2;

        const userEntity = new UserEntity();
        userEntity.id = "1";
        userEntity.name = "User 1";

        const bookingEntity = new BookingEntity();
        bookingEntity.id = "1";
        bookingEntity.property = propertyEntity;
        bookingEntity.guest = userEntity;
        bookingEntity.startDate = new Date();
        bookingEntity.endDate = new Date();
        bookingEntity.totalPrice = 100;

        const property = PropertyMapper.toDomain(propertyEntity);
        expect(property).toBeInstanceOf(Property);
        expect(property.getId()).toBe("1");
        expect(property.getName()).toBe("Property 1");
        expect(property.getDescription()).toBe("Description 1");
        expect(property.getBasePricePerNight()).toBe(100);
        expect(property.getMaxGuests()).toBe(2);
    });

    it("deve lançar erro de validação ao faltar campos obrigatórios no BookingEntity", async () => {
        const bookingEntity = new BookingEntity();
        expect(() => BookingMapper.toDomain(bookingEntity)).toThrow("BookingEntity is not valid");
    });

    it("deve converter Booking para BookingEntity corretamente", async () => {
        const property = new Property("1", "Property 1", "Description 1", 100, 2);
        const user = new User("1", "User 1");
        const startDate = new Date();
        const endDate = new Date(startDate.getTime() + 24 * 60 * 60 * 1000);
        const booking = new Booking("1", property, user, new DateRange(startDate, endDate), 2);
        const bookingEntity = BookingMapper.toPersistence(booking);

        expect(bookingEntity).toBeInstanceOf(BookingEntity);
        expect(bookingEntity.id).toBe("1");
        expect(bookingEntity.property.id).toBe("1");
        expect(bookingEntity.guest.id).toBe("1");
        expect(bookingEntity.startDate).toBeInstanceOf(Date);
        expect(bookingEntity.endDate).toBeInstanceOf(Date);
        expect(bookingEntity.guestCount).toBe(2);
    });
});