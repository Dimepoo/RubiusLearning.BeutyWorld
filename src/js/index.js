import $ from 'jquery';

import { initHamburger } from "./hamburger";
import { initQuickRecordForm } from "./quick-record-form";
import { initServices } from "./service";
import { initWorksGallery } from "./works-gallery";

$(window).on('load', function() {
    initHamburger();
    initQuickRecordForm();
    initServices();
    initWorksGallery();
})