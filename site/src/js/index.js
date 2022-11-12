import $ from 'jquery';

import { initHamburger } from "./hamburger";
import { initAppointmentForm } from "./appointment-form";
import { initServices } from "./service";
import { initWorksGallery } from "./works-gallery";

$(window).on('load', function() {
    initHamburger();
    initAppointmentForm();
    initServices();
    initWorksGallery();
})