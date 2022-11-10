class TabItem {
    constructor(link, content) {
        this.link = link;
        this.content = content;
    }

    onClick(callback) {
        this.link.addEventListener('click', () => callback());
    }

    activate() {
        this._toggle(true);
    }

    deactivate() {
        this._toggle(false);
    }

    _toggle(activate) {
        this.link.classList.toggle('active', activate);
        this.content.classList.toggle('active', activate);
    }
}

class TabsManager {
    constructor(tabsElem) {
        this.tabs = [];
        this.activeTab = null;

        this.init(tabsElem);
        this.activateTab(this.tabs[0]);
    }

    init(tabsElem) {
        const menuButtons = tabsElem.querySelectorAll('.service-and-price__menu-button');
        const contents = tabsElem.querySelectorAll('.service-and-price__tab');

        for (let i = 0; i < menuButtons.length; i++) {
            if (!contents[i]) {
                continue;
            }

            const tab = new TabItem(menuButtons[i], contents[i]);
            this.tabs.push(tab);

            tab.onClick(() => this.activateTab(tab));
        }
    }

    activateTab(tab) {
        if (this.activeTab) {
            this.activeTab.deactivate();
        }

        this.activeTab = tab;
        this.activeTab.activate();
    }
}

window.onload = function() {
    console.log('service-and-price');

    const tabsElem = document.querySelector('.service-and-price');
    new TabsManager(tabsElem);
};