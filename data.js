const initialData = {
    drivers: [
        { id: 1, name: "Петренко Іван Олегович", phone: "+380671234567", birthYear: 1985, experience: 12, rating: 4.8, license: "BXA123456", status: "На лінії" },
        { id: 2, name: "Коваль Андрій Сергійович", phone: "+380502345678", birthYear: 1992, experience: 6, rating: 4.6, license: "BXC654321", status: "Вихідний" },
        { id: 3, name: "Шевченко Олена Петрівна", phone: "+380933456789", birthYear: 1990, experience: 8, rating: 4.9, license: "BXE112233", status: "На лінії" },
        { id: 4, name: "Бондар Микола Васильович", phone: "+380974567890", birthYear: 1978, experience: 20, rating: 4.5, license: "BXK998877", status: "На замовленні" }
    ],

    cars: [
        { id: 1, brand: "Toyota", model: "Camry", year: 2019, number: "AA1234KI", color: "Білий", carClass: "Комфорт", driverId: 1 },
        { id: 2, brand: "Skoda", model: "Octavia", year: 2017, number: "AI5678BC", color: "Сірий", carClass: "Стандарт", driverId: 2 },
        { id: 3, brand: "Hyundai", model: "Sonata", year: 2020, number: "AA4321MP", color: "Чорний", carClass: "Комфорт", driverId: 3 },
        { id: 4, brand: "Renault", model: "Logan", year: 2015, number: "KA8765AH", color: "Синій", carClass: "Економ", driverId: 4 }
    ],

    rides: [
        { id: 1, from: "вул. Хрещатик, 22", to: "Аеропорт Бориспіль", date: "01.10.2026 08:15", distance: 38, price: 650, payment: "Картка", driverId: 1 },
        { id: 2, from: "вул. Солом'янська, 7", to: "ТРЦ Ocean Plaza", date: "01.10.2026 12:40", distance: 6, price: 140, payment: "Готівка", driverId: 3 },
        { id: 3, from: "Вокзал", to: "вул. Лаврська, 15", date: "02.10.2026 19:05", distance: 9, price: 190, payment: "Картка", driverId: 4 },
        { id: 4, from: "пр. Перемоги, 50", to: "вул. Велика Васильківська, 100", date: "03.10.2026 22:30", distance: 11, price: 230, payment: "Готівка", driverId: 1 },
        { id: 5, from: "Майдан Незалежності", to: "Оболонь", date: "04.10.2026 17:20", distance: 13, price: 260, payment: "Картка", driverId: 3 }
    ]
};
