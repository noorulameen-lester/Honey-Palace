"use client";

import React from "react";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel"; // path to your carousel component

interface TestimonialsCarouselProps {
  compact?: boolean;
}

export const TestimonialsCarousel: React.FC<TestimonialsCarouselProps> = ({
  compact = false,
}) => {
  const testimonials = [
    {
      name: "Michael Green",
      text: "Outstanding quality and flavor! The Manuka honey has helped with my seasonal allergies.",
      rating: 5,
    },
    {
      name: "Sarah Lewis",
      text: "Absolutely pure honey! I use it in my tea and for baking, amazing taste every time.",
      rating: 5,
    },
    {
      name: "David Kim",
      text: "Best honey I’ve had in years! Will definitely order again.",
      rating: 4,
    },
  ];

  return (
    <Carousel className={compact ? "max-w-xl mx-auto" : "max-w-4xl mx-auto"}>
      <CarouselContent>
        {testimonials.map((t, i) => (
          <CarouselItem key={i}>
            <div className="bg-white dark:bg-[#1e1e24] rounded-lg shadow-md p-6 text-center">
              <p className="text-gray-700 dark:text-gray-300 mb-4">“{t.text}”</p>
              <div className="text-amber-500 mb-2">
                {"★".repeat(t.rating)}
                {"☆".repeat(5 - t.rating)}
              </div>
              <p className="font-semibold">{t.name}</p>
            </div>
          </CarouselItem>
        ))}
      </CarouselContent>
      <CarouselPrevious />
      <CarouselNext />
    </Carousel>
  );
};
