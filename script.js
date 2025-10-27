// Upgrade Class 
class Upgrade {
    constructor(name, basePrice, effectType, effectValue, imageSrc) {
        this.name = name;
        this.price = basePrice;
        this.effectType = effectType; // "cps", "multiplier", "superClick", "goldenClick"
        this.effectValue = effectValue;
        this.amount = 0;
        this.imageSrc = imageSrc || this.getDefaultImage(name);
    }

    getDefaultImage(name) {
        const imageMap = {
            "Grandma": "👵",
            "Farm": "🌾",
            "Factory": "🏭",
            "Mine": "⛏️",
            "Bank": "🏦",
            "Temple": "🛕",
            "Wizard Tower": "🧙"
        };
        return imageMap[name] || "🏢";
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

            // Price increases after purchase
            this.price = Math.floor(this.price * 1.5);
            game.updateUI();     

            // Shows building visual
            if (this.effectType === "cps" && this.name !== "Cursor") {
                game.showBuildingVisual(this.name.toLowerCase(), this.amount);
            }

            // Update building display
            if (this.name === "Grandma") {
                game.updateBuildingDisplay("grandma", this.amount);
            } else if (this.name === "Farm") {
                game.updateBuildingDisplay("farm", this.amount);
            } else if (this.name === "Factory") {
                game.updateBuildingDisplay("factory", this.amount);
            } else if (this.name === "Mine") {
                game.updateBuildingDisplay("mine", this.amount);
            } else if (this.name === "Bank") {
                game.updateBuildingDisplay("bank", this.amount);
            } else if (this.name === "Temple") {
                game.updateBuildingDisplay("temple", this.amount);
            } else if (this.name === "Wizard Tower") {
                game.updateBuildingDisplay("wizard", this.amount);
            }
        }
    }
}

// Game Class 
class Game {
    constructor() {
        this.cookies = 0;
        this.cookiesPerClick = 1;
        this.cps = 0;
        this.previousCookies = 0;

        // Milestones system
        this.milestones = [1,100, 1000, 10000, 50000, 100000, 1000000, 10000000, 100000000, 1000000000, 10000000000, 100000000000];
        this.reachedMilestones = new Set();

        // Extra counters
        this.clickCounter = 0;
        this.goldenActive = false;

        // DOM elements
        this.scoreDisplay = document.getElementById("score");
        this.cpsDisplay = document.getElementById("cps");
        this.cookie = document.getElementById("cookie");
        this.buildingVisuals = document.getElementById("buildingVisuals");

        // Upgrade buttons
        this.buyCursor = document.getElementById("buyCursor");
        this.buyMultiplier = document.getElementById("buyMultiplier");
        this.superKlickBtn = document.getElementById("superKlick");
        this.goldenKlickBtn = document.getElementById("goldenKlick");

        // Building buttons
        this.buyGrandma = document.getElementById("buyGrandma");
        this.buyFarm = document.getElementById("buyFarm");
        this.buyFactory = document.getElementById("buyFactory");
        this.buyMine = document.getElementById("buyMine");
        this.buyBank = document.getElementById("buyBank");
        this.buyTemple = document.getElementById("buyTemple");
        this.buyWizardTower = document.getElementById("buyWizardTower");

        // Shop buttons
        this.buyCursorShop = document.getElementById("buyCursorShop");
        this.buyMultiplierShop = document.getElementById("buyMultiplierShop");
        this.superKlickShop = document.getElementById("superKlickShop");
        this.goldenKlickShop = document.getElementById("goldenKlickShop");
        this.buyGrandmaShop = document.getElementById("buyGrandmaShop");
        this.buyFarmShop = document.getElementById("buyFarmShop");
        this.buyFactoryShop = document.getElementById("buyFactoryShop");
        this.buyMineShop = document.getElementById("buyMineShop");
        this.buyBankShop = document.getElementById("buyBankShop");
        this.buyTempleShop = document.getElementById("buyTempleShop");
        this.buyWizardTowerShop = document.getElementById("buyWizardTowerShop");

        // Building display elements
        this.grandmaCount = document.getElementById("grandma-count");
        this.farmCount = document.getElementById("farm-count");
        this.factoryCount = document.getElementById("factory-count");
        this.mineCount = document.getElementById("mine-count");
        this.bankCount = document.getElementById("bank-count");
        this.templeCount = document.getElementById("temple-count");
        this.wizardCount = document.getElementById("wizard-count");

        this.grandmaRow = document.getElementById("grandma-row");
        this.farmRow = document.getElementById("farm-row");
        this.factoryRow = document.getElementById("factory-row");
        this.mineRow = document.getElementById("mine-row");
        this.bankRow = document.getElementById("bank-row");
        this.templeRow = document.getElementById("temple-row");
        this.wizardRow = document.getElementById("wizard-row");

        // Upgrades
        this.cursorUpgrade = new Upgrade("Cursor", 10, "cps", 1);
        this.multiplierUpgrade = new Upgrade("Multiplier", 50, "multiplier", 2);
        this.superKlickUpgrade = new Upgrade("Super Click", 20, "superClick", 10);
        this.goldenKlickUpgrade = new Upgrade("Golden Click", 30, "goldenClick", 500);

        // Buildings
        this.grandmaUpgrade = new Upgrade("Grandma", 100, "cps", 5);
        this.farmUpgrade = new Upgrade("Farm", 500, "cps", 20);
        this.factoryUpgrade = new Upgrade("Factory", 3000, "cps", 100);
        this.mineUpgrade = new Upgrade("Mine", 10000, "cps", 500);
        this.bankUpgrade = new Upgrade("Bank", 50000, "cps", 2000);
        this.templeUpgrade = new Upgrade("Temple", 200000, "cps", 10000);
        this.wizardTowerUpgrade = new Upgrade("Wizard Tower", 1000000, "cps", 50000);

        // Event listeners
        this.cookie.addEventListener("click", () => this.clickCookie());

        // Upgrade event listeners
        this.buyCursor.addEventListener("click", () => this.cursorUpgrade.buy(this));
        this.buyMultiplier.addEventListener("click", () => this.multiplierUpgrade.buy(this));
        this.superKlickBtn.addEventListener("click", () => this.superKlickUpgrade.buy(this));
        this.goldenKlickBtn.addEventListener("click", () => this.goldenKlickUpgrade.buy(this));

        // Building event listeners
        this.buyGrandma.addEventListener("click", () => this.grandmaUpgrade.buy(this));
        this.buyFarm.addEventListener("click", () => this.farmUpgrade.buy(this));
        this.buyFactory.addEventListener("click", () => this.factoryUpgrade.buy(this));
        this.buyMine.addEventListener("click", () => this.mineUpgrade.buy(this));
        this.buyBank.addEventListener("click", () => this.bankUpgrade.buy(this));
        this.buyTemple.addEventListener("click", () => this.templeUpgrade.buy(this));
        this.buyWizardTower.addEventListener("click", () => this.wizardTowerUpgrade.buy(this));

        // Shop event listeners
        this.buyCursorShop.addEventListener("click", () => this.cursorUpgrade.buy(this));
        this.buyMultiplierShop.addEventListener("click", () => this.multiplierUpgrade.buy(this));
        this.superKlickShop.addEventListener("click", () => this.superKlickUpgrade.buy(this));
        this.goldenKlickShop.addEventListener("click", () => this.goldenKlickUpgrade.buy(this));
        this.buyGrandmaShop.addEventListener("click", () => this.grandmaUpgrade.buy(this));
        this.buyFarmShop.addEventListener("click", () => this.farmUpgrade.buy(this));
        this.buyFactoryShop.addEventListener("click", () => this.factoryUpgrade.buy(this));
        this.buyMineShop.addEventListener("click", () => this.mineUpgrade.buy(this));
        this.buyBankShop.addEventListener("click", () => this.bankUpgrade.buy(this));
        this.buyTempleShop.addEventListener("click", () => this.templeUpgrade.buy(this));
        this.buyWizardTowerShop.addEventListener("click", () => this.wizardTowerUpgrade.buy(this));

        // Interval voor auto-click
        setInterval(() => {
            this.cookies += this.cps;
            this.updateUI();
        }, 1000);

        this.updateUI();
    }

    // This updates the stats 
    updateStats() {
        document.getElementById("statCookies").textContent = Math.floor(this.cookies);
        document.getElementById("statCps").textContent = this.cps;
        document.getElementById("statCursors").textContent = this.cursorUpgrade.amount;
        document.getElementById("statGrandmas").textContent = this.grandmaUpgrade.amount;
        document.getElementById("statFarm").textContent = this.farmUpgrade.amount;
        document.getElementById("statFactory").textContent = this.factoryUpgrade.amount;
        document.getElementById("statMine").textContent = this.mineUpgrade.amount;
        document.getElementById("statBank").textContent = this.bankUpgrade.amount;
        document.getElementById("statTemple").textContent = this.templeUpgrade.amount;
        document.getElementById("statWizard").textContent = this.wizardTowerUpgrade.amount;
    }

    clickCookie() {
        this.previousCookies = this.cookies;

        this.clickCounter++;
        let addedCookies = this.cookiesPerClick;

        if (this.goldenActive && this.clickCounter % 50 === 0) {
            addedCookies += 500;
        }

        this.cookies += addedCookies;
        this.updateUI();

        // ✅ Milestone-checks
        for (const milestone of this.milestones) {
            if (
                this.previousCookies < milestone &&
                this.cookies >= milestone &&
                !this.reachedMilestones.has(milestone)
            ) {
                this.reachedMilestones.add(milestone);
                this.showMilestonePopup(milestone);
            }
        }
    }
    showMilestonePopup(milestone) {
        const existingPopup = document.getElementById("milestonePopup");
        if (existingPopup) existingPopup.remove();

        // Store milestone in LocalStorage
        let achievedTrophies = JSON.parse(localStorage.getItem("achievedTrophies")) || [];
        const trophyKey = `trophy-${milestone}`;
        if (!achievedTrophies.includes(trophyKey)) {
            achievedTrophies.push(trophyKey);
            localStorage.setItem("achievedTrophies", JSON.stringify(achievedTrophies));
        }

        // creates popup container
        const popup = document.createElement("div");
        popup.id = "milestonePopup";
        popup.style.position = "fixed";
        popup.style.top = "20%";
        popup.style.left = "50%";
        popup.style.transform = "translate(-50%, -50%)";
        popup.style.backgroundColor = "#fff8dc";
        popup.style.border = "3px solid #c97b5c";
        popup.style.borderRadius = "30px";
        popup.style.padding = "30px";
        popup.style.width = "400px"
        popup.style.boxShadow = "0 0 15px rgba(0,0,0,0.5)";
        popup.style.zIndex = "1000";
        popup.style.textAlign = "center";
        popup.style.fontFamily = "Arial, sans-serif";

        // content popup
        popup.innerHTML = `
        <h2 style="color:#c97b5c;">🎉 Gefeliciteerd!</h2>
        <p>Je hebt ${milestone.toLocaleString()} cookies bereikt!</p>
        <button id="closeMilestonePopup" style="
            margin-top: 15px; 
            padding: 8px 16px; 
            background-color: #c97b5c; 
            color: white; 
            border: none; 
            border-radius: 5px; 
            cursor: pointer;">Sluit</button>
    `;

        document.body.appendChild(popup);

        document.getElementById("closeMilestonePopup").addEventListener("click", () => {
            popup.remove();
        });

        setTimeout(() => {
            popup.remove();
        }, 5000);
    }




    // Super Click: temporary 10x per click
    activateSuperKlick(multiplier) {
        this.cookiesPerClick *= multiplier;
        this.updateUI();
        setTimeout(() => {
            this.cookiesPerClick /= multiplier;
            this.updateUI();
        }, 10000); // 10 seconds
    }

    // Golden Click: bonus every 50 clicks, 1 minute active
    activateGoldenKlick() {
        this.goldenActive = true;
        this.updateUI();
        setTimeout(() => {
            this.goldenActive = false;
            this.updateUI();
        }, 60000); // 1 minuut
    }

    // Show building visual
    showBuildingVisual(buildingType, amount) {
        // Remove existing building of this type
        const existingBuilding = document.querySelector(`.building-image.${buildingType}`);
        if (existingBuilding) {
            existingBuilding.remove();
        }

        // Create new building visual
        const buildingImg = document.createElement('div');
        buildingImg.className = `building-image ${buildingType}`;

        // Use emoji as image
        buildingImg.innerHTML = this.getBuildingEmoji(buildingType);
        buildingImg.style.fontSize = '40px';

        // Positioning based on building type
        buildingImg.style.bottom = `${Math.min(amount * 5, 100)}px`;

        this.buildingVisuals.appendChild(buildingImg);

        // Animate the appearance
        setTimeout(() => {
            buildingImg.classList.add('show');
        }, 10);
    }

    getBuildingEmoji(buildingType) {
        const emojiMap = {
            "grandma": "👵",
            "farm": "🌾",
            "factory": "🏭",
            "mine": "⛏️",
            "bank": "🏦",
            "temple": "🛕",
            "wizard": "🧙"
        };
        return emojiMap[buildingType] || "🏢";
    }

    // Update building display
    updateBuildingDisplay(buildingType, amount) {
        const countElement = document.getElementById(`${buildingType}-count`);
        const rowElement = document.getElementById(`${buildingType}-row`);

        if (countElement) {
            countElement.textContent = amount;
        }

        if (rowElement && amount > 0) {
            rowElement.classList.add('unlocked');
        }
    }

    updateUI() {
        this.scoreDisplay.textContent = Math.floor(this.cookies);
        this.cpsDisplay.textContent = this.cps;

        // Upgrade buttons update
        this.buyCursor.textContent = `Koop Cursor (+1 cps) - ${this.cursorUpgrade.price} cookies`;
        this.buyMultiplier.textContent = `Koop Multiplier (x2 per klik) - ${this.multiplierUpgrade.price} cookies`;
        this.superKlickBtn.textContent = `Super Click (10x per klik) - ${this.superKlickUpgrade.price} cookies`;
        this.goldenKlickBtn.textContent = `Golden Click - ${this.goldenKlickUpgrade.price} cookies`;

        // Building buttons update
        this.buyGrandma.textContent = `Koop Grandma 👵 (+5 cps) - ${this.grandmaUpgrade.price} cookies`;
        this.buyFarm.textContent = `Koop Farm 🌾 (+20 cps) - ${this.farmUpgrade.price} cookies`;
        this.buyFactory.textContent = `Koop Factory 🏭 (+100 cps) - ${this.factoryUpgrade.price} cookies`;
        this.buyMine.textContent = `Koop Mine ⛏️ (+500 cps) - ${this.mineUpgrade.price} cookies`;
        this.buyBank.textContent = `Koop Bank 🏦 (+2000 cps) - ${this.bankUpgrade.price} cookies`;
        this.buyTemple.textContent = `Koop Temple 🛕 (+10000 cps) - ${this.templeUpgrade.price} cookies`;
        this.buyWizardTower.textContent = `Koop Wizard Tower 🧙 (+50000 cps) - ${this.wizardTowerUpgrade.price} cookies`;

        // Shop buttons update
        this.buyCursorShop.textContent = `Cursor - ${this.cursorUpgrade.price} cookies`;
        this.buyMultiplierShop.textContent = `Multiplier - ${this.multiplierUpgrade.price} cookies`;
        this.superKlickShop.textContent = `Super Click - ${this.superKlickUpgrade.price} cookies`;
        this.goldenKlickShop.textContent = `Golden Click - ${this.goldenKlickUpgrade.price} cookies`;
        this.buyGrandmaShop.textContent = `Grandma 👵 - ${this.grandmaUpgrade.price} cookies`;
        this.buyFarmShop.textContent = `Farm 🌾 - ${this.farmUpgrade.price} cookies`;
        this.buyFactoryShop.textContent = `Factory 🏭 - ${this.factoryUpgrade.price} cookies`;
        this.buyMineShop.textContent = `Mine ⛏️ - ${this.mineUpgrade.price} cookies`;
        this.buyBankShop.textContent = `Bank 🏦 - ${this.bankUpgrade.price} cookies`;
        this.buyTempleShop.textContent = `Temple 🛕 - ${this.templeUpgrade.price} cookies`;
        this.buyWizardTowerShop.textContent = `Wizard Tower 🧙 - ${this.wizardTowerUpgrade.price} cookies`;

        // Building displays update
        this.updateBuildingDisplay("grandma", this.grandmaUpgrade.amount);
        this.updateBuildingDisplay("farm", this.farmUpgrade.amount);
        this.updateBuildingDisplay("factory", this.factoryUpgrade.amount);
        this.updateBuildingDisplay("mine", this.mineUpgrade.amount);
        this.updateBuildingDisplay("bank", this.bankUpgrade.amount);
        this.updateBuildingDisplay("temple", this.templeUpgrade.amount);
        this.updateBuildingDisplay("wizard", this.wizardTowerUpgrade.amount);

        // Update building visuals
        if (this.grandmaUpgrade.amount > 0) {
            this.showBuildingVisual("grandma", this.grandmaUpgrade.amount);
        }
        if (this.farmUpgrade.amount > 0) {
            this.showBuildingVisual("farm", this.farmUpgrade.amount);
        }
        if (this.factoryUpgrade.amount > 0) {
            this.showBuildingVisual("factory", this.factoryUpgrade.amount);
        }
        if (this.mineUpgrade.amount > 0) {
            this.showBuildingVisual("mine", this.mineUpgrade.amount);
        }
        if (this.bankUpgrade.amount > 0) {
            this.showBuildingVisual("bank", this.bankUpgrade.amount);
        }
        if (this.templeUpgrade.amount > 0) {
            this.showBuildingVisual("temple", this.templeUpgrade.amount);
        }
        if (this.wizardTowerUpgrade.amount > 0) {
            this.showBuildingVisual("wizard tower", this.wizardTowerUpgrade.amount);
        }
        this.updateStats();
    }
}

// Start game
const game = new Game();

// Settings
const Settings = {
    panel: document.getElementById("settings-panel"),
    openBtn: document.getElementById("settingsBtn"),
    closeBtn: document.getElementById("close-settings"),
    darkMode: document.getElementById("dark-mode"),
    resetBtn: document.getElementById("reset-game"),

    init: function() {
        // Open / close panel
        this.openBtn.addEventListener("click", () => this.panel.style.display = "block");
        this.closeBtn.addEventListener("click", () => this.panel.style.display = "none");

        //Button to close the panel
        window.addEventListener("click", (e) => {
            if (e.target === this.panel) this.panel.style.display = "none";
        });

        // Dark mode toggle
        this.darkMode.addEventListener("change", () => {
            document.body.classList.toggle("dark-mode");
        });

        // Resets game
        this.resetBtn.addEventListener("click", () => {
            if (confirm("Weet je zeker dat je het spel wilt resetten?")) {
                location.reload();
            }
        });
    }
};

// Stats Panel
const Stats = {
    panel: document.getElementById("statsPanel"),
    openBtn: document.getElementById("statsBtn"),
    closeBtn: document.getElementById("closeStats"),

    // Opens panel
    init: function() {
        this.openBtn.addEventListener("click", () => {
            this.panel.style.display = "block";
            game.updateStats(); 
        });

        // Closes panel
        this.closeBtn.addEventListener("click", () => this.panel.style.display = "none");
    }
};

Settings.init();
Stats.init();

 