import React from "react";

const coffeeMenu = [
    {
        id: 1,
        name: "Espresso",
        description: "Strong and bold single shot of coffee.",
        price: "$3.00",
        image: "https://images.unsplash.com/photo-1509042239860-f550ce710b93?w=400",
    },
    {
        id: 2,
        name: "Cappuccino",
        description: "Espresso with steamed milk and frothy foam.",
        price: "$4.50",
        image: "https://images.unsplash.com/photo-1509042239860-f550ce710b93?w=400",
    },
    {
        id: 3,
        name: "Latte",
        description: "Smooth blend of espresso and steamed milk.",
        price: "$4.00",
        image: "https://images.unsplash.com/photo-1509042239860-f550ce710b93?w=400",
    },
    {
        id: 4,
        name: "Mocha",
        description: "Espresso with chocolate, milk, and whipped cream.",
        price: "$5.00",
        image: "https://images.unsplash.com/photo-1509042239860-f550ce710b93?w=400",
    },
];

const MenuPage = () => {
    return (
        <div className="p-6 w-[70%]">
            <h1 className="text-3xl font-bold text-gray-800 mb-6">Coffee Menu</h1>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {coffeeMenu.map((item) => (
                    <div
                        key={item.id}
                        className="bg-white rounded-2xl shadow-md overflow-hidden hover:shadow-lg transition"
                    >
                        <img
                            src={item.image}
                            alt={item.name}
                            className="w-full h-40 object-cover"
                        />
                        <div className="p-4">
                            <h2 className="text-xl font-semibold text-gray-800">
                                {item.name}
                            </h2>
                            <p className="text-gray-600 text-sm mb-2">{item.description}</p>
                            <div className="flex justify-between items-center">
                                <span className="text-lg font-bold text-yellow-700">
                                    {item.price}
                                </span>
                                <button className="bg-yellow-600 hover:bg-yellow-700 text-white px-3 py-1 rounded-lg transition">
                                    Add
                                </button>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default MenuPage;
