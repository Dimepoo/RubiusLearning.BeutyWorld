const body = document.querySelector('body');

window.onload = () => { 

    const hamburgerBtn = document.querySelector('.hamburger-navigation__toggle').querySelector("input");
    const mobileMenu = document.querySelector('.hamburger-navigation__menu');
    const navLinks = document.querySelectorAll('.navigation__link');

    hamburgerBtn.addEventListener('change', (event) => { 

        if(event.target.checked)
        {
            mobileMenu.classList.add('visible');
            disableScroll();
        }
        else
        {
            mobileMenu.classList.remove('visible'); 
            enableScroll();
        } 
    }); 

    navLinks.forEach((link) => {

        link.addEventListener('click', (event) => {
            event.preventDefault();

            mobileMenu.classList.remove('visible');
            enableScroll();

            hamburgerBtn.checked = false;

            const elementToScroll = document.querySelector(event.currentTarget.getAttribute('href'));
            elementToScroll.scrollIntoView({ behavior: 'smooth', block: 'start'});
        })
    });
    
  };

  const disableScroll = () => body.classList.add('noscroll');

  const enableScroll = () =>  body.classList.remove('noscroll');

 