import React from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Psychotherapists } from "@/constants";
import { Avatar, AvatarImage } from "@/components/ui/avatar";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";

const StartPreAssessmentCard = () => {
  // Number of Psychotherapists to display
  const groupedPsychotherapists = [];
  for (let i = 0; i < Psychotherapists.length; i += 2) {
    groupedPsychotherapists.push(Psychotherapists.slice(i, i + 2));
  }

  return (
    <div className="rounded-2xl bg-light-200 p-6 md:p-8 lg:p-12">
      {/* Button for pre-assessment */}
      <div className="text-left mb-6 md:mb-8 lg:mb-12">
        <Button className="bg-blue-300 hover:bg-blue-310 text-white font-bold py-2 px-6 rounded-lg">
          <Link href="/client/pre-assessment">Start Pre-Assessment</Link>
        </Button>
      </div>

      {/* Description text */}
      <span className="text-md font-medium mb-6 block text-left text-dark-500 md:text-lg lg:text-xl">
        Meet our caring psychotherapists, here to guide your healing!
      </span>

      {/* Carousel for psychotherapists cards */}
      <div className="relative w-full max-w-[600px] mx-auto md:max-w-[800px] lg:max-w-[1000px]">
        <Carousel>
          <CarouselContent>
            {groupedPsychotherapists.map((group, index) => (
              <CarouselItem
                key={index}
                className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-4"
              >
                {group.map((psychotherapist) => (
                  <div
                    key={psychotherapist.name}
                    className="border border-blue-300 rounded-lg p-4 w-full flex items-center"
                  >
                    <Avatar className="mr-4">
                      <AvatarImage
                        src={psychotherapist.image}
                        alt={psychotherapist.name}
                        width={100}
                        height={100}
                        className="rounded-full"
                      />
                    </Avatar>

                    <div className="flex flex-col items-start">
                      <h3 className="font-semibold text-lg md:text-xl lg:text-2xl">
                        {psychotherapist.name}
                      </h3>
                      <p className="text-sm text-gray-600 md:text-base lg:text-lg">
                        Psychotherapist
                      </p>
                      <div className="flex items-center mt-2">
                        <span className="text-blue-310 text-lg">★</span>
                        <span className="ml-1 text-gray-500">5.0</span>
                      </div>
                    </div>
                  </div>
                ))}
              </CarouselItem>
            ))}
          </CarouselContent>

          {/* Carousel controls */}
          <CarouselPrevious className="carousel-controls absolute left-[-40px] top-1/2 transform -translate-y-1/2 bg-blue-300 text-white hover:bg-blue-310 hover:text-white p-2 rounded-full border-none outline-none focus:outline-none">
            Prev
          </CarouselPrevious>
          <CarouselNext className="carousel-controls absolute right-[-40px] top-1/2 transform -translate-y-1/2 bg-blue-300 text-white hover:bg-blue-310 hover:text-white p- 2 rounded-full border-none outline-none focus:outline-none">
            Next
          </CarouselNext>
        </Carousel>
      </div>
    </div>
  );
};

export default StartPreAssessmentCard;
