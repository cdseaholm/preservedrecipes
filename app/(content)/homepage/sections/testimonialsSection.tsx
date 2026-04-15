'use client'

import { FaHeart, FaUsers, FaClock } from "react-icons/fa";

export default function TestimonialsSection() {
    const benefits = [
        {
            icon: <FaHeart className="text-5xl text-accent" />,
            title: "Built for Families",
            description: "Designed specifically to help families preserve and share their most treasured recipes across generations."
        },
        {
            icon: <FaUsers className="text-5xl text-accent" />,
            title: "Easy Collaboration",
            description: "Everyone in your family can contribute, edit, and access recipes from anywhere, anytime."
        },
        {
            icon: <FaClock className="text-5xl text-accent" />,
            title: "Quick & Simple",
            description: "No complicated features or confusing menus. Just a clean, intuitive way to store what matters."
        }
    ];

    return (
        <div className="flex flex-col items-center justify-center w-full max-w-7xl mx-auto px-6 space-y-12">
            <div className="text-center space-y-4">
                <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-mainText">
                    Why Families Choose Preserved Recipes
                </h2>
                <p className="text-lg md:text-xl text-mainText/70">
                    The simple way to keep your culinary heritage alive
                </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 w-full">
                {benefits.map((benefit, index) => (
                    <div 
                        key={index}
                        className="flex flex-col items-center text-center space-y-4 p-8 bg-mainBack rounded-lg shadow-lg hover:shadow-xl transition-all duration-300 border border-accent/20"
                    >
                        <div className="p-4 bg-altBack rounded-full">
                            {benefit.icon}
                        </div>

                        <h3 className="text-xl md:text-2xl font-bold text-mainText">
                            {benefit.title}
                        </h3>

                        <p className="text-base md:text-lg text-mainText/70">
                            {benefit.description}
                        </p>
                    </div>
                ))}
            </div>
        </div>
    );
    // Leaving testimonials here for when I maybe get some
    // const testimonials = [
    //     {
    //         name: "Sarah Johnson",
    //         role: "Home Cook",
    //         content: "Finally, a place to store my grandmother's recipes! My whole family can access them now, and we're adding new ones every week.",
    //         rating: 5
    //     },
    //     {
    //         name: "Michael Chen",
    //         role: "Food Enthusiast",
    //         content: "I love how easy it is to organize my recipes. The family sharing feature means my kids will have all our traditions preserved.",
    //         rating: 5
    //     },
    //     {
    //         name: "Emily Rodriguez",
    //         role: "Professional Chef",
    //         content: "Simple, clean, and exactly what I needed. No complicated features, just a beautiful way to keep recipes safe.",
    //         rating: 5
    //     }
    // ];

    // return (
    //     <div className="flex flex-col items-center justify-center w-full max-w-7xl mx-auto px-6 space-y-12">
    //         <div className="text-center space-y-4">
    //             <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-mainText">
    //                 Loved by Families Everywhere
    //             </h2>
    //             <p className="text-lg md:text-xl text-mainText/70">
    //                 Join thousands preserving their culinary heritage
    //             </p>
    //         </div>

    //         <div className="grid grid-cols-1 md:grid-cols-3 gap-8 w-full">
    //             {testimonials.map((testimonial, index) => (
    //                 <div 
    //                     key={index}
    //                     className="flex flex-col space-y-4 p-8 bg-mainBack rounded-lg shadow-lg hover:shadow-xl transition-all duration-300 border border-accent/20"
    //                 >
    //                     <FaQuoteLeft className="text-3xl text-accent/40" />
                        
    //                     <div className="flex gap-1">
    //                         {[...Array(testimonial.rating)].map((_, i) => (
    //                             <FaStar key={i} className="text-yellow-500" />
    //                         ))}
    //                     </div>

    //                     <p className="text-base md:text-lg text-mainText/80 italic">
    //                         &quot;{testimonial.content}&quot;
    //                     </p>

    //                     <div className="pt-4 border-t border-accent/20">
    //                         <p className="font-bold text-mainText">{testimonial.name}</p>
    //                         <p className="text-sm text-mainText/60">{testimonial.role}</p>
    //                     </div>
    //                 </div>
    //             ))}
    //         </div>
    //     </div>
    // );
}