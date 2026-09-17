require('dotenv').config();
const { Client, GatewayIntentBits } = require('discord.js');
const express = require('express');
const cors = require('cors');
const path = require('path');

const app = express();
app.use(cors());

// Servir les fichiers du site
app.use(express.static(path.join(__dirname)));

const client = new Client({
    intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMembers
    ]
});

// Route API pour les membres
app.get('/api/members', async (req, res) => {
    try {
        const guild = client.guilds.cache.get(process.env.GUILD_ID);
        if (!guild) {
            return res.status(404).json({ error: "Serveur Discord introuvable" });
        }

        await guild.members.fetch();
        const humanCount = guild.members.cache.filter(m => !m.user.bot).size;

        res.json({ count: humanCount });
    } catch (error) {
        console.error("Erreur Discord API:", error);
        res.status(500).json({ error: "Erreur récupération membres" });
    }
});

client.login(process.env.DISCORD_TOKEN);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Serveur Blainville RP QC démarré sur le port ${PORT}`);
});
