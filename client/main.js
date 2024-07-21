class Year {
  constructor(root) {
    this.root = root;
    this.lastAYear = 1985;
    this.currentYear = new Date().getFullYear();

    this.root.innerHTML = `${this.currentYear - this.lastAYear} ANOS`;
  }
}

class Poll {
  constructor(root, title) {
    this.root = root;
    this.selected = localStorage.getItem("vila-poll-vote");
    this.endpoint = "http://localhost:3000/poll";

    this.root.insertAdjacentHTML(
      "afterbegin",
      `<div class="poll__title">${title}</div>`
    );

    this._refresh();
  }

  async _refresh() {
    const response = await fetch(this.endpoint.trim());
    const { total, percentages } = await response.json();

    this.root
      .querySelectorAll(".poll__option")
      .forEach((option) => option.remove());

    percentages.forEach((option, index) => {
      const optionHTML = `
        <div class="poll__option ${
          this.selected === option.label ? "poll__option--selected" : ""
        }" id="poll__option-${index}">
          <div class="poll__option-info">
            <span class="poll__label">${
              option.label === "yes" ? "Sim" : "Não"
            }</span>
            <span class="poll__percentage">${option.percentage}%</span>
          </div>
          <div class="poll__option-fill" style="width: 0;"></div>
        </div>
      `;

      this.root.insertAdjacentHTML("beforeend", optionHTML);

      if (!this.selected) {
        this.root.lastElementChild.addEventListener("click", () => {
          fetch(this.endpoint, {
            method: "POST",
            body: `vote=${option.label}`,
            headers: {
              "Content-Type": "application/x-www-form-urlencoded",
            },
          }).then(() => {
            this.selected = option.label;
            localStorage.setItem("vila-poll-vote", option.label);
            this._refresh();
          });
        });
      }
    });

    percentages.forEach((option, index) => {
      setTimeout(() => {
        document.querySelector(
          `[id="poll__option-${index}"] .poll__option-fill`
        ).style.width = `${option.percentage}%`;
      }, 0);
    });

    const totalVotesP = document.createElement("p");
    totalVotesP.classList.add("poll__total-votes");
    totalVotesP.textContent = `${total} votos`;
    this.root.appendChild(totalVotesP);
  }
}

const p = new Poll(document.querySelector(".poll"), "Esse ano sobe?");
const y = new Year(document.querySelector(".year"));
