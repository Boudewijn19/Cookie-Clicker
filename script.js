// === Upgrade Class ===
class Upgrade {
    constructor(name, basePrice, effectType, effectValue) {
        this.name = name;
        this.price = basePrice;
        this.effectType = effectType; // "cps", "multiplier", "superClick", "goldenClick"
        this.effectValue = effectValue;
        this.amount = 0;
    }

    buy(game) {
        if (game.cookies >= this.price) {
            game.cookies -= this.price;
            this.amount++;

            if (this.effectType === "cps") {
                game.cps += this.effectValue;
            } else if (this.effectType === "multiplier") {
                game.cookiesPerClick *= this.effectValue;
            } else if (this.effectType === "superClick") {
                game.activateSuperKlick(this.effectValue);
            } else if (this.effectType === "goldenClick") {
                game.activateGoldenKlick();
            }

            // Verhoog prijs na aankoop
            this.price = Math.floor(this.price * 1.5);
            game.updateUI();
        }
    }
}

// === Game Class ===
class Game {
    constructor() {
        this.cookies = 0;
        this.cookiesPerClick = 1;
        this.cps = 0; // Cookies per Second

        // DOM elementen
        this.scoreDisplay = document.getElementById("score");
        this.cpsDisplay = document.getElementById("cps");
        this.cookie = document.getElementById("cookie");
        this.buyCursor = document.getElementById("buyCursor");
        this.buyMultiplier = document.getElementById("buyMultiplier");
        this.superKlickBtn = document.getElementById("superKlick");
        this.goldenKlickBtn = document.getElementById("goldenKlick");

        // Nieuwe upgrade knoppen
        this.buyGrandma = document.getElementById("buyGrandma");
        this.buyFarm = document.getElementById("buyFarm");
        this.buyFactory = document.getElementById("buyFactory");
        this.buyMine = document.getElementById("buyMine");
        this.buyBank = document.getElementById("buyBank");
        this.buyTemple = document.getElementById("buyTemple");
        this.buyWizardTower = document.getElementById("buyWizardTower");

        // Upgrades
        this.cursorUpgrade = new Upgrade("Cursor", 10, "cps", 1);
        this.multiplierUpgrade = new Upgrade("Multiplier", 50, "multiplier", 2);
        this.superKlickUpgrade = new Upgrade("Super Click", 20, "superClick", 10); // 10x per klik
        this.goldenKlickUpgrade = new Upgrade("Golden Click", 30, "goldenClick", 500); // bonus elke 50e klik

        // Nieuwe upgrades
        this.grandmaUpgrade = new Upgrade("Grandma", 100, "cps", 5);
        this.farmUpgrade = new Upgrade("Farm", 500, "cps", 20);
        this.factoryUpgrade = new Upgrade("Factory", 3000, "cps", 100);
        this.mineUpgrade = new Upgrade("Mine", 10000, "cps", 500);
        this.bankUpgrade = new Upgrade("Bank", 50000, "cps", 2000);
        this.templeUpgrade = new Upgrade("Temple", 200000, "cps", 10000);
        this.wizardTowerUpgrade = new Upgrade("Wizard Tower", 1000000, "cps", 50000);

        // Golden Click status
        this.goldenActive = false;
        this.clickCounter = 0;

        // Event listeners
        this.cookie.addEventListener("click", () => this.clickCookie());
        this.buyCursor.addEventListener("click", () => this.cursorUpgrade.buy(this));
        this.buyMultiplier.addEventListener("click", () => this.multiplierUpgrade.buy(this));
        this.superKlickBtn.addEventListener("click", () => this.superKlickUpgrade.buy(this));
        this.goldenKlickBtn.addEventListener("click", () => this.goldenKlickUpgrade.buy(this));

        // Nieuwe event listeners
        this.buyGrandma.addEventListener("click", () => this.grandmaUpgrade.buy(this));
        this.buyFarm.addEventListener("click", () => this.farmUpgrade.buy(this));
        this.buyFactory.addEventListener("click", () => this.factoryUpgrade.buy(this));
        this.buyMine.addEventListener("click", () => this.mineUpgrade.buy(this));
        this.buyBank.addEventListener("click", () => this.bankUpgrade.buy(this));
        this.buyTemple.addEventListener("click", () => this.templeUpgrade.buy(this));
        this.buyWizardTower.addEventListener("click", () => this.wizardTowerUpgrade.buy(this));

        // Interval voor auto-click
        setInterval(() => {
            this.cookies += this.cps;
            this.updateUI();
        }, 1000);

        this.updateUI();
    }

    clickCookie() {
        this.clickCounter++;
        let addedCookies = this.cookiesPerClick;

        // Golden Click: elke 50e klik geeft bonus
        if (this.goldenActive && this.clickCounter % 50 === 0) {
            addedCookies += 500;
        }

        this.cookies += addedCookies;
        this.updateUI();
    }

    // Super Click: tijdelijke 10x per klik
    activateSuperKlick(multiplier) {
        this.cookiesPerClick *= multiplier;
        this.updateUI();
        setTimeout(() => {
            this.cookiesPerClick /= multiplier;
            this.updateUI();
        }, 10000); // 10 seconden
    }

    // Golden Click: bonus elke 50e klik, 1 minuut actief
    activateGoldenKlick() {
        this.goldenActive = true;
        this.updateUI();
        setTimeout(() => {
            this.goldenActive = false;
            this.updateUI();
        }, 60000); // 1 minuut
    }

    updateUI() {
        this.scoreDisplay.textContent = Math.floor(this.cookies);
        this.cpsDisplay.textContent = this.cps;

        this.buyCursor.textContent = `Koop Cursor (+1 cps) - ${this.cursorUpgrade.price} cookies`;
        this.buyMultiplier.textContent = `Koop Multiplier (x2 per klik) - ${this.multiplierUpgrade.price} cookies`;
        this.superKlickBtn.textContent = `Super Click (10x per klik) - ${this.superKlickUpgrade.price} cookies`;
        this.goldenKlickBtn.textContent = `Golden Click - ${this.goldenKlickUpgrade.price} cookies`;

        // Nieuwe upgrade knoppen
        this.buyGrandma.textContent = `Koop Grandma 👵 (+5 cps) - ${this.grandmaUpgrade.price} cookies`;
        this.buyFarm.textContent = `Koop Farm 🌾 (+20 cps) - ${this.farmUpgrade.price} cookies`;
        this.buyFactory.textContent = `Koop Factory 🏭 (+100 cps) - ${this.factoryUpgrade.price} cookies`;
        this.buyMine.textContent = `Koop Mine ⛏️ (+500 cps) - ${this.mineUpgrade.price} cookies`;
        this.buyBank.textContent = `Koop Bank 🏦 (+2000 cps) - ${this.bankUpgrade.price} cookies`;
        this.buyTemple.textContent = `Koop Temple 🛕 (+10000 cps) - ${this.templeUpgrade.price} cookies`;
        this.buyWizardTower.textContent = `Koop Wizard Tower 🧙 (+50000 cps) - ${this.wizardTowerUpgrade.price} cookies`;
    }
}

// === Start spel ===
const game = new Game();
