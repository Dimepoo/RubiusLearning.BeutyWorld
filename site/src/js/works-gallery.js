import 'slick-carousel/slick/slick'
import $ from 'jquery';
import '@fancyapps/ui'

export const initWorksGallery = () =>{
    console.log('gallery');

    $('.works-gallery__picture-list').slick({
        dots: true,
        infinite: true,
        speed: 300,
        slidesToShow: 4,
        slidesToScroll: 4,
        centerMode: true,
        variableWidth: true,
        prevArrow: $('.carousel-button--left'),
        nextArrow: $('.carousel-button--right'),
        responsive: [
            {
                breakpoint: 1024,
                settings: {
                    slidesToShow: 3,
                    slidesToScroll: 3
                }
            },
            {
                breakpoint: 900,
                settings: {
                    slidesToShow: 2,
                    slidesToScroll: 2
                }
            },
            {
                breakpoint: 600,
                settings: {
                    slidesToShow: 1,
                    slidesToScroll: 1
                }
            }
        ]
    });
};