window.onload = () => {
    // Array.from(document.querySelectorAll('.percentage')).forEach((bar) => {
    //     bar
    // });
};
class Skill extends HTMLElement {
    constructor() {
        super();
        this.percentage = '';
        const name = this.attributes.getNamedItem('name').value;
        this.percentage = this.attributes.getNamedItem('level').value;
        this.innerHTML = `<h5>${name}</h5><div class="progress-bar"><div class="percentage" data-percentage="${this.percentage}" style="width: 0;"><span>${this.percentage}%</span></div></div>`;
    }
    connectedCallback() {
        setTimeout(() => {
            this.children[1].firstChild.style.width =
                this.percentage + '%';
        }, 500);
    }
}
window.customElements.define('skill-set', Skill);
