'use client'

import React, { useCallback, useEffect, useState } from 'react'
import useEmblaCarousel from 'embla-carousel-react'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import Image from 'next/image'

interface CarouselSlide {
    id: string
    image: string
    title?: string
    description?: string
    link?: string
}

interface CarouselProps {
    slides: CarouselSlide[]
    autoplay?: boolean
    autoplayDelay?: number
    showDots?: boolean
    showArrows?: boolean
    className?: string
}

export default function Carousel({
    slides,
    autoplay = false,
    autoplayDelay = 3000,
    showDots = true,
    showArrows = true,
    className = '',
}: CarouselProps) {
    const [emblaRef, emblaApi] = useEmblaCarousel({ loop: true, skipSnaps: false })
    const [selectedIndex, setSelectedIndex] = useState(0)
    const [scrollSnaps, setScrollSnaps] = useState<number[]>([])

    const scrollPrev = useCallback(() => {
        if (emblaApi) emblaApi.scrollPrev()
    }, [emblaApi])

    const scrollNext = useCallback(() => {
        if (emblaApi) emblaApi.scrollNext()
    }, [emblaApi])

    const scrollTo = useCallback(
        (index: number) => {
            if (emblaApi) emblaApi.scrollTo(index)
        },
        [emblaApi]
    )

    const onSelect = useCallback(() => {
        if (!emblaApi) return
        setSelectedIndex(emblaApi.selectedScrollSnap())
    }, [emblaApi])

    useEffect(() => {
        if (!emblaApi) return

        onSelect()
        setScrollSnaps(emblaApi.scrollSnapList())
        emblaApi.on('select', onSelect)
        emblaApi.on('reInit', onSelect)

        return () => {
            emblaApi.off('select', onSelect)
            emblaApi.off('reInit', onSelect)
        }
    }, [emblaApi, onSelect])

    // Autoplay functionality
    useEffect(() => {
        if (!autoplay || !emblaApi) return

        const interval = setInterval(() => {
            emblaApi.scrollNext()
        }, autoplayDelay)

        return () => clearInterval(interval)
    }, [autoplay, autoplayDelay, emblaApi])

    return (
        <div className={`relative ${className}`}>
            {/* Carousel Container */}
            <div className="overflow-hidden rounded-2xl" ref={emblaRef}>
                <div className="flex">
                    {slides.map((slide) => (
                        <div key={slide.id} className="relative flex-[0_0_100%] min-w-0">
                            <div className="relative aspect-[16/9] md:aspect-[21/9] w-full">
                                <Image
                                    src={slide.image}
                                    alt={slide.title || 'Carousel slide'}
                                    fill
                                    className="object-cover"
                                    priority={selectedIndex === 0}
                                    sizes="100vw"
                                />

                                {/* Overlay Content */}
                                {(slide.title || slide.description) && (
                                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent flex items-end">
                                        <div className="p-6 md:p-12 text-white max-w-2xl">
                                            {slide.title && (
                                                <h2 className="text-3xl md:text-5xl font-display font-bold mb-3 drop-shadow-lg">
                                                    {slide.title}
                                                </h2>
                                            )}
                                            {slide.description && (
                                                <p className="text-lg md:text-xl mb-4 drop-shadow-md">
                                                    {slide.description}
                                                </p>
                                            )}
                                            {slide.link && (
                                                <a
                                                    href={slide.link}
                                                    className="inline-block px-6 py-3 bg-primary-600 hover:bg-primary-700 text-white font-semibold rounded-lg transition-colors shadow-lg"
                                                >
                                                    Ver más
                                                </a>
                                            )}
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* Navigation Arrows */}
            {showArrows && slides.length > 1 && (
                <>
                    <button
                        onClick={scrollPrev}
                        className="absolute left-4 top-1/2 -translate-y-1/2 w-12 h-12 rounded-full bg-white/90 hover:bg-white shadow-lg flex items-center justify-center transition-all hover:scale-110 z-10"
                        aria-label="Previous slide"
                    >
                        <ChevronLeft className="w-6 h-6 text-secondary-900" />
                    </button>
                    <button
                        onClick={scrollNext}
                        className="absolute right-4 top-1/2 -translate-y-1/2 w-12 h-12 rounded-full bg-white/90 hover:bg-white shadow-lg flex items-center justify-center transition-all hover:scale-110 z-10"
                        aria-label="Next slide"
                    >
                        <ChevronRight className="w-6 h-6 text-secondary-900" />
                    </button>
                </>
            )}

            {/* Dots Navigation */}
            {showDots && slides.length > 1 && (
                <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex gap-2 z-10">
                    {scrollSnaps.map((_, index) => (
                        <button
                            key={index}
                            onClick={() => scrollTo(index)}
                            className={`transition-all ${index === selectedIndex
                                    ? 'w-8 h-3 bg-white'
                                    : 'w-3 h-3 bg-white/50 hover:bg-white/75'
                                } rounded-full`}
                            aria-label={`Go to slide ${index + 1}`}
                        />
                    ))}
                </div>
            )}
        </div>
    )
}
