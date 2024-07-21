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
    this.endpoint = " http://localhost:3000/poll";

    this.root.insertAdjacentHTML(
      "afterbegin",
      `
      <div class="poll__title">${title}</div>  
    `
    );

    this._refresh();
  }

  async _refresh() {
    const response = await fetch(this.endpoint);
    const { percentages } = await response.json();

    this.root
      .querySelectorAll(".poll__option")
      .forEach((option) => option.remove());

    for (const option of percentages) {
      const template = document.createElement("template");
      const fragment = template.content;

      template.innerHTML = `
        <div class="poll__option ${
          this.selected === option.label ? "poll__option--selected" : ""
        }">
          <div class="poll__option-info">
            <span class="poll__label">${option.label === "yes" ? "Sim" : "Não"}</span>
            <span class="poll__percentage">${option.percentage}%</span>
          </div>
          <div class="poll__option-fill"></div>
        </div>
      `;

      if (!this.selected) {
        fragment
          .querySelector(".poll__option")
          .addEventListener("click", () => {
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

      fragment.querySelector(
        ".poll__option-fill"
      ).style.width = `${option.percentage}%`;

      this.root.appendChild(fragment);
    }
  }
}

const p = new Poll(document.querySelector(".poll"), "Esse ano sobe?");
const y = new Year(document.querySelector(".year"));
