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
    // this.endpoint = "http://localhost:3000/poll";
    this.endpoint = "https://vila-na-a-server.onrender.com/poll";

    this.root.insertAdjacentHTML(
      "afterbegin",
      `<div class="poll__title">${title}</div>`
    );

    this._refresh();
  }

  async _refresh() {
    const response = await fetch(this.endpoint);
    const rows = await response.json();

    if (rows.length > 0) {
      const { total, yes_percentage, no_percentage } = rows[0];

      this.root.querySelectorAll(".poll__option").forEach((option) => option.remove());

      const options = [
        { label: "yes", percentage: yes_percentage },
        { label: "no", percentage: no_percentage }
      ];

      options.forEach((option, index) => {
        const optionHTML = `
          <div class="poll__option ${this.selected === option.label ? "poll__option--selected" : ""}" id="poll__option-${index}">
            <div class="poll__option-info">
              <span class="poll__label">${option.label === "yes" ? "Sim" : "Não"}</span>
              <span class="poll__percentage">${option.percentage}%</span>
            </div>
            <div class="poll__option-fill"></div>
          </div>
        `;

        this.root.insertAdjacentHTML("beforeend", optionHTML);

        if (!this.selected) {
          this.root.lastElementChild.addEventListener("click", () => {
            fetch(this.endpoint, {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
              },
              body: JSON.stringify({ vote: option.label }),
            }).then(() => {
              this.selected = option.label;
              localStorage.setItem("vila-poll-vote", option.label);
              this._refresh();
            });
          });

          const percentages = document.querySelectorAll(".poll__percentage");
          // percentages[0].style.visibility = "hidden";
          percentages.forEach((percentage) => percentage.style.visibility = "hidden");
        }
      });

      options.forEach((option, index) => {
        setTimeout(() => {
          const optionFill = document.querySelector(`[id="poll__option-${index}"] .poll__option-fill`);
          optionFill.style.width = `${option.percentage}%`;
          if (this.selected) {
            optionFill.style.visibility = "visible";
          }
        }, 0);
      });

      const totalVotesP = document.createElement("p");
      totalVotesP.classList.add("poll__total-votes");
      totalVotesP.textContent = `${total} votos`;
      this.root.appendChild(totalVotesP);
    }
  }
}

const p = new Poll(document.querySelector(".poll"), "Esse ano sobe?");
const y = new Year(document.querySelector(".year"));
